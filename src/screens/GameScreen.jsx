import { useState, useEffect, useRef, useCallback, useReducer } from "react";
import { dbAll, dbGet, dbRun, saveDb } from "../db.js";
import { fmt, fmtMs } from "../utils.js";
import GlobalStyles from "../GlobalStyles.jsx";
import FitName from "../FitName.jsx";

export default function GameScreen({ db, gameId, initialPlayers, onEnd }) {
    const gameRow = dbGet(db, "SELECT * FROM games WHERE id=?", [gameId]);
    const periodType = gameRow?.period_type ?? "quarters";
    const clockDirection = gameRow?.clock_direction ?? "up";
    const periodDurationSec = gameRow?.period_duration_sec ?? 0;

    const periodLabels = periodType === "halves"
        ? ["H1", "H2", "OT"]
        : ["Q1", "Q2", "Q3", "Q4", "OT"];

    const [quarter, setQuarter] = useState(1);
    const [players, setPlayers] = useState(initialPlayers);
    const [selOut, setSelOut] = useState(new Set());
    const [selIn, setSelIn] = useState(new Set());
    const [showStats, setShowStats] = useState(false);
    const [showLog, setShowLog] = useState(false);
    const [sortMode, setSortMode] = useState("game");
    const [eventLog, setEventLog] = useState([]);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);
    // ── Wall-clock timing ──
    const runningRef = useRef(false);
    const gameAccMs = useRef((gameRow?.total_secs ?? 0) * 1000);
    const totalRunMs = useRef((gameRow?.total_secs ?? 0) * 1000);
    const periodAccMs = useRef(0);
    const clockStartWall = useRef(null);
    const stintStart = useRef({});
    const bankedMs = useRef({});
    const stintRoleStart = useRef({});
    const stintRoleBanked = useRef({});

    // Load existing court times for resumed games
    useEffect(() => {
        const gps = dbAll(db, "SELECT player_id, court_ms FROM game_players WHERE game_id=?", [gameId]);
        gps.forEach(gp => { bankedMs.current[gp.player_id] = gp.court_ms; });
        initialPlayers.forEach(p => { stintRoleBanked.current[p.id] = 0; stintRoleStart.current[p.id] = null; });
        const subs = dbAll(db, `SELECT s.id, s.game_time_sec, s.quarter, po.name as out_name, pi.name as in_name
      FROM substitutions s
      JOIN players po ON po.id=s.player_out_id
      JOIN players pi ON pi.id=s.player_in_id
      WHERE s.game_id=? ORDER BY s.id`, [gameId]);
        const events = dbAll(db, `SELECT id, event_type, game_time_sec, quarter, detail
      FROM game_events WHERE game_id=? ORDER BY id`, [gameId]);
        const merged = [
            ...subs.map(s => ({ type: 'sub', time: fmt(s.game_time_sec), quarter: s.quarter, out: s.out_name, in: s.in_name, sortId: s.id, tbl: 's' })),
            ...events.map(e => ({ type: e.event_type, time: fmt(e.game_time_sec), quarter: e.quarter, detail: e.detail, sortId: e.id, tbl: 'e' })),
        ];
        merged.sort((a, b) => {
            if (a.time !== b.time) return a.time.localeCompare(b.time);
            return a.sortId - b.sortId;
        });
        setEventLog(merged.reverse().map((e, i) => ({ ...e, ts: `loaded-${i}` })));
    }, []);

    // ── Screen Wake Lock ──
    useEffect(() => {
        let wakeLock = null;
        const request = async () => {
            try {
                if ('wakeLock' in navigator && document.visibilityState === 'visible') {
                    wakeLock = await navigator.wakeLock.request('screen');
                }
            } catch { /* user denied or not supported */ }
        };
        const onVisChange = () => { if (document.visibilityState === 'visible') request(); };
        request();
        document.addEventListener('visibilitychange', onVisChange);
        return () => {
            document.removeEventListener('visibilitychange', onVisChange);
            wakeLock?.release();
        };
    }, []);

    const [, tick] = useReducer(x => x + 1, 0);
    const rafRef = useRef(null);
    useEffect(() => {
        const loop = () => { tick(); rafRef.current = requestAnimationFrame(loop); };
        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    const now = Date.now();
    const displayGameMs = runningRef.current
        ? gameAccMs.current + (now - clockStartWall.current)
        : gameAccMs.current;
    const liveTotalMs = runningRef.current
        ? totalRunMs.current + (now - clockStartWall.current)
        : totalRunMs.current;
    const displayPeriodMs = runningRef.current
        ? periodAccMs.current + (now - clockStartWall.current)
        : periodAccMs.current;
    const displayClockMs = clockDirection === "down"
        ? Math.max(0, periodDurationSec * 1000 - displayPeriodMs)
        : displayGameMs;

    const liveCourtMs = (pid) => {
        const b = bankedMs.current[pid] ?? 0;
        const s = stintStart.current[pid];
        return s != null ? b + (now - s) : b;
    };

    const liveStintMs = (pid) => {
        const b = stintRoleBanked.current[pid] ?? 0;
        const s = stintRoleStart.current[pid];
        return s != null ? b + (now - s) : b;
    };

    const persistTimes = useCallback(() => {
        const totalSec = Math.floor(totalRunMs.current / 1000);
        db.run("UPDATE games SET total_secs=? WHERE id=?", [totalSec, gameId]);
        players.forEach(p => {
            const ms = bankedMs.current[p.id] ?? 0;
            db.run("UPDATE game_players SET court_ms=? WHERE game_id=? AND player_id=?", [ms, gameId, p.id]);
        });
        saveDb(db);
    }, [db, gameId, players]);

    const logEvent = useCallback((eventType, detail = '') => {
        const elapsed = runningRef.current
            ? gameAccMs.current + (Date.now() - clockStartWall.current)
            : gameAccMs.current;
        const gameSec = Math.floor(elapsed / 1000);
        db.run("INSERT INTO game_events (game_id,event_type,game_time_sec,quarter,detail) VALUES (?,?,?,?,?)",
            [gameId, eventType, gameSec, quarter, detail]);
        saveDb(db);
        setEventLog(log => [{ type: eventType, time: fmt(gameSec), quarter, detail, ts: Date.now() + Math.random() }, ...log].slice(0, 100));
    }, [db, gameId, quarter]);

    const startClock = useCallback(() => {
        if (runningRef.current) return;
        const w = Date.now();
        clockStartWall.current = w;
        runningRef.current = true;
        setPlayers(ps => { ps.forEach(p => { if (p.onCourt) stintStart.current[p.id] = w; stintRoleStart.current[p.id] = w; }); return ps; });
        logEvent('clock_start');
    }, [logEvent]);

    const pauseClock = useCallback(() => {
        if (!runningRef.current) return;
        const w = Date.now();
        const elapsed = w - clockStartWall.current;
        gameAccMs.current += elapsed;
        totalRunMs.current += elapsed;
        periodAccMs.current += elapsed;
        clockStartWall.current = null;
        runningRef.current = false;
        setPlayers(ps => {
            ps.forEach(p => {
                if (stintStart.current[p.id] != null) {
                    bankedMs.current[p.id] = (bankedMs.current[p.id] ?? 0) + (w - stintStart.current[p.id]);
                    stintStart.current[p.id] = null;
                }
                if (stintRoleStart.current[p.id] != null) {
                    stintRoleBanked.current[p.id] = (stintRoleBanked.current[p.id] ?? 0) + (w - stintRoleStart.current[p.id]);
                    stintRoleStart.current[p.id] = null;
                }
            });
            return ps;
        });
        persistTimes();
        logEvent('clock_pause');
    }, [persistTimes, logEvent]);

    const changeQuarter = (newQ) => {
        pauseClock();
        periodAccMs.current = 0;
        setQuarter(newQ);
        const gameSec = Math.floor(gameAccMs.current / 1000);
        const label = periodType === "halves"
            ? (newQ === 3 ? "OT" : `H${newQ}`)
            : (newQ === 5 ? "OT" : `Q${newQ}`);
        db.run("INSERT INTO game_events (game_id,event_type,game_time_sec,quarter,detail) VALUES (?,?,?,?,?)",
            [gameId, 'quarter_change', gameSec, newQ, label]);
        saveDb(db);
        setEventLog(log => [{ type: 'quarter_change', time: fmt(gameSec), quarter: newQ, detail: label, ts: Date.now() }, ...log].slice(0, 100));
    };

    const toggleClock = () => runningRef.current ? pauseClock() : startClock();
    const zeroClock = () => { pauseClock(); gameAccMs.current = 0; periodAccMs.current = 0; };

    const tapPlayer = (pid) => {
        const p = players.find(x => x.id === pid);
        if (!p) return;
        if (p.onCourt) setSelOut(prev => { const n = new Set(prev); n.has(pid) ? n.delete(pid) : n.add(pid); return n; });
        else setSelIn(prev => { const n = new Set(prev); n.has(pid) ? n.delete(pid) : n.add(pid); return n; });
    };

    const outArr = [...selOut], inArr = [...selIn];
    const pairCount = Math.min(outArr.length, inArr.length);
    const pairs = outArr.slice(0, pairCount).map((oid, i) => ({ out: oid, in: inArr[i] }));
    const extraOut = outArr.slice(pairCount);
    const extraIn = inArr.slice(pairCount);
    const canConfirm = pairCount > 0 && extraOut.length === 0 && extraIn.length === 0;

    const confirmSwap = () => {
        if (!canConfirm) return;
        const w = Date.now();
        const gameSec = Math.floor(displayGameMs / 1000);
        const newLog = [];

        // Perform timing updates on refs and DB writes BEFORE the state updater
        pairs.forEach(({ out: oid, in: iid }) => {
            const outP = players.find(p => p.id === oid), inP = players.find(p => p.id === iid);
            if (!outP || !inP) return;

            if (stintStart.current[oid] != null) {
                bankedMs.current[oid] = (bankedMs.current[oid] ?? 0) + (w - stintStart.current[oid]);
                stintStart.current[oid] = null;
            }
            if (runningRef.current) stintStart.current[iid] = w;

            stintRoleBanked.current[oid] = 0;
            stintRoleStart.current[oid] = runningRef.current ? w : null;
            stintRoleBanked.current[iid] = 0;
            stintRoleStart.current[iid] = runningRef.current ? w : null;

            db.run("INSERT INTO substitutions (game_id,game_time_sec,quarter,player_out_id,player_in_id) VALUES (?,?,?,?,?)",
                [gameId, gameSec, quarter, oid, iid]);
            db.run("UPDATE game_players SET court_ms=? WHERE game_id=? AND player_id=?",
                [bankedMs.current[oid] ?? 0, gameId, oid]);
            db.run("UPDATE game_players SET court_ms=? WHERE game_id=? AND player_id=?",
                [bankedMs.current[iid] ?? 0, gameId, iid]);

            newLog.push({ type: 'sub', time: fmt(gameSec), quarter, out: outP.name, in: inP.name, ts: Date.now() + newLog.length });
        });
        db.run("UPDATE games SET total_secs=? WHERE id=?", [Math.floor(totalRunMs.current / 1000), gameId]);
        saveDb(db);

        // Pure state update — no side effects
        setPlayers(ps => {
            const updated = [...ps];
            pairs.forEach(({ out: oid, in: iid }) => {
                const oi = updated.findIndex(p => p.id === oid), ii = updated.findIndex(p => p.id === iid);
                if (oi >= 0) updated[oi] = { ...updated[oi], onCourt: false };
                if (ii >= 0) updated[ii] = { ...updated[ii], onCourt: true };
            });
            return updated;
        });

        setEventLog(log => [...newLog, ...log].slice(0, 100));
        setSelOut(new Set()); setSelIn(new Set());

        // Show toast
        const toastMsg = pairs.map(({ out: oid, in: iid }) => {
            const op = players.find(p => p.id === oid), ip = players.find(p => p.id === iid);
            return `${op?.name} → ${ip?.name}`;
        }).join("  ·  ");
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToast(toastMsg);
        toastTimer.current = setTimeout(() => setToast(null), 15000);
    };

    const cancelSel = () => { setSelOut(new Set()); setSelIn(new Set()); };

    const endGame = () => {
        pauseClock();
        const totalSec = Math.floor(totalRunMs.current / 1000);
        players.forEach(p => {
            db.run("UPDATE game_players SET court_ms=? WHERE game_id=? AND player_id=?",
                [bankedMs.current[p.id] ?? 0, gameId, p.id]);
        });
        db.run("UPDATE games SET finished=1,total_secs=? WHERE id=?", [totalSec, gameId]);
        saveDb(db);
        onEnd();
    };

    const onCourt = players.filter(p => p.onCourt).sort((a, b) =>
        sortMode === "stint" ? liveStintMs(b.id) - liveStintMs(a.id) : liveCourtMs(b.id) - liveCourtMs(a.id)
    );
    const bench = players.filter(p => !p.onCourt).sort((a, b) =>
        sortMode === "stint" ? liveStintMs(b.id) - liveStintMs(a.id) : liveCourtMs(b.id) - liveCourtMs(a.id)
    );
    const hasSel = selOut.size > 0 || selIn.size > 0;
    const isRunning = runningRef.current;
    const opponent = gameRow?.opponent ?? "Opponent";

    return (
        <>
            <GlobalStyles />
            <div className="app">
                <div className="hdr">
                    <span className="hdr-title" style={{ fontSize: 16 }}>vs {opponent}</span>
                    <div className="hdr-acts">
                        <button className="hbtn hbtn-lg" onClick={() => setShowLog(true)}>LOG</button>
                        <button className="hbtn hbtn-lg" onClick={() => setShowStats(true)}>STATS</button>
                        <button className="hbtn hbtn-lg" onClick={endGame}>END</button>
                    </div>
                </div>

                {toast && (
                    <div className="sub-toast" onClick={() => setToast(null)}>
                        <span className="sub-toast-label">SUB</span> {toast}
                    </div>
                )}

                <div className="clock-bar">
                    <div className={`clock-disp ${isRunning ? "" : "paused"}`}>{fmt(displayClockMs / 1000)}</div>
                    <div className="clock-mid">
                        <div className="qbtns">
                            {periodLabels.map((q, i) => (
                                <button key={q} className={`qbtn ${quarter === i + 1 ? "active" : ""}`}
                                    onClick={() => changeQuarter(i + 1)}>{q}</button>
                            ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="cbtns">
                                <button className="cbtn cbtn-play" onClick={toggleClock}>{isRunning ? "⏸ PAUSE" : "▶ START"}</button>
                                <button className="cbtn cbtn-zero" onClick={zeroClock}>ZERO</button>
                            </div>
                            <span className="period-pill">{periodLabels[quarter - 1] ?? periodLabels[periodLabels.length - 1]} · {isRunning ? "LIVE" : "STOPPED"}</span>
                        </div>
                    </div>
                    <button className={`hbtn${sortMode === "stint" ? " active" : ""}`}
                        style={{ writingMode: "vertical-lr", padding: "14px 14px", fontSize: 14, letterSpacing: 2, lineHeight: 1 }}
                        onClick={() => setSortMode(s => s === "game" ? "stint" : "game")}>
                        {sortMode === "game" ? "GAME" : "STINT"}
                    </button>
                </div>

                <div className="court-area">
                    <div className="zone">
                        <div className="zone-hdr">
                            <div className="zone-title" style={{ color: "var(--green)" }}><span className="dot dot-g" />ON COURT</div>
                            <span className="zone-cnt">{onCourt.length}/5</span>
                        </div>
                        <div className="pgrid">
                            {onCourt.map(p => {
                                const sel = selOut.has(p.id);
                                return (
                                    <div key={p.id} className={`pcard on-c ${sel ? "sel-out" : ""}`} onClick={() => tapPlayer(p.id)}>
                                        <div className="pnum">#{p.number}</div>
                                        <div className="pinfo">
                                            <FitName>{p.name}</FitName>
                                            <span className="ptime">{fmtMs(liveCourtMs(p.id))}</span>
                                            <span className="pstint" style={{ color: "var(--green)" }}>▲ {fmtMs(liveStintMs(p.id))}</span>
                                            {sel && <span className="pbadge b-out">OUT ▼</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="zone">
                        <div className="zone-hdr">
                            <div className="zone-title" style={{ color: "var(--blue)" }}><span className="dot dot-b" />BENCH</div>
                            <span className="zone-cnt">{bench.length}</span>
                        </div>
                        <div className="pgrid">
                            {bench.map(p => {
                                const sel = selIn.has(p.id);
                                return (
                                    <div key={p.id} className={`pcard bnch ${sel ? "sel-in" : ""}`} onClick={() => tapPlayer(p.id)}>
                                        <div className="pnum">#{p.number}</div>
                                        <div className="pinfo">
                                            <FitName>{p.name}</FitName>
                                            <span className="ptime">{fmtMs(liveCourtMs(p.id))}</span>
                                            <span className="pstint" style={{ color: "var(--blue)" }}>▼ {fmtMs(liveStintMs(p.id))}</span>
                                            {sel && <span className="pbadge b-in">IN ▲</span>}
                                        </div>
                                    </div>
                                );
                            })}
                            {bench.length === 0 && <div style={{ padding: "10px 6px", fontSize: 10, color: "var(--text-dim)", fontStyle: "italic" }}>Full squad on court</div>}
                        </div>
                    </div>
                </div>

                {hasSel && (
                    <div className="sub-panel">
                        <div className="sub-title">
                            SUBSTITUTION — {selOut.size} OUT · {selIn.size} IN
                            {(extraOut.length > 0 || extraIn.length > 0) && <span style={{ color: "var(--red)", marginLeft: 8, fontSize: 10 }}>⚠ UNEVEN</span>}
                        </div>
                        <div className="sub-pairs">
                            {pairs.map(({ out: oid, in: iid }, i) => {
                                const op = players.find(p => p.id === oid), ip = players.find(p => p.id === iid);
                                return <div key={i} className="spair"><span className="sp-out">{op?.name}</span><span className="sp-arr">→</span><span className="sp-in">{ip?.name}</span></div>;
                            })}
                            {extraOut.map((oid, i) => { const op = players.find(p => p.id === oid); return <div key={"xo" + i} className="spair"><span className="sp-out">{op?.name}</span><span className="sp-arr">→</span><span className="sp-um">needs IN</span></div>; })}
                            {extraIn.map((iid, i) => { const ip = players.find(p => p.id === iid); return <div key={"xi" + i} className="spair"><span className="sp-um">needs OUT</span><span className="sp-arr">→</span><span className="sp-in">{ip?.name}</span></div>; })}
                        </div>
                        <div className="sub-acts">
                            <button className="sbtn sbtn-ok" disabled={!canConfirm} onClick={confirmSwap}>
                                CONFIRM{pairCount > 1 ? ` ${pairCount} SUBS` : " SUB"}
                            </button>
                            <button className="sbtn sbtn-cl" onClick={cancelSel}>CANCEL</button>
                        </div>
                    </div>
                )}
            </div>

            {showStats && (
                <div className="overlay" onClick={() => setShowStats(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">PLAYER STATS</div>
                        {[...players].sort((a, b) => liveCourtMs(b.id) - liveCourtMs(a.id)).map(p => {
                            const ms = liveCourtMs(p.id);
                            const totalMs = liveTotalMs > 0 ? liveTotalMs : 1;
                            const pct = Math.round(ms / totalMs * 100);
                            return (
                                <div key={p.id} className="srow">
                                    <div><span className="srow-num">#{p.number}</span><span style={{ fontWeight: 600 }}>{p.name}</span>
                                        {p.onCourt && <span style={{ fontSize: 9, color: "var(--green)", marginLeft: 6 }}>● LIVE</span>}
                                    </div>
                                    <div className="srow-time">{fmtMs(ms)}</div>
                                    <div className="srow-pct">{pct}%</div>
                                </div>
                            );
                        })}
                        <button className="hbtn" style={{ width: "100%", marginTop: 14, padding: "9px", fontSize: 13 }} onClick={() => setShowStats(false)}>CLOSE</button>
                    </div>
                </div>
            )}

            {showLog && (
                <div className="overlay" onClick={() => setShowLog(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">GAME LOG</div>
                        {eventLog.length === 0 && <div className="empty">No events yet</div>}
                        {eventLog.map(e => (
                            <div key={e.ts} className="log-entry">
                                <span className="log-t">{periodType === "halves" ? (e.quarter === 3 ? "OT" : `H${e.quarter}`) : (e.quarter === 5 ? "OT" : `Q${e.quarter}`)} {e.time}</span>
                                {e.type === 'sub' && <>
                                    <span style={{ color: "var(--red)", fontWeight: 600 }}>{e.out}</span>
                                    <span style={{ color: "var(--text-dim)" }}>→</span>
                                    <span style={{ color: "var(--green)", fontWeight: 600 }}>{e.in}</span>
                                </>}
                                {e.type === 'clock_start' && <span style={{ color: "var(--green)" }}>▶ Clock started</span>}
                                {e.type === 'clock_pause' && <span style={{ color: "var(--amber)" }}>⏸ Clock paused</span>}
                                {e.type === 'quarter_change' && <span style={{ color: "var(--blue)" }}>◆ {e.detail} started</span>}
                            </div>
                        ))}
                        <button className="hbtn" style={{ width: "100%", marginTop: 14, padding: "9px", fontSize: 13 }} onClick={() => setShowLog(false)}>CLOSE</button>
                    </div>
                </div>
            )}
        </>
    );
}
