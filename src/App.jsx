import { useState, useEffect, useCallback } from "react";
import { loadSqlJs, dbAll, getActiveTeamId, setActiveTeamId } from "./db.js";
import GlobalStyles from "./GlobalStyles.jsx";
import Loader from "./Loader.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import RosterScreen from "./screens/RosterScreen.jsx";
import HistoryScreen from "./screens/HistoryScreen.jsx";
import NewGameScreen from "./screens/NewGameScreen.jsx";
import GameScreen from "./screens/GameScreen.jsx";


export default function App() {
  const [db, setDb] = useState(null);
  const [dbError, setDbError] = useState(null);
  const [screen, setScreen] = useState("home");
  const [gameCtx, setGameCtx] = useState(null);
  const [historyGameId, setHistoryGameId] = useState(null);
  const [activeTeamId, setActiveTeamIdState] = useState(null);

  useEffect(() => {
    loadSqlJs()
      .then(database => {
        setDb(database);
        setActiveTeamIdState(getActiveTeamId(database));
      })
      .catch(err => setDbError(err.message));
  }, []);

  const setActiveTeam = useCallback((id) => {
    setActiveTeamIdState(id);
    setActiveTeamId(id);
  }, []);

  const resumeGame = useCallback((gid) => {
    if (!db) return;
    const gps = dbAll(db, `SELECT gp.player_id,gp.court_ms,gp.is_starter,p.name,p.number
      FROM game_players gp JOIN players p ON p.id=gp.player_id
      WHERE gp.game_id=?`, [gid]);
    const subs = dbAll(db, "SELECT * FROM substitutions WHERE game_id=? ORDER BY id", [gid]);
    const onCourtIds = new Set(gps.filter(gp => gp.is_starter).map(gp => gp.player_id));
    subs.forEach(s => { onCourtIds.delete(s.player_out_id); onCourtIds.add(s.player_in_id); });
    const players = gps.map(gp => ({ id: gp.player_id, name: gp.name, number: gp.number, onCourt: onCourtIds.has(gp.player_id) }));
    setGameCtx({ gameId: gid, players });
    setScreen("game");
  }, [db]);

  if (dbError) return (
    <>
      <GlobalStyles />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 12, padding: 24 }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "var(--red)" }}>DATABASE ERROR</div>
        <div style={{ fontSize: 12, color: "var(--text-dim)", textAlign: "center" }}>{dbError}</div>
        <div style={{ fontSize: 11, color: "var(--text-dim)", textAlign: "center" }}>sql.js requires a network connection on first load to fetch the WASM binary.</div>
      </div>
    </>
  );

  if (!db) return (<><GlobalStyles /><Loader msg="LOADING DATABASE…" /></>);

  if (screen === "roster") return <RosterScreen key={activeTeamId} db={db} onBack={() => setScreen("home")} activeTeamId={activeTeamId} onTeamChange={setActiveTeam} />;
  if (screen === "history") return <HistoryScreen db={db} onBack={() => setScreen("home")} onResume={resumeGame} activeTeamId={activeTeamId} initialGameId={historyGameId} />;
  if (screen === "newgame") return (
    <NewGameScreen db={db} onBack={() => setScreen("home")}
      onStart={ctx => { setGameCtx(ctx); setScreen("game"); }} activeTeamId={activeTeamId} />
  );
  if (screen === "game" && gameCtx) return (
    <GameScreen db={db} gameId={gameCtx.gameId} initialPlayers={gameCtx.players}
      onEnd={() => { setGameCtx(null); setScreen("home"); }} />
  );

  return (
    <HomeScreen db={db}
      onNewGame={() => setScreen("newgame")}
      onHistory={(gid) => { setHistoryGameId(gid || null); setScreen("history"); }}
      onRoster={() => setScreen("roster")}
      onResume={resumeGame}
      activeTeamId={activeTeamId}
      onTeamChange={setActiveTeam}
    />
  );
}
