import GlobalStyles from "../GlobalStyles.jsx";

const categories = [
    {
        title: "Basketballs",
        items: [
            { name: "Wilson Evolution Official", desc: "Official game ball for indoor courts", url: "https://www.amazon.com/dp/B000NC6EXE?tag=subtracker-20" },
            { name: "Spalding TF-1000 Legacy", desc: "Premium composite leather, great grip", url: "https://www.amazon.com/dp/B004VSGSKY?tag=subtracker-20" },
            { name: "Molten BG3800 Indoor/Outdoor", desc: "FIBA-approved ball, excellent feel", url: "https://www.amazon.com/dp/B08R3KQYXW?tag=subtracker-20" },
        ],
    },
    {
        title: "Coaching Essentials",
        items: [
            { name: "Coaching Clipboard", desc: "Full-court diagram with magnetic pieces", url: "https://www.amazon.com/dp/B07ZQK5X5Y?tag=subtracker-20" },
            { name: "Fox 40 Classic Whistle", desc: "The standard for coaches and referees", url: "https://www.amazon.com/dp/B000NC6EXE?tag=subtracker-20" },
            { name: "Stopwatch", desc: "Split-time stopwatch for drills and timing", url: "https://www.amazon.com/dp/B08P5DGJQX?tag=subtracker-20" },
        ],
    },
    {
        title: "Footwear",
        items: [
            { name: "Nike LeBron Witness", desc: "Performance court shoes, great cushioning", url: "https://www.amazon.com/dp/B0B3WQYQYX?tag=subtracker-20" },
            { name: "Adidas Dame Certified", desc: "Lightweight and supportive for fast play", url: "https://www.amazon.com/dp/B0B5QYQYX5?tag=subtracker-20" },
            { name: "Under Armour Curry Flow", desc: "Grip-heavy sole for quick cuts", url: "https://www.amazon.com/dp/B09TQVQYX5?tag=subtracker-20" },
        ],
    },
    {
        title: "Training Aids",
        items: [
            { name: "Agility Ladder", desc: "Speed and footwork training for players", url: "https://www.amazon.com/dp/B08R3KQZQY?tag=subtracker-20" },
            { name: "Resistance Bands Set", desc: "Build strength and explosiveness", url: "https://www.amazon.com/dp/B07ZQK5X5Z?tag=subtracker-20" },
            { name: "Shooting Sleeve", desc: "Consistent form and arm warmth", url: "https://www.amazon.com/dp/B08P5DGJQZ?tag=subtracker-20" },
        ],
    },
];

export default function ResourcesScreen({ onBack }) {
    return (
        <div className="app">
            <GlobalStyles />
            <div className="hdr">
                <button className="hbtn" onClick={onBack}>← BACK</button>
                <span className="hdr-title">RESOURCES</span>
            </div>
            <div className="scroll-area">
                <div style={{
                    padding: "10px 12px",
                    marginBottom: 16,
                    background: "rgba(245, 166, 35, 0.06)",
                    border: "1px solid rgba(245, 166, 35, 0.2)",
                    borderRadius: 6,
                    fontSize: 11,
                    color: "var(--text-dim)",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.5,
                }}>
                    <strong style={{ color: "var(--amber)" }}>Affiliate Disclosure:</strong> Some links on this page are affiliate links. If you purchase through these links, we may earn a small commission at no extra cost to you. This helps support SubTracker's development.
                </div>

                {categories.map((cat, ci) => (
                    <div key={ci} style={{ marginBottom: 24 }}>
                        <div className="sec-hd">{cat.title.toUpperCase()}</div>
                        {cat.items.map((item, ii) => (
                            <a
                                key={ii}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "block",
                                    background: "rgba(255,255,255,.03)",
                                    border: "1px solid var(--panel-border)",
                                    borderRadius: 8,
                                    padding: "12px 14px",
                                    marginBottom: 8,
                                    textDecoration: "none",
                                    color: "inherit",
                                    transition: "border-color .15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--amber)"}
                                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--panel-border)"}
                            >
                                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--amber)", marginBottom: 4 }}>
                                    {item.name} ↗
                                </div>
                                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                                    {item.desc}
                                </div>
                            </a>
                        ))}
                    </div>
                ))}

                <div style={{
                    textAlign: "center",
                    padding: "16px 0 8px",
                    fontSize: 10,
                    fontFamily: "'DM Mono', monospace",
                    color: "var(--text-dim)",
                    opacity: 0.5,
                }}>
                    More gear recommendations coming soon
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 16,
                    padding: "24px 0 8px",
                    fontSize: 11,
                    fontFamily: "'Inter', sans-serif",
                }}>
                    <a href="/privacy.html" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Privacy Policy</a>
                    <a href="/terms.html" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Terms of Service</a>
                    <a href="/cookie-policy.html" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Cookie Policy</a>
                </div>
            </div>
        </div>
    );
}
