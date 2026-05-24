import { useState, useMemo } from "react";
import { dbAll, dbRun } from "../db.js";
import { fmt, fmtMs, dateLabel } from "../utils.js";
import GlobalStyles from "../GlobalStyles.jsx";
import AdSenseBanner from "../components/AdSenseBanner.jsx";
// PAPERCLIP: Integrate AdSense banner in History screen footer. Render a responsive
// banner after the main content in both list and detail views. Next step: QA to verify
// ad rendering and layout on desktop/mobile.

export default function HistoryScreen({ db, onBack, onResume, activeTeamId, initialGameId }) {
    const initialGames = useMemo(() => dbAll(db, "SELECT * FROM games WHERE team_id = ? ORDER BY id DESC", [activeTeamId]), [db, activeTeamId]);

    const initialSelection = useMemo(() => {
        if (!initialGameId) return null;
        return initialGames.find(g => g.id === initialGameId) || null;
    }, [initialGameId, initialGames]);

    const initialGameData = useMemo(() => {
        if (!initialSelection) return { players: [], log: [], periodType: "quarters" };
        const pt = initialSelection.period_type ?? "quarters";
        const gp = dbAll(db, `
      SELECT gp.*, p.name, p.number
      FROM game_players gp JOIN players p ON p.id=gp.player_id
      WHERE gp.game_id=? ORDER BY gp.court_ms DESC
    `, [initialSelection.id]);
        const subs = dbAll(db, `
      SELECT s.id, s.game_time_sec, s.quarter, s.wall_time, po.name as out_name, pi.name as in_name
      FROM substitutions s
      JOIN players po ON po.id=s.player_out_id
      JOIN players pi ON pi.id=s.player_in_id
      WHERE s.game_id=? ORDER BY s.id
    `, [initialSelection.id]);
        const events = dbAll(db, `SELECT id, event_type, game_time_sec, quarter, detail, wall_time
      FROM game_events WHERE game_id=? ORDER BY id`, [initialSelection.id]);
        const merged = [
            ...subs.map(s => ({ type: 'sub', time: fmt(s.game_time_sec), timeSec: s.game_time_sec, quarter: s.quarter, out: s.out_name, in: s.in_name, sortId: s.id, tbl: 's', wallTime: s.wall_time })),
            ...events.map(e => ({ type: e.event_type, time: fmt(e.game_time_sec), timeSec: e.game_time_sec, quarter: e.quarter, detail: e.detail, sortId: e.id, tbl: 'e', wallTime: e.wall_time })),
        ];
        merged.sort((a, b) => {
            if (a.wallTime && b.wallTime) return a.wallTime - b.wallTime;
            if (a.quarter !== b.quarter) return a.quarter - b.quarter;
            if (a.timeSec !== b.timeSec) return a.timeSec - b.timeSec;
            if (a.tbl !== b.tbl) return a.tbl === 'e' ? -1 : 1;
            return a.sortId - b.sortId;
        });
        return { players: gp, log: merged.map((e, i) => ({ ...e, ts: `h-${i}` })), periodType: pt };
    }, [db, initialSelection]);

    const [games, setGames] = useState(initialGames);
    const [selected, setSelected] = useState(initialSelection);
    const [gamePlayers, setGamePlayers] = useState(initialGameData.players);
    const [eventLog, setEventLog] = useState(initialGameData.log);
    const [selectedPeriodType, setSelectedPeriodType] = useState(initialGameData.periodType);
    const [detailTab, setDetailTab] = useState("summary");

    const selectGame = (g) => {
        setSelected(g);
        setDetailTab("summary");
        const pt = g.period_type ?? "quarters";
        setSelectedPeriodType(pt);
        const gp = dbAll(db, `
      SELECT gp.*, p.name, p.number
      FROM game_players gp JOIN players p ON p.id=gp.player_id
      WHERE gp.game_id=? ORDER BY gp.court_ms DESC
    `, [g.id]);
        setGamePlayers(gp);
        const subs = dbAll(db, `
      SELECT s.id, s.game_time_sec, s.quarter, s.wall_time, po.name as out_name, pi.name as in_name
      FROM substitutions s
      JOIN players po ON po.id=s.player_out_id
      JOIN players pi ON pi.id=s.player_in_id
      WHERE s.game_id=? ORDER BY s.id
    `, [g.id]);
        const events = dbAll(db, `SELECT id, event_type, game_time_sec, quarter, detail, wall_time
      FROM game_events WHERE game_id=? ORDER BY id`, [g.id]);
        const merged = [
            ...subs.map(s => ({ type: 'sub', time: fmt(s.game_time_sec), timeSec: s.game_time_sec, quarter: s.quarter, out: s.out_name, in: s.in_name, sortId: s.id, tbl: 's', wallTime: s.wall_time })),
            ...events.map(e => ({ type: e.event_type, time: fmt(e.game_time_sec), timeSec: e.game_time_sec, quarter: e.quarter, detail: e.detail, sortId: e.id, tbl: 'e', wallTime: e.wall_time })),
        ];
        merged.sort((a, b) => {
            if (a.wallTime && b.wallTime) return a.wallTime - b.wallTime;
            if (a.quarter !== b.quarter) return a.quarter - b.quarter;
            if (a.timeSec !== b.timeSec) return a.timeSec - b.timeSec;
            if (a.tbl !== b.tbl) return a.tbl === 'e' ? -1 : 1;
            return a.sortId - b.sortId;
        });
        setEventLog(merged.map((e, i) => ({ ...e, ts: `h-${i}` })));
    };

    const deleteGame = (id) => {
        if (!confirm("Delete this game and all its data?")) return;
        dbRun(db, "DELETE FROM substitutions WHERE game_id=?", [id]);
        dbRun(db, "DELETE FROM game_events WHERE game_id=?", [id]);
        dbRun(db, "DELETE FROM game_players WHERE game_id=?", [id]);
        dbRun(db, "DELETE FROM games WHERE id=?", [id]);
        setGames(gs => gs.filter(g => g.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    // Track if there are any active (unfinished) games in the history list
    const hasActive = useMemo(() => games.some(g => !g.finished), [games]);

    if (selected) return (
        <div className="app">
            <GlobalStyles />
            <div className="hdr">
                <button className="hbtn" onClick={() => setSelected(null)}>← BACK</button>
                <span className="hdr-title" style={{ fontSize: 15 }}>{selected.opponent}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--text-dim)" }}>
                    {dateLabel(selected.date)} · {fmt(selected.total_secs)}
                </span>
                <div className="hdr-acts">
                    {!selected.finished && <button className="hbtn active" onClick={() => onResume(selected.id)}>RESUME</button>}
                    <button className="btn-danger btn-sm" onClick={() => deleteGame(selected.id)}>DELETE</button>
                </div>
            </div>
            <div style={{ padding: "10px 14px 0", display: "flex", gap: 0, borderBottom: "1px solid var(--panel-border)", flexShrink: 0 }}>
                <button
                    onClick={() => setDetailTab("summary")}
                    style={{
                        flex: 1, padding: "8px 0", border: "none", cursor: "pointer",
                        fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: "1px",
                        background: "transparent",
                        color: detailTab === "summary" ? "var(--amber)" : "var(--text-dim)",
                        borderBottom: detailTab === "summary" ? "2px solid var(--amber)" : "2px solid transparent",
                    }}
                >SUMMARY</button>
                <button
                    onClick={() => setDetailTab("detail")}
                    style={{
                        flex: 1, padding: "8px 0", border: "none", cursor: "pointer",
                        fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: "1px",
                        background: "transparent",
                        color: detailTab === "detail" ? "var(--amber)" : "var(--text-dim)",
                        borderBottom: detailTab === "detail" ? "2px solid var(--amber)" : "2px solid transparent",
                    }}
                >DETAIL</button>
            </div>
            <div className="scroll-area">
                {detailTab === "summary" && <>
                    <div>
                        {gamePlayers.map(gp => {
                            const totalMs = selected.total_secs > 0 ? selected.total_secs * 1000 : 1;
                            const pct = Math.round(gp.court_ms / totalMs * 100);
                            return (
                                <div key={gp.id} className="srow">
                                    <div><span className="srow-num">#{gp.number}</span><span style={{ fontWeight: 600 }}>{gp.name}</span>
                                        {gp.is_starter === 1 && <span style={{ fontSize: 9, color: "var(--amber)", marginLeft: 6 }}>STARTER</span>}
                                    </div>
                                    <div className="srow-time">{fmtMs(gp.court_ms)}</div>
                                    <div className="srow-pct">{pct}%</div>
                                </div>
                            );
                        })}
                    </div>
                </>}
                {detailTab === "detail" && <>
                    <div className="sec-hd">GAME LOG <span className="sec-hd-sub">{eventLog.length} events</span></div>
                    {eventLog.length === 0 && <div className="empty">No events recorded</div>}
                    {(() => {
                        const grouped = [];
                        eventLog.forEach(e => {
                            const prev = grouped[grouped.length - 1];
                            if (e.type === 'sub' && prev && prev.type === 'sub-group' && prev.time === e.time && prev.quarter === e.quarter) {
                                prev.subs.push(e);
                            } else if (e.type === 'sub') {
                                grouped.push({ type: 'sub-group', time: e.time, quarter: e.quarter, subs: [e], ts: e.ts });
                            } else {
                                grouped.push(e);
                            }
                        });
                        return grouped.map(e => (
                            <div key={e.ts} className="log-entry" style={e.type === 'sub-group' && e.subs.length > 1 ? { flexDirection: 'column', alignItems: 'flex-start', gap: 4 } : {}}>
                                {e.type === 'sub-group' && e.subs.length === 1 && <>
                                    <span className="log-t">{selectedPeriodType === "halves" ? (e.quarter === 3 ? "OT" : `H${e.quarter}`) : (e.quarter === 5 ? "OT" : `Q${e.quarter}`)} {e.time}</span>
                                    <span style={{ color: "var(--red)", fontWeight: 600 }}>{e.subs[0].out}</span>
                                    <span style={{ color: "var(--text-dim)" }}>→</span>
                                    <span style={{ color: "var(--green)", fontWeight: 600 }}>{e.subs[0].in}</span>
                                </>}
                                {e.type === 'sub-group' && e.subs.length > 1 && <>
                                    <span className="log-t">{selectedPeriodType === "halves" ? (e.quarter === 3 ? "OT" : `H${e.quarter}`) : (e.quarter === 5 ? "OT" : `Q${e.quarter}`)} {e.time}</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 4 }}>
                                        {e.subs.map((s, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: "var(--red)", fontWeight: 600 }}>{s.out}</span>
                                                <span style={{ color: "var(--text-dim)" }}>→</span>
                                                <span style={{ color: "var(--green)", fontWeight: 600 }}>{s.in}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>}
                                {e.type === 'clock_start' && <>
                                    <span className="log-t">{selectedPeriodType === "halves" ? (e.quarter === 3 ? "OT" : `H${e.quarter}`) : (e.quarter === 5 ? "OT" : `Q${e.quarter}`)} {e.time}</span>
                                    <span style={{ color: "var(--green)" }}>▶ Clock started</span>
                                </>}
                                {e.type === 'clock_pause' && <>
                                    <span className="log-t">{selectedPeriodType === "halves" ? (e.quarter === 3 ? "OT" : `H${e.quarter}`) : (e.quarter === 5 ? "OT" : `Q${e.quarter}`)} {e.time}</span>
                                    <span style={{ color: "var(--amber)" }}>⏸ Clock paused</span>
                                </>}
                                {e.type === 'quarter_change' && <>
                                    <span className="log-t">{selectedPeriodType === "halves" ? (e.quarter === 3 ? "OT" : `H${e.quarter}`) : (e.quarter === 5 ? "OT" : `Q${e.quarter}`)} {e.time}</span>
                                    <span style={{ color: "var(--blue)" }}>◆ {e.detail} started</span>
                                </>}
                                {e.type === 'period_end' && <>
                                    <span className="log-t">{selectedPeriodType === "halves" ? (e.quarter === 3 ? "OT" : `H${e.quarter}`) : (e.quarter === 5 ? "OT" : `Q${e.quarter}`)} {e.time}</span>
                                    <span style={{ color: "var(--text-mid)" }}>■ {e.detail} ended</span>
                                </>}
                            </div>
                        ));
                    })()}
                </>}
                {selected.notes ? <div style={{ marginTop: 16, padding: 10, background: "rgba(255,255,255,.03)", borderRadius: 6, fontSize: 12, color: "var(--text-dim)" }}>{selected.notes}</div> : null}
            </div>
        </div>
    );

    return (
        <div className="app">
            <GlobalStyles />
            <div className="hdr">
                <button className="hbtn" onClick={onBack}>← BACK</button>
                <span className="hdr-title">HISTORY</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--text-dim)" }}>{games.length} games</span>
            </div>
            <div className="scroll-area">
                {games.length === 0 && <div className="empty">No games yet — start a new one!</div>}
                {games.map(g => (
                    <div key={g.id} className="game-card" onClick={() => selectGame(g)}>
                        <div className="game-card-top">
                            <span className="game-opp">vs {g.opponent}</span>
                            <span className={`game-badge ${g.finished ? "gbadge-done" : "gbadge-live"}`}>{g.finished ? "DONE" : "IN PROGRESS"}</span>
                        </div>
                        <div className="game-meta">
                            <span className="game-date">{dateLabel(g.date)}</span>
                            <span>{fmt(g.total_secs)}</span>
                        </div>
                    </div>
                ))}
            </div>
            {!hasActive && <AdSenseBanner />}
        </div>
    );
}
