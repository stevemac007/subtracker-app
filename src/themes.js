const THEMES = {
    scoreboard: {
        label: "Scoreboard",
        vars: {
            "--court": "#131009", "--panel": "#1c1508", "--panel-border": "#332310",
            "--amber": "#f5a623", "--amber-dim": "#a06b10",
            "--green": "#22c55e", "--green-bg": "rgba(34,197,94,.10)", "--green-bd": "rgba(34,197,94,.40)",
            "--red": "#ef4444", "--red-bg": "rgba(239,68,68,.10)", "--red-bd": "rgba(239,68,68,.40)",
            "--blue": "#60a5fa", "--text": "#ede0cc", "--text-dim": "#7a6548", "--text-mid": "#a8906c",
            "--body-bg-image": "none", "--body-bg-size": "auto",
            "--hdr-bg": "linear-gradient(180deg,#0a0704,var(--panel))",
            "--hdr-bg-image": "url('/scoreboard-texture.svg'), linear-gradient(180deg,#0a0704,var(--panel))",
            "--hdr-bg-size": "20px 20px, auto",
            "--clock-bg-image": "url('/scoreboard-texture.svg')",
            "--clock-bg-size": "20px 20px",
        },
    },
    midnight: {
        label: "Midnight",
        vars: {
            "--court": "#0f1729", "--panel": "#162040", "--panel-border": "#253560",
            "--amber": "#7dd3fc", "--amber-dim": "#3b82a0",
            "--green": "#34d399", "--green-bg": "rgba(52,211,153,.10)", "--green-bd": "rgba(52,211,153,.40)",
            "--red": "#f87171", "--red-bg": "rgba(248,113,113,.10)", "--red-bd": "rgba(248,113,113,.40)",
            "--blue": "#818cf8", "--text": "#e2e8f0", "--text-dim": "#64748b", "--text-mid": "#94a3b8",
            "--body-bg-image": "none", "--body-bg-size": "auto",
            "--hdr-bg": "linear-gradient(180deg,#0a1020,var(--panel))",
            "--hdr-bg-image": "linear-gradient(180deg,#0a1020,var(--panel))",
            "--hdr-bg-size": "auto",
            "--clock-bg-image": "none", "--clock-bg-size": "auto",
        },
    },
    chalk: {
        label: "Chalk",
        vars: {
            "--court": "#f5f0e8", "--panel": "#ebe4d6", "--panel-border": "#d4c9b5",
            "--amber": "#b45309", "--amber-dim": "#92400e",
            "--green": "#16a34a", "--green-bg": "rgba(22,163,74,.08)", "--green-bd": "rgba(22,163,74,.35)",
            "--red": "#dc2626", "--red-bg": "rgba(220,38,38,.08)", "--red-bd": "rgba(220,38,38,.35)",
            "--blue": "#2563eb", "--text": "#1c1917", "--text-dim": "#78716c", "--text-mid": "#57534e",
            "--body-bg-image": "none", "--body-bg-size": "auto",
            "--hdr-bg": "linear-gradient(180deg,#ddd5c4,var(--panel))",
            "--hdr-bg-image": "linear-gradient(180deg,#ddd5c4,var(--panel))",
            "--hdr-bg-size": "auto",
            "--clock-bg-image": "none", "--clock-bg-size": "auto",
        },
    },
    highContrast: {
        label: "High Contrast",
        vars: {
            "--court": "#000000", "--panel": "#0a0a0a", "--panel-border": "#333333",
            "--amber": "#fbbf24", "--amber-dim": "#d97706",
            "--green": "#4ade80", "--green-bg": "rgba(74,222,128,.12)", "--green-bd": "rgba(74,222,128,.50)",
            "--red": "#f87171", "--red-bg": "rgba(248,113,113,.12)", "--red-bd": "rgba(248,113,113,.50)",
            "--blue": "#93c5fd", "--text": "#ffffff", "--text-dim": "#a3a3a3", "--text-mid": "#d4d4d4",
            "--body-bg-image": "none", "--body-bg-size": "auto",
            "--hdr-bg": "linear-gradient(180deg,#000,var(--panel))",
            "--hdr-bg-image": "linear-gradient(180deg,#000,var(--panel))",
            "--hdr-bg-size": "auto",
            "--clock-bg-image": "none", "--clock-bg-size": "auto",
        },
    },
};

export const THEME_KEYS = Object.keys(THEMES);
export const THEME_LIST = Object.entries(THEMES).map(([k, v]) => ({ key: k, label: v.label, vars: v.vars }));
export default THEMES;
