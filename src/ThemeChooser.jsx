import { useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "./ThemeContext.jsx";
import { THEME_LIST } from "./themes.js";

export default function ThemeChooser() {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    return (
        <>
            <button className="hbtn" onClick={() => setOpen(true)} aria-label="Change theme"
                style={{ fontSize: 14, padding: "4px 8px", lineHeight: 1 }}>🎨</button>
            {open && createPortal(
                <div className="overlay" onClick={() => setOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 320 }}>
                        <div className="modal-title">CHOOSE THEME</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {THEME_LIST.map(t => (
                                <button key={t.key} onClick={() => { setTheme(t.key); setOpen(false); }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                                        background: theme === t.key ? "rgba(255,255,255,.08)" : "transparent",
                                        border: theme === t.key ? "1px solid var(--amber)" : "1px solid var(--panel-border)",
                                        borderRadius: 6, cursor: "pointer", transition: "all .15s",
                                    }}>
                                    <div style={{ display: "flex", gap: 4 }}>
                                        {[t.vars["--court"], t.vars["--panel"], t.vars["--amber"], t.vars["--text"], t.vars["--green"]].map((c, i) => (
                                            <span key={i} style={{ width: 16, height: 16, borderRadius: 3, background: c, border: "1px solid rgba(128,128,128,.3)" }} />
                                        ))}
                                    </div>
                                    <span style={{
                                        fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: 2,
                                        color: theme === t.key ? "var(--amber)" : "var(--text-mid)",
                                    }}>{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
