import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getTeams, createTeam } from "./db.js";

export default function TeamSelector({ db, activeTeamId, onSelect, onTeamCreated, onClose }) {
    const [teams, setTeams] = useState([]);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        setTeams(getTeams(db));
    }, [db]);

    const handleSelect = (teamId) => {
        onSelect(teamId);
        onClose();
    };

    const handleAdd = () => {
        const trimmed = newName.trim();
        if (!trimmed) {
            setError("Team name cannot be empty");
            return;
        }
        const newId = createTeam(db, trimmed);
        if (newId) {
            setNewName("");
            setError("");
            setTeams(getTeams(db));
            onTeamCreated(newId);
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleAdd();
    };

    return createPortal(
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 340 }}>
                <div className="modal-title">SELECT TEAM</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                    {teams.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleSelect(t.id)}
                            style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                                background: t.id === activeTeamId ? "rgba(255,255,255,.08)" : "transparent",
                                border: t.id === activeTeamId ? "1px solid var(--amber)" : "1px solid var(--panel-border)",
                                borderRadius: 6, cursor: "pointer", transition: "all .15s",
                            }}
                        >
                            <span style={{
                                fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: 2,
                                color: t.id === activeTeamId ? "var(--amber)" : "var(--text-mid)",
                            }}>{t.name}</span>
                            {t.id === activeTeamId && (
                                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--amber)", opacity: 0.7 }}>✓</span>
                            )}
                        </button>
                    ))}
                </div>

                <div style={{
                    borderTop: "1px solid var(--panel-border)", paddingTop: 12,
                }}>
                    <div style={{
                        fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 2,
                        color: "var(--text-dim)", marginBottom: 8,
                    }}>ADD TEAM</div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <input
                            ref={inputRef}
                            className="inp inp-full"
                            type="text"
                            placeholder="Team name"
                            value={newName}
                            onChange={e => { setNewName(e.target.value); setError(""); }}
                            onKeyDown={handleKeyDown}
                            style={{ fontSize: 14 }}
                        />
                        <button
                            className="btn-primary"
                            onClick={handleAdd}
                            style={{ fontSize: 14, padding: "8px 16px", letterSpacing: 1.5, whiteSpace: "nowrap" }}
                        >ADD</button>
                    </div>
                    {error && (
                        <div style={{
                            fontSize: 11, color: "var(--red)", marginTop: 6,
                            fontFamily: "'Inter',sans-serif",
                        }}>{error}</div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
