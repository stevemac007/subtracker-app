import { useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../ThemeContext.jsx";
import { THEME_LIST } from "../themes.js";
import { GAME_SETTINGS_DEFAULTS } from "../gameSettings.js";

export default function GameConfigModal({ settings, onSave, onClose, opponent, onOpponentChange }) {
    const { theme, setTheme } = useTheme();
    const [local, setLocal] = useState({ ...settings });
    const [oppName, setOppName] = useState(opponent);

    const update = (key, val) => setLocal(s => ({ ...s, [key]: val }));

    const handleSave = () => {
        onOpponentChange(oppName);
        onSave(local);
        onClose();
    };

    const handleReset = () => {
        setLocal({ ...GAME_SETTINGS_DEFAULTS });
    };

    return createPortal(
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                <div className="modal-title">GAME SETTINGS</div>

                {/* Opponent name */}
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>OPPONENT</label>
                    <input className="inp inp-full" value={oppName}
                        onChange={e => setOppName(e.target.value)} placeholder="Opponent name…" />
                </div>

                {/* Sort order */}
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>SORT PLAYERS BY</label>
                    <div style={{ display: "flex", gap: 6 }}>
                        <ToggleBtn active={local.sortMode === "game"} onClick={() => update("sortMode", "game")}>GAME TIME</ToggleBtn>
                        <ToggleBtn active={local.sortMode === "stint"} onClick={() => update("sortMode", "stint")}>STINT TIME</ToggleBtn>
                    </div>
                </div>

                {/* Display toggles */}
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>DISPLAY OPTIONS</label>
                    <SwitchRow label="Show court stint time" info="Shows how long each player has been on court in their current stint" checked={local.showCourtStint} onChange={v => update("showCourtStint", v)} />
                    <SwitchRow label="Show bench stint time" info="Shows how long each bench player has been sitting out" checked={local.showBenchStint} onChange={v => update("showBenchStint", v)} />
                    <SwitchRow label="Show game time %" info="Displays percentage of total game time each player has been on court" checked={local.showGamePct} onChange={v => update("showGamePct", v)} />
                    <SwitchRow label="Show jersey numbers" info="Show or hide jersey numbers on player cards" checked={local.showPlayerNumber} onChange={v => update("showPlayerNumber", v)} />
                    <SwitchRow label="Simplified controls" info="Replaces full clock controls with simple Start/Pause/End period buttons" checked={local.simplifiedControls} onChange={v => update("simplifiedControls", v)} />
                </div>

                {/* Warning times */}
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>STINT WARNINGS</label>
                    <NumberRow label="Court warning (min)" value={local.courtWarningMin} onChange={v => update("courtWarningMin", v)} />
                    <NumberRow label="Bench warning (min)" value={local.benchWarningMin} onChange={v => update("benchWarningMin", v)} />
                </div>

                {/* Theme */}
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>THEME</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {THEME_LIST.map(t => (
                            <button key={t.key} onClick={() => setTheme(t.key)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
                                    background: theme === t.key ? "rgba(255,255,255,.08)" : "transparent",
                                    border: theme === t.key ? "1px solid var(--amber)" : "1px solid var(--panel-border)",
                                    borderRadius: 5, cursor: "pointer", transition: "all .12s",
                                }}>
                                <span style={{ width: 12, height: 12, borderRadius: 2, background: t.vars["--amber"], border: "1px solid rgba(128,128,128,.3)" }} />
                                <span style={{
                                    fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 1,
                                    color: theme === t.key ? "var(--amber)" : "var(--text-dim)",
                                }}>{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button className="btn-ghost" style={{ flex: 1 }} onClick={handleReset}>RESET</button>
                    <button className="btn-primary" style={{ flex: 2 }} onClick={handleSave}>SAVE</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

const labelStyle = {
    fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 2,
    color: "var(--amber)", display: "block", marginBottom: 6,
};

function ToggleBtn({ active, onClick, children }) {
    return (
        <button onClick={onClick} style={{
            flex: 1, padding: "7px 10px", border: "1px solid " + (active ? "var(--amber)" : "var(--panel-border)"),
            background: active ? "rgba(255,255,255,.06)" : "transparent",
            color: active ? "var(--amber)" : "var(--text-dim)",
            borderRadius: 5, cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 12, letterSpacing: 1, transition: "all .12s",
        }}>{children}</button>
    );
}

function SwitchRow({ label, info, checked, onChange }) {
    const [showInfo, setShowInfo] = useState(false);
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--panel-border)", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, color: "var(--text)" }}>{label}</span>
                {info && (
                    <button onClick={() => setShowInfo(v => !v)} style={{
                        width: 16, height: 16, borderRadius: 8, border: "1px solid var(--panel-border)",
                        background: "transparent", color: "var(--text-dim)", cursor: "pointer",
                        fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
                        lineHeight: 1, padding: 0, flexShrink: 0,
                    }}>i</button>
                )}
            </div>
            <button onClick={() => onChange(!checked)} style={{
                width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
                background: checked ? "var(--green)" : "rgba(255,255,255,.12)",
                position: "relative", transition: "background .15s", flexShrink: 0,
            }}>
                <span style={{
                    position: "absolute", top: 2, left: checked ? 18 : 2,
                    width: 16, height: 16, borderRadius: 8,
                    background: "#fff", transition: "left .15s",
                    boxShadow: "0 1px 3px rgba(0,0,0,.3)",
                }} />
            </button>
            {showInfo && (
                <div style={{
                    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
                    background: "var(--panel)", border: "1px solid var(--amber-dim)",
                    borderRadius: 5, padding: "8px 10px", fontSize: 11, color: "var(--text-dim)",
                    boxShadow: "0 4px 12px rgba(0,0,0,.3)", marginTop: 2,
                }} onClick={() => setShowInfo(false)}>
                    {info}
                </div>
            )}
        </div>
    );
}

function NumberRow({ label, value, onChange }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--panel-border)" }}>
            <span style={{ fontSize: 12, color: "var(--text)" }}>{label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => onChange(Math.max(1, value - 1))} style={numBtnStyle}>−</button>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--amber)", minWidth: 24, textAlign: "center" }}>{value}</span>
                <button onClick={() => onChange(Math.min(30, value + 1))} style={numBtnStyle}>+</button>
            </div>
        </div>
    );
}

const numBtnStyle = {
    width: 24, height: 24, borderRadius: 4, border: "1px solid var(--panel-border)",
    background: "rgba(255,255,255,.04)", color: "var(--text)", cursor: "pointer",
    fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
};
