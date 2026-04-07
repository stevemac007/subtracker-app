import { useState, useEffect, useRef } from "react";
import { dbAll, dbGet, dbRun } from "../db.js";
import GlobalStyles from "../GlobalStyles.jsx";

export default function RosterScreen({ db, onBack }) {
    const [teamName, setTeamName] = useState("");
    const [players, setPlayers] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNum, setNewNum] = useState("");
    const [saved, setSaved] = useState(false);

    const teamNameRef = useRef("");

    useEffect(() => {
        const t = dbGet(db, "SELECT name FROM team WHERE id=1");
        const name = t?.name ?? "My Team";
        setTeamName(name);
        teamNameRef.current = name;
        setPlayers(dbAll(db, "SELECT * FROM players ORDER BY id"));
    }, [db]);

    const saveAll = () => {
        dbRun(db, "UPDATE team SET name=? WHERE id=1", [teamNameRef.current]);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    const handleTeamNameChange = (val) => {
        setTeamName(val);
        teamNameRef.current = val;
    };

    const numericOnly = (val) => val.replace(/[^0-9]/g, "").slice(0, 3);

    const addPlayer = () => {
        if (!newName.trim()) return;
        dbRun(db, "INSERT INTO players (name,number,active) VALUES (?,?,1)", [newName.trim(), newNum.trim()]);
        setPlayers(dbAll(db, "SELECT * FROM players ORDER BY id"));
        setNewName(""); setNewNum("");
    };

    const updatePlayer = (id, field, val) => {
        const cleaned = field === "number" ? numericOnly(val) : val;
        dbRun(db, `UPDATE players SET ${field}=? WHERE id=?`, [cleaned, id]);
        setPlayers(ps => ps.map(p => p.id === id ? { ...p, [field]: cleaned } : p));
    };

    const toggleActive = (id, cur) => {
        dbRun(db, "UPDATE players SET active=? WHERE id=?", [cur ? 0 : 1, id]);
        setPlayers(ps => ps.map(p => p.id === id ? { ...p, active: cur ? 0 : 1 } : p));
    };

    const deletePlayer = (id) => {
        if (!confirm("Remove this player? Their stats in past games are kept.")) return;
        dbRun(db, "DELETE FROM players WHERE id=?", [id]);
        setPlayers(ps => ps.filter(p => p.id !== id));
    };

    const canAdd = newName.trim().length > 0;

    return (
        <div className="app">
            <GlobalStyles />
            <div className="hdr">
                <button className="hbtn" onClick={onBack}>← BACK</button>
                <span className="hdr-title">ROSTER</span>
                <button
                    onClick={saveAll}
                    style={{
                        background: saved ? "var(--green)" : "var(--amber)",
                        color: "#1a0e00", border: "none", borderRadius: 5, cursor: "pointer",
                        fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px", fontSize: 13,
                        padding: "5px 14px", transition: "all .2s", fontWeight: 700, minWidth: 60,
                    }}
                >
                    {saved ? "✓ SAVED" : "SAVE"}
                </button>
            </div>
            <div className="scroll-area">
                <div className="sec-hd">TEAM NAME</div>
                <input className="inp inp-team inp-full" value={teamName}
                    onChange={e => handleTeamNameChange(e.target.value)} placeholder="Team name…" />

                <div className="sec-hd" style={{ marginTop: 4 }}>
                    PLAYERS
                    <span className="sec-hd-sub">{players.filter(p => p.active).length} active</span>
                </div>

                {players.map(p => (
                    <div key={p.id} className="player-setup-row">
                        <input className="inp inp-num" value={p.number} maxLength={3} placeholder="#"
                            inputMode="numeric" onChange={e => updatePlayer(p.id, "number", e.target.value)} />
                        <input className="inp inp-full" value={p.name} placeholder="Name"
                            style={{ opacity: p.active ? 1 : 0.45 }}
                            onChange={e => updatePlayer(p.id, "name", e.target.value)} />
                        <button className={`tog ${p.active ? "on" : ""}`} onClick={() => toggleActive(p.id, p.active)}>
                            {p.active ? "ACTIVE" : "OFF"}
                        </button>
                        <button className="btn-danger btn-sm" onClick={() => deletePlayer(p.id)}>✕</button>
                    </div>
                ))}

                <div style={{ marginTop: 16, borderTop: "1px solid var(--panel-border)", paddingTop: 16 }}>
                    <div className="sec-hd">ADD PLAYER</div>
                    <div className="field-row">
                        <input className="inp inp-num" value={newNum} maxLength={3} placeholder="#"
                            inputMode="numeric" onChange={e => setNewNum(numericOnly(e.target.value))} />
                        <input className="inp inp-full" value={newName} placeholder="Player name…"
                            onChange={e => setNewName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addPlayer()} />
                        <button onClick={addPlayer} disabled={!canAdd}
                            style={{
                                background: canAdd ? "var(--amber)" : "rgba(255,255,255,.05)",
                                color: canAdd ? "#1a0e00" : "var(--text-dim)",
                                border: "1px solid " + (canAdd ? "var(--amber)" : "var(--panel-border)"),
                                borderRadius: 5, cursor: canAdd ? "pointer" : "default",
                                fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px", fontSize: 13,
                                padding: "7px 14px", transition: "all .15s", fontWeight: 700,
                            }}
                        >ADD</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
