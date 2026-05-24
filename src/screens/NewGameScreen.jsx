import { useState } from "react";
import { dbAll, dbGet, saveDb } from "../db.js";
import { today } from "../utils.js";
import GlobalStyles from "../GlobalStyles.jsx";

export default function NewGameScreen({ db, onStart, onBack, activeTeamId }) {
    const teamName = dbGet(db, "SELECT name FROM team WHERE id = ?", [activeTeamId])?.name ?? "My Team";
    const allPlayers = dbAll(db, "SELECT * FROM players WHERE active = 1 AND team_id = ? ORDER BY id", [activeTeamId])
        .sort((a, b) => {
            const numA = parseInt(a.number, 10);
            const numB = parseInt(b.number, 10);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            if (!isNaN(numA)) return -1;
            if (!isNaN(numB)) return 1;
            return a.name.localeCompare(b.name);
        });

    const [opponent, setOpponent] = useState("");
    const [periodType, setPeriodType] = useState("quarters");
    const [clockDirection, setClockDirection] = useState("up");
    const [periodMinutes, setPeriodMinutes] = useState(10);
    const [active, setActive] = useState(new Set(allPlayers.slice(0, 12).map(p => p.id)));
    const [starters, setStarters] = useState(new Set(allPlayers.slice(0, 5).map(p => p.id)));

    const toggleActive = (id) => {
        setActive(prev => {
            const n = new Set(prev);
            if (n.has(id)) {
                n.delete(id);
                setStarters(s => { const ns = new Set(s); ns.delete(id); return ns; });
            } else {
                if (n.size >= 12) return prev;
                n.add(id);
            }
            return n;
        });
    };

    const toggleStarter = (id) => {
        if (!active.has(id)) return;
        setStarters(prev => {
            const n = new Set(prev);
            if (n.has(id)) { n.delete(id); return n; }
            if (n.size >= 5) return prev;
            n.add(id);
            return n;
        });
    };

    const canStart = active.size >= 5 && starters.size === 5 && opponent.trim().length > 0;

    const handleStart = () => {
        if (!canStart) return;
        const durationSec = clockDirection === "down" ? periodMinutes * 60 : 0;
        const gameId = (() => {
            db.run("INSERT INTO games (opponent, date, finished, total_secs, team_id, period_type, clock_direction, period_duration_sec) VALUES (?, ?, 0, 0, ?, ?, ?, ?)",
                [opponent.trim() || "Opponent", today(), activeTeamId, periodType, clockDirection, durationSec]);
            return dbGet(db, "SELECT last_insert_rowid() as id").id;
        })();
        saveDb(db);
        const activePlayers = allPlayers.filter(p => active.has(p.id));
        activePlayers.forEach(p => {
            db.run("INSERT INTO game_players (game_id,player_id,court_ms,is_starter) VALUES (?,?,0,?)",
                [gameId, p.id, starters.has(p.id) ? 1 : 0]);
        });
        saveDb(db);
        onStart({ gameId, players: activePlayers.map(p => ({ ...p, onCourt: starters.has(p.id) })) });
    };

    return (
        <div className="app">
            <GlobalStyles />
            <div className="hdr">
                <button className="hbtn" onClick={onBack}>← BACK</button>
                <span className="hdr-title">NEW GAME</span>
                <span className="hdr-team">{teamName}</span>
            </div>
            <div className="scroll-area">
                <div className="sec-hd">OPPONENT</div>
                <div className="field-row" style={{ marginBottom: 16 }}>
                    <input className="inp inp-full" value={opponent} placeholder="Opponent name…"
                        onChange={e => setOpponent(e.target.value)} />
                </div>

                <div className="sec-hd">GAME FORMAT</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <button className={`tog ${periodType === "quarters" ? "on" : ""}`} style={{ flex: 1 }}
                        onClick={() => { setPeriodType("quarters"); setPeriodMinutes(10); }}>QUARTERS</button>
                    <button className={`tog ${periodType === "halves" ? "on" : ""}`} style={{ flex: 1 }}
                        onClick={() => { setPeriodType("halves"); setPeriodMinutes(17); }}>HALVES</button>
                </div>

                <div className="sec-hd">CLOCK DIRECTION</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <button className={`tog ${clockDirection === "up" ? "on" : ""}`} style={{ flex: 1 }}
                        onClick={() => setClockDirection("up")}>COUNT UP</button>
                    <button className={`tog ${clockDirection === "down" ? "on" : ""}`} style={{ flex: 1 }}
                        onClick={() => setClockDirection("down")}>COUNT DOWN</button>
                </div>

                {clockDirection === "down" && (
                    <>
                        <div className="sec-hd">PERIOD DURATION (MINUTES)</div>
                        <div className="field-row" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                            <button className="tog on" style={{ width: 40, fontSize: 18 }}
                                onClick={() => setPeriodMinutes(m => Math.max(1, m - 1))}>−</button>
                            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, color: "var(--amber)", minWidth: 40, textAlign: "center" }}>{periodMinutes}</span>
                            <button className="tog on" style={{ width: 40, fontSize: 18 }}
                                onClick={() => setPeriodMinutes(m => Math.min(30, m + 1))}>+</button>
                        </div>
                    </>
                )}

                <div className="sec-hd">
                    SQUAD SELECTION
                    <span className="sec-hd-sub">{active.size}/12 active · {starters.size}/5 starters</span>
                </div>

                {allPlayers.length === 0 && (
                    <div className="empty">No active players — go to Roster to add players first.</div>
                )}

                <div className="player-setup-list">
                    {allPlayers.map(p => {
                        const isActive = active.has(p.id);
                        const isStarter = starters.has(p.id);
                        return (
                            <div key={p.id} className="player-setup-row">
                                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: "var(--amber)", textAlign: "center" }}>{p.number || "–"}</span>
                                <span style={{ fontSize: 14, fontWeight: 600, opacity: isActive ? 1 : 0.4 }}>{p.name}</span>
                                <button className={`tog ${isActive ? "on" : ""}`} onClick={() => toggleActive(p.id)}>
                                    {isActive ? "IN" : "OUT"}
                                </button>
                                <button className={`tog ${isStarter ? "start-on" : ""}`}
                                    style={{ opacity: isActive ? 1 : 0.3 }}
                                    disabled={!isActive}
                                    onClick={() => toggleStarter(p.id)}>
                                    {isStarter ? "START" : "BENCH"}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="note" style={{ marginTop: 12 }}>
                    <span>{active.size}</span> players active · <span>{starters.size}/5</span> starters selected
                </div>
                <button className="btn-primary" style={{ width: "100%", marginTop: 10 }} disabled={!canStart} onClick={handleStart}>
                    TIP OFF →
                </button>
            </div>
        </div>
    );
}
