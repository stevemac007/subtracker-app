export const fmt = s => { const t = Math.floor(s); return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; };
export const fmtMs = ms => fmt(ms / 1000);
export const today = () => new Date().toISOString().slice(0, 10);
export const dateLabel = d => { try { return new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }); } catch { return d; } };
