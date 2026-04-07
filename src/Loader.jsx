const Loader = ({ msg }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16 }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 4, color: "var(--amber)", textShadow: "0 0 20px rgba(245,166,35,.5)" }}>SUBTRACKER</div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--text-dim)", letterSpacing: 2 }}>{msg}</div>
    </div>
);

export default Loader;
