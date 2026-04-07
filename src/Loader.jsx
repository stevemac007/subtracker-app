const Loader = ({ msg }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16, background: "var(--court)" }}>
        <img src="/hero.svg" alt="" style={{ width: 260, maxWidth: "70vw", opacity: 0.85 }} />
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--text-dim)", letterSpacing: 2 }}>{msg}</div>
    </div>
);

export default Loader;
