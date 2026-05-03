import { useState, useEffect, useMemo } from "react";
import { dbAll, dbGet } from "../db.js";
import { fmt, dateLabel } from "../utils.js";
import GlobalStyles from "../GlobalStyles.jsx";
import ThemeChooser from "../ThemeChooser.jsx";
import TeamSelector from "../TeamSelector.jsx";
import { calculateFreemiumPrice } from "../billing.js";
// useMemo already imported above; keep single import

export default function HomeScreen({ db, onNewGame, onHistory, onRoster, onResources, onResume, activeTeamId, onTeamChange }) {
    const [showTeamSelector, setShowTeamSelector] = useState(false);

    const teamName = useMemo(() => {
        if (!activeTeamId) return "My Team";
        return dbGet(db, "SELECT name FROM team WHERE id = ?", [activeTeamId])?.name ?? "My Team";
    }, [db, activeTeamId]);

    const inProgress = useMemo(() => {
        if (!activeTeamId) return [];
        return dbAll(db, "SELECT * FROM games WHERE team_id = ? AND finished = 0 ORDER BY id DESC", [activeTeamId]);
    }, [db, activeTeamId]);

    const recentDone = useMemo(() => {
        if (!activeTeamId) return [];
        return dbAll(db, "SELECT * FROM games WHERE team_id = ? AND finished = 1 ORDER BY id DESC LIMIT 5", [activeTeamId]);
    }, [db, activeTeamId]);

    // PWA install prompt
    const [installPrompt, setInstallPrompt] = useState(null);
    const [promptChecked, setPromptChecked] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    useEffect(() => {
        const check = () => { if (window.__pwaInstallPrompt) setInstallPrompt(window.__pwaInstallPrompt); };
        check();
        window.addEventListener('pwaPromptReady', check);
        const timer = setTimeout(() => setPromptChecked(true), 2000);

        // Listen for SW update
        const onUpdate = () => setUpdateAvailable(true);
        if (window.__swWaiting) onUpdate();
        window.addEventListener('swUpdateAvailable', onUpdate);

        return () => {
            window.removeEventListener('pwaPromptReady', check);
            window.removeEventListener('swUpdateAvailable', onUpdate);
            clearTimeout(timer);
        };
    }, []);
    const handleInstall = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') { window.__pwaInstallPrompt = null; setInstallPrompt(null); }
    };
    const handleUpdate = () => {
        if (window.__swWaiting) {
            window.__swWaiting.postMessage('skipWaiting');
        }
    };
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const showOpenInApp = promptChecked && !installPrompt && !isStandalone;

    // Next actions: add unit tests for freemiumPrice() and UI display; plan backend gating if needed.
    // Lightweight freemium pricing cue: first team free, AUD 0.99 per extra team
    let countedTeams = 0;
    try {
        const teams = db ? dbAll(db, "SELECT * FROM team ORDER BY id") : [];
        countedTeams = Array.isArray(teams) ? teams.length : 0;
    } catch (_) {
        countedTeams = 0;
    }
    const freemiumPrice = calculateFreemiumPrice(countedTeams);
    
    return (
        <div className="app">
            <GlobalStyles />
            <div className="hdr">
                <span className="hdr-title">SUBTRACKER</span>
                <span className="hdr-team" onClick={() => setShowTeamSelector(true)}
                    style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {teamName} <span style={{ fontSize: "0.7em", opacity: 0.6 }}>▾</span>
                </span>
                <div className="hdr-acts">
                    <ThemeChooser />
                    <button className="hbtn" onClick={onResources}>RESOURCES</button>
                    <button className="hbtn" onClick={onRoster}>ROSTER</button>
                    <button className="hbtn" onClick={onHistory}>HISTORY</button>
                </div>
            </div>
            <div style={{ padding: "0 16px" }}>
                <div className="freemium-bar" style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    margin: "8px 0 0 0",
                    background: "rgba(255, 215, 0, 0.08)",
                    border: "1px solid rgba(245, 196, 0, 0.25)",
                    borderRadius: 6
                }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: 2 }}>FREEMIUM</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--text-dim)" }}>
                        1 free team; {`AUD 0.99`} per additional team. Current price: {`AUD ${freemiumPrice.toFixed(2)}`}
                    </span>
                </div>
            </div>
            <div className="scroll-area">
                {updateAvailable && (
                    <button onClick={handleUpdate}
                        style={{
                            width: "100%", marginBottom: 14, padding: "10px 14px", fontSize: 12,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.4)",
                            borderRadius: 6, color: "var(--green)", cursor: "pointer",
                            fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1.5
                        }}>
                        🔄 UPDATE AVAILABLE — TAP TO REFRESH
                    </button>
                )}

                {installPrompt && !isStandalone && (
                    <button className="btn-ghost" onClick={handleInstall}
                        style={{ width: "100%", marginBottom: 14, padding: "10px", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        📲 INSTALL APP
                    </button>
                )}

                {showOpenInApp && (
                    <div style={{
                        width: "100%", marginBottom: 14, padding: "10px 14px", fontSize: 12,
                        display: "flex", alignItems: "center", gap: 10,
                        background: "rgba(245,166,35,.08)", border: "1px solid rgba(245,166,35,.25)",
                        borderRadius: 6, color: "var(--text-mid)"
                    }}>
                        <span style={{ fontSize: 20 }}>📱</span>
                        <span>SubTracker is installed — open it from your home screen for the best experience.</span>
                    </div>
                )}

                {inProgress.length > 0 && <>
                    <div className="sec-hd">IN PROGRESS</div>
                    {inProgress.map(g => (
                        <div key={g.id} className="game-card" onClick={() => onResume(g.id)}>
                            <div className="game-card-top">
                                <span className="game-opp">vs {g.opponent}</span>
                                <span className="game-badge gbadge-live">RESUME →</span>
                            </div>
                            <div className="game-meta"><span>{dateLabel(g.date)}</span><span>{fmt(g.total_secs)} elapsed</span></div>
                        </div>
                    ))}
                </>}

                {inProgress.length === 0 && recentDone.length === 0 && (
                    <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
                        <img src="/empty-games.svg" alt="" style={{ width: 220, maxWidth: "60vw", opacity: 0.7, marginBottom: 16 }} />
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--text-dim)", letterSpacing: 1, marginBottom: 16 }}>
                            No games yet — start your first one
                        </div>
                    </div>
                )}

                <div className="sec-hd" style={{ marginTop: inProgress.length ? 12 : 0 }}>
                    <button className="btn-primary" style={{ fontSize: 16, padding: "10px 28px", letterSpacing: 2 }} onClick={onNewGame}>
                        + NEW GAME
                    </button>
                </div>

                {recentDone.length > 0 && <>
                    <div className="sec-hd" style={{ marginTop: 16 }}>RECENT GAMES</div>
                    {recentDone.map(g => (
                        <div key={g.id} className="game-card" onClick={() => onHistory(g.id)}>
                            <div className="game-card-top">
                                <span className="game-opp">vs {g.opponent}</span>
                                <span className="game-badge gbadge-done">DONE</span>
                            </div>
                            <div className="game-meta"><span>{dateLabel(g.date)}</span><span>{fmt(g.total_secs)}</span></div>
                        </div>
                    ))}
                </>}

                <div style={{ textAlign: "center", marginTop: 20, paddingBottom: 8, fontSize: 10, fontFamily: "'DM Mono',monospace", color: "var(--text-dim)", opacity: 0.5 }}>
                    build {__BUILD_NUMBER__}
                </div>
            </div>
            {showTeamSelector && (
                <TeamSelector
                    db={db}
                    activeTeamId={activeTeamId}
                    onSelect={(id) => { onTeamChange(id); setShowTeamSelector(false); }}
                    onTeamCreated={(id) => { onTeamChange(id); setShowTeamSelector(false); }}
                    onClose={() => setShowTeamSelector(false)}
                />
            )}
        </div>
    );
}
