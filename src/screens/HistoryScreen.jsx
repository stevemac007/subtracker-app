import { useState, useMemo } from "react";
import { dbAll, dbRun } from "../db.js";
import { fmt, fmtMs, dateLabel } from "../utils.js";
import GlobalStyles from "../GlobalStyles.jsx";
import AdSenseBanner from "../components/AdSenseBanner.jsx";
// PAPERCLIP: Integrate AdSense banner in History screen footer. Render a responsive
// banner after the main content in both list and detail views. Next step: QA to verify
// ad rendering and layout on desktop/mobile.

export default function HistoryScreen({ db, onBack, onResume, activeTeamId }) {
    const initialGames = useMemo(() => dbAll(db, "SELECT * FROM games WHERE team_id = ? ORDER BY id DESC", [activeTeamId]), [db, activeTeamId]);
    const [games, setGames] = useState(initialGames);
    const [selected, setSelected] = useState(null);
    const [gamePlayers, setGamePlayers] = useState([]);
    const [eventLog, setEventLog] = useState([]);
    const [selectedPeriodType, setSelectedPeriodType] = useState("quarters");

    const selectGame = (g) => {
        setSelected(g);
        const pt = g.period_type ?? "quarters";
        setSelectedPeriodType(pt);
        const gp = dbAll(db, `
      SELECT gp.*, p.name, p.number
      FROM game_players gp JOIN players p ON p.id=gp.player_id
      WHERE gp.game_id=? ORDER BY gp.court_ms DESC
    `, [g.id]);
        setGamePlayers(gp);
        const subs = dbAll(db, `
      SELECT s.id, s.game_time_sec, s.quarter, po.name as out_name, pi.name as in_name
      FROM substitutions s
      JOIN players po ON po.id=s.player_out_id
      JOIN players pi ON pi.id=s.player_in_id
      WHERE s.game_id=? ORDER BY s.id
    `, [g.id]);
        const events = dbAll(db, `SELECT id, event_type, game_time_sec, quarter, detail
      FROM game_events WHERE game_id=? ORDER BY id`, [g.id]);
        const merged = [
            ...subs.map(s => ({ type: 'sub', time: fmt(s.game_time_sec), timeSec: s.game_time_sec, quarter: s.quarter, out: s.out_name, in: s.in_name, sortId: s.id, tbl: 's' })),
            ...events.map(e => ({ type: e.event_type, time: fmt(e.game_time_sec), timeSec: e.game_time_sec, quarter: e.quarter, detail: e.detail, sortId: e.id, tbl: 'e' })),
        ];
        merged.sort((a, b) => {
            if (a.timeSec !== b.timeSec) return a.timeSec - b.timeSec;
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
                <div className="hdr-acts">
                    {!selected.finished && <button className="hbtn active" onClick={() => onResume(selected.id)}>RESUME</button>}
                    <button className="btn-danger btn-sm" onClick={() => deleteGame(selected.id)}>DELETE</button>
                </div>
            </div>
            <div className="scroll-area">
                <div className="sec-hd">
                    {dateLabel(selected.date)}
                    <span className="sec-hd-sub">{fmt(selected.total_secs)} game time</span>
                </div>
                <div style={{ marginBottom: 16 }}>
                    {gamePlayers.map(gp => {
                        const totalMs = selected.total_secs > 0 ? selected.total_secs * 1000 : 1;
                        const pct = (gp.court_ms / totalMs * 100).toFixed(1);
                        return (
                            <div key={gp.id} className="srow">
                                <div><span className="srow-num">#{gp.number}</span><span style={{ fontWeight: 600 }}>{gp.name}</span>
                                    {gp.is_starter === 1 && <span style={{ fontSize: 9, color: "var(--amber)", marginLeft: 6 }}>STARTER</span>}
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div className="srow-time">{fmtMs(gp.court_ms)}</div>
                                    <div className="srow-pct">{pct}% of game</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="sec-hd">GAME LOG <span className="sec-hd-sub">{eventLog.length} events</span></div>
                {eventLog.length === 0 && <div className="empty">No events recorded</div>}
                {eventLog.map(e => (
                    <div key={e.ts} className="log-entry">
                        <span className="log-t">{selectedPeriodType === "halves" ? (e.quarter === 3 ? "OT" : `H${e.quarter}`) : (e.quarter === 5 ? "OT" : `Q${e.quarter}`)} {e.time}</span>
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
                {selected.notes ? <div style={{ marginTop: 16, padding: 10, background: "rgba(255,255,255,.03)", borderRadius: 6, fontSize: 12, color: "var(--text-dim)" }}>{selected.notes}</div> : null}
            </div>
            {selected.finished && <AdSenseBanner />}
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
