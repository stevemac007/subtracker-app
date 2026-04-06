import { useState, useEffect, useRef, useCallback, useReducer } from "react";

// ─── sql.js loader ────────────────────────────────────────────────────────────
// Loaded via CDN script tag injected once
const SQL_JS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";
const SQL_WASM = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm";
const LS_KEY = "bball_subtracker_db";

let _sqlPromise = null;
function loadSqlJs() {
  if (_sqlPromise) return _sqlPromise;
  _sqlPromise = new Promise((resolve, reject) => {
    if (window.initSqlJs) { initDb().then(resolve).catch(reject); return; }
    const s = document.createElement("script");
    s.src = SQL_JS_CDN;
    s.onload = () => initDb().then(resolve).catch(reject);
    s.onerror = () => reject(new Error("Failed to load sql.js"));
    document.head.appendChild(s);
  });
  return _sqlPromise;
}

async function initDb() {
  const SQL = await window.initSqlJs({ locateFile: () => SQL_WASM });
  const saved = localStorage.getItem(LS_KEY);
  let db;
  if (saved) {
    const bin = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
    db = new SQL.Database(bin);
  } else {
    db = new SQL.Database();
  }
  applySchema(db);
  return db;
}

function applySchema(db) {
  db.run(`PRAGMA journal_mode=WAL;`);
  db.run(`
    CREATE TABLE IF NOT EXISTS team (
      id      INTEGER PRIMARY KEY,
      name    TEXT NOT NULL DEFAULT 'My Team'
    );
    INSERT OR IGNORE INTO team (id, name) VALUES (1, 'My Team');

    CREATE TABLE IF NOT EXISTS players (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      name    TEXT NOT NULL,
      number  TEXT NOT NULL DEFAULT '',
      active  INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS games (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      opponent    TEXT NOT NULL DEFAULT 'Opponent',
      date        TEXT NOT NULL,
      notes       TEXT DEFAULT '',
      finished    INTEGER NOT NULL DEFAULT 0,
      total_secs  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS game_players (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id     INTEGER NOT NULL REFERENCES games(id),
      player_id   INTEGER NOT NULL REFERENCES players(id),
      court_ms    INTEGER NOT NULL DEFAULT 0,
      is_starter  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS substitutions (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id       INTEGER NOT NULL REFERENCES games(id),
      game_time_sec INTEGER NOT NULL,
      quarter       INTEGER NOT NULL DEFAULT 1,
      player_out_id INTEGER NOT NULL REFERENCES players(id),
      player_in_id  INTEGER NOT NULL REFERENCES players(id),
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function saveDb(db) {
  const data = db.export();
  const b64 = btoa(String.fromCharCode(...data));
  localStorage.setItem(LS_KEY, b64);
}

// ─── DB helpers ───────────────────────────────────────────────────────────────
function dbAll(db, sql, params = []) {
  const res = db.exec(sql, params);
  if (!res.length) return [];
  const { columns, values } = res[0];
  return values.map(row => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
}
function dbGet(db, sql, params = []) { return dbAll(db, sql, params)[0] ?? null; }
function dbRun(db, sql, params = []) { db.run(sql, params); saveDb(db); }

// ─── Styles ───────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --court: #131009; --panel: #1c1508; --panel-border: #332310;
      --amber: #f5a623; --amber-dim: #a06b10;
      --green: #22c55e; --green-bg: rgba(34,197,94,.10); --green-bd: rgba(34,197,94,.40);
      --red: #ef4444;   --red-bg: rgba(239,68,68,.10);   --red-bd: rgba(239,68,68,.40);
      --blue: #60a5fa;  --text: #ede0cc; --text-dim: #7a6548; --text-mid: #a8906c;
    }
    html,body { height:100%; overflow:hidden; }
    body {
      background: var(--court); color: var(--text); font-family:'Inter',sans-serif;
      background-image: repeating-linear-gradient(90deg,transparent 0,transparent 44px,rgba(255,255,255,.012) 44px,rgba(255,255,255,.012) 46px);
    }
    #root { height:100vh; display:flex; flex-direction:column; }
    .app { display:flex; flex-direction:column; height:100vh; max-width:520px; margin:0 auto; width:100%; overflow:hidden; }

    /* Header */
    .hdr { flex-shrink:0; background:linear-gradient(180deg,#0a0704,var(--panel)); border-bottom:2px solid var(--amber-dim); padding:8px 14px; display:flex; align-items:center; justify-content:space-between; gap:8px; }
    .hdr-title { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:3px; color:var(--amber); text-shadow:0 0 16px rgba(245,166,35,.5); white-space:nowrap; }
    .hdr-team  { font-family:'Bebas Neue',sans-serif; font-size:13px; letter-spacing:2px; color:var(--text-mid); flex:1; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .hdr-acts  { display:flex; gap:5px; }
    .hbtn { background:transparent; border:1px solid var(--panel-border); color:var(--text-dim); border-radius:5px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; font-size:11px; padding:5px 9px; transition:all .15s; white-space:nowrap; }
    .hbtn:hover { border-color:var(--text-mid); color:var(--text); }
    .hbtn.active { background:var(--amber); color:#1a0e00; border-color:var(--amber); }

    /* Clock bar */
    .clock-bar { flex-shrink:0; background:var(--panel); border-bottom:1px solid var(--panel-border); padding:6px 14px; display:flex; align-items:center; gap:10px; }
    .clock-disp { font-family:'DM Mono',monospace; font-size:36px; font-weight:500; line-height:1; color:var(--amber); letter-spacing:3px; text-shadow:0 0 20px rgba(245,166,35,.5); min-width:100px; transition:color .2s; }
    .clock-disp.paused { color:var(--text-dim); text-shadow:none; }
    .clock-mid { display:flex; flex-direction:column; gap:4px; flex:1; }
    .qbtns { display:flex; gap:4px; }
    .qbtn { background:transparent; color:var(--text-dim); border:1px solid var(--panel-border); padding:4px 10px; font-size:14px; border-radius:3px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; transition:all .12s; }
    .qbtn.active { background:var(--amber); color:#1a0e00; border-color:var(--amber); }
    .qbtn:hover:not(.active) { border-color:var(--text-mid); color:var(--text); }
    .cbtns { display:flex; gap:5px; }
    .cbtn { border:none; cursor:pointer; border-radius:5px; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; font-size:16px; padding:6px 14px; transition:all .12s; }
    .cbtn:active { transform:scale(.95); }
    .cbtn-play { background:var(--amber); color:#1a0e00; }
    .cbtn-play:hover { background:#ffc04a; }
    .cbtn-zero { background:transparent; color:var(--text-dim); border:1px solid var(--panel-border); }
    .cbtn-zero:hover { border-color:var(--text-mid); color:var(--text); }
    .period-pill { font-family:'Bebas Neue',sans-serif; font-size:12px; letter-spacing:1.5px; color:var(--text-dim); align-self:flex-end; }

    /* Court columns */
    .court-area { flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr; overflow:hidden; }
    .zone { display:flex; flex-direction:column; overflow:hidden; padding:5px 5px 3px; }
    .zone:first-child { border-right:1px solid var(--panel-border); }
    .zone-hdr { display:flex; align-items:center; justify-content:space-between; padding:2px 4px 5px; flex-shrink:0; }
    .zone-title { font-family:'Bebas Neue',sans-serif; font-size:15px; letter-spacing:2.5px; display:flex; align-items:center; gap:5px; }
    .dot { width:7px; height:7px; border-radius:50%; display:inline-block; }
    .dot-g { background:var(--green); box-shadow:0 0 5px var(--green); }
    .dot-b { background:var(--blue);  box-shadow:0 0 5px var(--blue);  }
    .zone-cnt { font-family:'DM Mono',monospace; font-size:12px; color:var(--text-dim); background:rgba(255,255,255,.04); padding:2px 7px; border-radius:3px; }
    .pgrid { flex:1; min-height:0; display:flex; flex-direction:column; gap:4px; }
    .pcard { flex:1; min-height:0; display:flex; align-items:center; background:rgba(255,255,255,.025); border:1px solid var(--panel-border); border-radius:6px; padding:0 8px; gap:7px; cursor:pointer; transition:border-color .12s,background .12s,box-shadow .12s; position:relative; overflow:hidden; -webkit-tap-highlight-color:transparent; user-select:none; }
    .pcard::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; border-radius:6px 0 0 6px; }
    .pcard.on-c::before { background:var(--green); }
    .pcard.bnch::before { background:var(--blue);  }
    .pcard.sel-out { border-color:var(--red);   background:var(--red-bg);   box-shadow:0 0 8px rgba(239,68,68,.2);  }
    .pcard.sel-in  { border-color:var(--green); background:var(--green-bg); box-shadow:0 0 8px rgba(34,197,94,.2); }
    .pcard.on-c:not(.sel-out):hover { border-color:var(--red-bd);   }
    .pcard.bnch:not(.sel-in):hover  { border-color:var(--green-bd); }
    .pnum { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--amber); min-width:30px; text-align:center; line-height:1; }
    .pcard.bnch .pnum    { color:var(--text-mid); }
    .pcard.sel-out .pnum { color:var(--red);   }
    .pcard.sel-in  .pnum { color:var(--green); }
    .pinfo { flex:1; min-width:0; }
    .pname { font-weight:600; line-height:1.2; white-space:nowrap; overflow:hidden; }
    .pname-fit { display:inline-block; transform-origin:left center; white-space:nowrap; }
    .ptime { font-family:'DM Mono',monospace; font-size:11px; color:var(--text-dim); line-height:1; margin-top:2px; }
    .pbadge { font-family:'Bebas Neue',sans-serif; font-size:11px; letter-spacing:1px; padding:2px 6px; border-radius:3px; white-space:nowrap; flex-shrink:0; }
    .b-on    { color:var(--green); background:rgba(34,197,94,.1);  }
    .b-bnch  { color:var(--blue);  background:rgba(96,165,250,.1); }
    .b-out   { color:var(--red);   background:var(--red-bg);       }
    .b-in    { color:var(--green); background:var(--green-bg);     }

    /* Sub panel */
    .sub-panel { flex-shrink:0; background:var(--panel); border-top:1px solid var(--amber-dim); padding:7px 10px 8px; }
    .sub-title { font-family:'Bebas Neue',sans-serif; font-size:13px; letter-spacing:2px; color:var(--amber); text-align:center; margin-bottom:5px; }
    .sub-pairs { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:6px; }
    .spair { display:flex; align-items:center; gap:4px; background:rgba(255,255,255,.04); border-radius:4px; padding:4px 8px; font-size:13px; }
    .sp-out { color:var(--red);   font-weight:600; }
    .sp-arr { color:var(--text-dim); }
    .sp-in  { color:var(--green); font-weight:600; }
    .sp-um  { color:var(--text-dim); font-style:italic; font-size:10px; }
    .sub-acts { display:flex; gap:6px; }
    .sbtn { flex:1; border:none; cursor:pointer; border-radius:5px; font-family:'Bebas Neue',sans-serif; letter-spacing:1.5px; font-size:17px; padding:8px; transition:all .12s; }
    .sbtn:active { transform:scale(.97); }
    .sbtn-ok  { background:var(--green); color:#001a09; }
    .sbtn-ok:hover { background:#4ade80; }
    .sbtn-ok:disabled { opacity:.35; cursor:not-allowed; transform:none; }
    .sbtn-cl  { background:transparent; color:var(--text-dim); border:1px solid var(--panel-border); }
    .sbtn-cl:hover { border-color:var(--text-mid); color:var(--text); }

    /* Scrollable panels */
    .scroll-area { flex:1; overflow-y:auto; padding:14px; }
    .scroll-area::-webkit-scrollbar { width:4px; }
    .scroll-area::-webkit-scrollbar-thumb { background:var(--panel-border); border-radius:2px; }

    /* Section heading */
    .sec-hd { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:3px; color:var(--amber); margin-bottom:12px; display:flex; align-items:center; gap:10px; }
    .sec-hd-sub { font-size:11px; letter-spacing:1px; color:var(--text-dim); font-family:'Inter',sans-serif; font-weight:400; }

    /* Forms */
    .field-row { display:flex; gap:8px; align-items:center; margin-bottom:8px; }
    .inp { background:rgba(255,255,255,.04); border:1px solid var(--panel-border); color:var(--text); border-radius:5px; padding:8px 10px; font-size:13px; outline:none; font-family:'Inter',sans-serif; }
    .inp:focus { border-color:var(--amber-dim); }
    .inp-num { width:52px; text-align:center; color:var(--amber); font-family:'Bebas Neue',sans-serif; font-size:16px; padding:7px 4px; }
    .inp-num:focus { border-color:var(--amber); }
    .inp-full { flex:1; }
    .inp-team { font-size:16px; font-weight:600; width:100%; margin-bottom:16px; }

    /* Buttons */
    .btn-primary { background:var(--amber); color:#1a0e00; border:none; border-radius:6px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:2px; font-size:18px; padding:11px; transition:all .15s; }
    .btn-primary:hover { background:#ffc04a; }
    .btn-primary:disabled { opacity:.35; cursor:not-allowed; }
    .btn-ghost { background:transparent; border:1px solid var(--panel-border); color:var(--text-dim); border-radius:5px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; font-size:13px; padding:7px 14px; transition:all .15s; }
    .btn-ghost:hover { border-color:var(--text-mid); color:var(--text); }
    .btn-danger { background:transparent; border:1px solid var(--red-bd); color:var(--red); border-radius:5px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; font-size:11px; padding:5px 10px; transition:all .15s; }
    .btn-danger:hover { background:var(--red-bg); }
    .btn-sm { font-size:12px; padding:5px 10px; }

    /* Game card */
    .game-card { background:rgba(255,255,255,.03); border:1px solid var(--panel-border); border-radius:8px; padding:12px 14px; margin-bottom:8px; cursor:pointer; transition:border-color .15s; }
    .game-card:hover { border-color:var(--text-mid); }
    .game-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
    .game-opp { font-size:14px; font-weight:600; }
    .game-date { font-family:'DM Mono',monospace; font-size:10px; color:var(--text-dim); }
    .game-meta { font-size:11px; color:var(--text-dim); display:flex; gap:12px; }
    .game-badge { font-family:'Bebas Neue',sans-serif; font-size:10px; letter-spacing:1px; padding:2px 7px; border-radius:3px; }
    .gbadge-live { background:rgba(239,68,68,.15); color:var(--red); }
    .gbadge-done { background:rgba(255,255,255,.05); color:var(--text-dim); }

    /* Player row in setup */
    .player-setup-row { display:flex; gap:6px; align-items:center; margin-bottom:6px; }
    .tog { padding:5px 9px; border-radius:4px; font-size:11px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; border:1px solid var(--panel-border); transition:all .12s; color:var(--text-dim); background:transparent; white-space:nowrap; }
    .tog.on  { background:var(--green-bg); color:var(--green); border-color:var(--green-bd); }
    .tog.start-on { background:rgba(245,166,35,.12); color:var(--amber); border-color:rgba(245,166,35,.4); }

    /* Overlay */
    .overlay { position:fixed; inset:0; background:rgba(0,0,0,.88); z-index:200; display:flex; align-items:center; justify-content:center; padding:16px; }
    .modal { background:var(--panel); border:1px solid var(--amber-dim); border-radius:10px; width:100%; max-width:420px; max-height:90vh; overflow-y:auto; padding:18px; }
    .modal-title { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:3px; color:var(--amber); margin-bottom:14px; text-align:center; }

    /* Stats rows */
    .srow { display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:1px solid var(--panel-border); font-size:13px; }
    .srow:last-child { border-bottom:none; }
    .srow-num { color:var(--amber); font-family:'Bebas Neue',sans-serif; margin-right:6px; }
    .srow-time { font-family:'DM Mono',monospace; color:var(--amber); font-size:12px; }
    .srow-pct  { font-size:10px; color:var(--text-dim); }

    /* Log entry */
    .log-entry { display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid var(--panel-border); font-size:12px; color:var(--text-dim); }
    .log-entry:last-child { border-bottom:none; }
    .log-t { font-family:'DM Mono',monospace; font-size:10px; color:var(--amber-dim); min-width:58px; }

    /* Empty state */
    .empty { padding:24px; text-align:center; font-size:13px; color:var(--text-dim); font-style:italic; }

    /* Note label */
    .note { font-size:11px; color:var(--text-dim); text-align:center; margin:8px 0; }
    .note span { font-family:'DM Mono',monospace; color:var(--amber); }
  `}</style>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = s => { const t = Math.floor(s); return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; };
const fmtMs = ms => fmt(ms / 1000);
const today = () => new Date().toISOString().slice(0, 10);
const dateLabel = d => { try { return new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }); } catch { return d; } };

// ─── FitName — scales player name to fill available width ─────────────────────
const BASE_FONT = 14;
const MAX_FONT = 32;

function FitName({ children }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Reset to base size to measure natural width
    inner.style.fontSize = `${BASE_FONT}px`;
    inner.style.transform = 'none';

    const containerW = outer.clientWidth;
    const textW = inner.scrollWidth;

    if (textW === 0 || containerW === 0) return;

    const scale = Math.min(containerW / textW, MAX_FONT / BASE_FONT);
    if (scale < 1) {
      // Text is wider than container — shrink via transform (stays crisp)
      inner.style.fontSize = `${BASE_FONT}px`;
      inner.style.transform = `scaleX(${scale})`;
    } else {
      // Room to grow — bump font-size up to MAX_FONT
      inner.style.fontSize = `${Math.min(BASE_FONT * scale, MAX_FONT)}px`;
      inner.style.transform = 'none';
    }
  }, [children]);

  return (
    <div className="pname" ref={outerRef}>
      <span className="pname-fit" ref={innerRef}>{children}</span>
    </div>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────
const Loader = ({ msg }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16 }}>
    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 4, color: "var(--amber)", textShadow: "0 0 20px rgba(245,166,35,.5)" }}>SUBTRACKER</div>
    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--text-dim)", letterSpacing: 2 }}>{msg}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: Roster / Team Settings
// ─────────────────────────────────────────────────────────────────────────────
function RosterScreen({ db, onBack }) {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [saved, setSaved] = useState(false);

  // Ref so saveAll() always reads latest value without stale closure
  const teamNameRef = useRef("");

  useEffect(() => {
    const t = dbGet(db, "SELECT name FROM team WHERE id=1");
    const name = t?.name ?? "My Team";
    setTeamName(name);
    teamNameRef.current = name;
    setPlayers(dbAll(db, "SELECT * FROM players ORDER BY id"));
  }, [db]);

  const saveAll = () => {
    dbRun(db, "UPDATE team SET name=? WHERE id=1", [teamNameRef.current]);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleTeamNameChange = (val) => {
    setTeamName(val);
    teamNameRef.current = val;
  };

  // Strip non-digits from jersey number
  const numericOnly = (val) => val.replace(/[^0-9]/g, "").slice(0, 3);

  const addPlayer = () => {
    if (!newName.trim()) return;
    dbRun(db, "INSERT INTO players (name,number,active) VALUES (?,?,1)", [newName.trim(), newNum.trim()]);
    setPlayers(dbAll(db, "SELECT * FROM players ORDER BY id"));
    setNewName(""); setNewNum("");
  };

  const updatePlayer = (id, field, val) => {
    const cleaned = field === "number" ? numericOnly(val) : val;
    dbRun(db, `UPDATE players SET ${field}=? WHERE id=?`, [cleaned, id]);
    setPlayers(ps => ps.map(p => p.id === id ? { ...p, [field]: cleaned } : p));
  };

  const toggleActive = (id, cur) => {
    dbRun(db, "UPDATE players SET active=? WHERE id=?", [cur ? 0 : 1, id]);
    setPlayers(ps => ps.map(p => p.id === id ? { ...p, active: cur ? 0 : 1 } : p));
  };

  const deletePlayer = (id) => {
    if (!confirm("Remove this player? Their stats in past games are kept.")) return;
    dbRun(db, "DELETE FROM players WHERE id=?", [id]);
    setPlayers(ps => ps.filter(p => p.id !== id));
  };

  const canAdd = newName.trim().length > 0;

  return (
    <div className="app">
      <GlobalStyles />
      <div className="hdr">
        <button className="hbtn" onClick={onBack}>← BACK</button>
        <span className="hdr-title">ROSTER</span>
        <button
          onClick={saveAll}
          style={{
            background: saved ? "var(--green)" : "var(--amber)",
            color: "#1a0e00",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "1px",
            fontSize: 13,
            padding: "5px 14px",
            transition: "all .2s",
            fontWeight: 700,
            minWidth: 60,
          }}
        >
          {saved ? "✓ SAVED" : "SAVE"}
        </button>
      </div>
      <div className="scroll-area">
        <div className="sec-hd">TEAM NAME</div>
        <input
          className="inp inp-team inp-full"
          value={teamName}
          onChange={e => handleTeamNameChange(e.target.value)}
          placeholder="Team name…"
        />

        <div className="sec-hd" style={{ marginTop: 4 }}>
          PLAYERS
          <span className="sec-hd-sub">{players.filter(p => p.active).length} active</span>
        </div>

        {players.map(p => (
          <div key={p.id} className="player-setup-row">
            <input
              className="inp inp-num"
              value={p.number}
              maxLength={3}
              placeholder="#"
              inputMode="numeric"
              onChange={e => updatePlayer(p.id, "number", e.target.value)}
            />
            <input
              className="inp inp-full"
              value={p.name}
              placeholder="Name"
              style={{ opacity: p.active ? 1 : 0.45 }}
              onChange={e => updatePlayer(p.id, "name", e.target.value)}
            />
            <button className={`tog ${p.active ? "on" : ""}`} onClick={() => toggleActive(p.id, p.active)}>
              {p.active ? "ACTIVE" : "OFF"}
            </button>
            <button className="btn-danger btn-sm" onClick={() => deletePlayer(p.id)}>✕</button>
          </div>
        ))}

        <div style={{ marginTop: 16, borderTop: "1px solid var(--panel-border)", paddingTop: 16 }}>
          <div className="sec-hd">ADD PLAYER</div>
          <div className="field-row">
            <input
              className="inp inp-num"
              value={newNum}
              maxLength={3}
              placeholder="#"
              inputMode="numeric"
              onChange={e => setNewNum(numericOnly(e.target.value))}
            />
            <input
              className="inp inp-full"
              value={newName}
              placeholder="Player name…"
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addPlayer()}
            />
            <button
              onClick={addPlayer}
              disabled={!canAdd}
              style={{
                background: canAdd ? "var(--amber)" : "rgba(255,255,255,.05)",
                color: canAdd ? "#1a0e00" : "var(--text-dim)",
                border: "1px solid " + (canAdd ? "var(--amber)" : "var(--panel-border)"),
                borderRadius: 5,
                cursor: canAdd ? "pointer" : "default",
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "1px",
                fontSize: 13,
                padding: "7px 14px",
                transition: "all .15s",
                fontWeight: 700,
              }}
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: Game History
// ─────────────────────────────────────────────────────────────────────────────
function HistoryScreen({ db, onBack, onResume }) {
  const [games, setGames] = useState([]);
  const [selected, setSelected] = useState(null);
  const [gamePlayers, setGamePlayers] = useState([]);
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    setGames(dbAll(db, "SELECT * FROM games ORDER BY id DESC"));
  }, [db]);

  const selectGame = (g) => {
    setSelected(g);
    const gp = dbAll(db, `
      SELECT gp.*, p.name, p.number
      FROM game_players gp JOIN players p ON p.id=gp.player_id
      WHERE gp.game_id=? ORDER BY gp.court_ms DESC
    `, [g.id]);
    setGamePlayers(gp);
    const sl = dbAll(db, `
      SELECT s.*, po.name as out_name, pi.name as in_name
      FROM substitutions s
      JOIN players po ON po.id=s.player_out_id
      JOIN players pi ON pi.id=s.player_in_id
      WHERE s.game_id=? ORDER BY s.id
    `, [g.id]);
    setSubs(sl);
  };

  const deleteGame = (id) => {
    if (!confirm("Delete this game and all its data?")) return;
    dbRun(db, "DELETE FROM substitutions WHERE game_id=?", [id]);
    dbRun(db, "DELETE FROM game_players WHERE game_id=?", [id]);
    dbRun(db, "DELETE FROM games WHERE id=?", [id]);
    setGames(gs => gs.filter(g => g.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  if (selected) return (
    <div className="app">
      <GlobalStyles />
      <div className="hdr">
        <button className="hbtn" onClick={() => setSelected(null)}>← BACK</button>
        <span className="hdr-title" style={{ fontSize: 15 }}>{selected.opponent}</span>
        <div className="hdr-acts">
          {!selected.finished && <button className="hbtn active" onClick={() => onResume(selected.id)}>RESUME</button>}
          <button className="btn-danger btn-sm" onClick={() => deleteGame(selected.id)}>DELETE</button>
        </div>
      </div>
      <div className="scroll-area">
        <div className="sec-hd">
          {dateLabel(selected.date)}
          <span className="sec-hd-sub">{fmt(selected.total_secs)} game time</span>
        </div>
        <div style={{ marginBottom: 16 }}>
          {gamePlayers.map(gp => {
            const pct = selected.total_secs > 0 ? Math.round(gp.court_ms / 1000 / selected.total_secs * 100) : 0;
            return (
              <div key={gp.id} className="srow">
                <div><span className="srow-num">#{gp.number}</span><span style={{ fontWeight: 600 }}>{gp.name}</span>
                  {gp.is_starter === 1 && <span style={{ fontSize: 9, color: "var(--amber)", marginLeft: 6 }}>STARTER</span>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="srow-time">{fmtMs(gp.court_ms)}</div>
                  <div className="srow-pct">{pct}% of game</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="sec-hd">SUBSTITUTIONS <span className="sec-hd-sub">{subs.length} total</span></div>
        {subs.length === 0 && <div className="empty">No substitutions recorded</div>}
        {subs.map(s => (
          <div key={s.id} className="log-entry">
            <span className="log-t">{s.quarter === 5 ? "OT" : `Q${s.quarter}`} {fmt(s.game_time_sec)}</span>
            <span style={{ color: "var(--red)", fontWeight: 600 }}>{s.out_name}</span>
            <span style={{ color: "var(--text-dim)" }}>→</span>
            <span style={{ color: "var(--green)", fontWeight: 600 }}>{s.in_name}</span>
          </div>
        ))}
        {selected.notes ? <div style={{ marginTop: 16, padding: 10, background: "rgba(255,255,255,.03)", borderRadius: 6, fontSize: 12, color: "var(--text-dim)" }}>{selected.notes}</div> : null}
      </div>
    </div>
  );

  return (
    <div className="app">
      <GlobalStyles />
      <div className="hdr">
        <button className="hbtn" onClick={onBack}>← BACK</button>
        <span className="hdr-title">HISTORY</span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--text-dim)" }}>{games.length} games</span>
      </div>
      <div className="scroll-area">
        {games.length === 0 && <div className="empty">No games yet — start a new one!</div>}
        {games.map(g => (
          <div key={g.id} className="game-card" onClick={() => selectGame(g)}>
            <div className="game-card-top">
              <span className="game-opp">vs {g.opponent}</span>
              <span className={`game-badge ${g.finished ? "gbadge-done" : "gbadge-live"}`}>{g.finished ? "DONE" : "IN PROGRESS"}</span>
            </div>
            <div className="game-meta">
              <span className="game-date">{dateLabel(g.date)}</span>
              <span>{fmt(g.total_secs)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: New Game Setup (pick active players + starters)
// ─────────────────────────────────────────────────────────────────────────────
function NewGameScreen({ db, onStart, onBack }) {
  const teamName = dbGet(db, "SELECT name FROM team WHERE id=1")?.name ?? "My Team";
  const allPlayers = dbAll(db, "SELECT * FROM players WHERE active=1 ORDER BY id");

  const [opponent, setOpponent] = useState("Opponent");
  // active = playing this game (up to 12)
  const [active, setActive] = useState(new Set(allPlayers.slice(0, 12).map(p => p.id)));
  // starters = on court to start (exactly 5)
  const [starters, setStarters] = useState(new Set(allPlayers.slice(0, 5).map(p => p.id)));

  const toggleActive = (id) => {
    setActive(prev => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
        setStarters(s => { const ns = new Set(s); ns.delete(id); return ns; });
      } else {
        if (n.size >= 12) return prev;
        n.add(id);
      }
      return n;
    });
  };

  const toggleStarter = (id) => {
    if (!active.has(id)) return;
    setStarters(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); return n; }
      if (n.size >= 5) return prev;
      n.add(id);
      return n;
    });
  };

  const canStart = active.size >= 5 && starters.size === 5;

  const handleStart = () => {
    if (!canStart) return;
    const gameId = (() => {
      db.run("INSERT INTO games (opponent,date,finished,total_secs) VALUES (?,?,0,0)", [opponent.trim() || "Opponent", today()]);
      return dbGet(db, "SELECT last_insert_rowid() as id").id;
    })();
    saveDb(db);
    const activePlayers = allPlayers.filter(p => active.has(p.id));
    activePlayers.forEach(p => {
      db.run("INSERT INTO game_players (game_id,player_id,court_ms,is_starter) VALUES (?,?,0,?)",
        [gameId, p.id, starters.has(p.id) ? 1 : 0]);
    });
    saveDb(db);
    onStart({ gameId, players: activePlayers.map(p => ({ ...p, onCourt: starters.has(p.id) })) });
  };

  return (
    <div className="app">
      <GlobalStyles />
      <div className="hdr">
        <button className="hbtn" onClick={onBack}>← BACK</button>
        <span className="hdr-title">NEW GAME</span>
        <span className="hdr-team">{teamName}</span>
      </div>
      <div className="scroll-area">
        <div className="sec-hd">OPPONENT</div>
        <div className="field-row" style={{ marginBottom: 16 }}>
          <input className="inp inp-full" value={opponent} placeholder="Opponent name…"
            onChange={e => setOpponent(e.target.value)} />
        </div>

        <div className="sec-hd">
          SQUAD SELECTION
          <span className="sec-hd-sub">{active.size}/12 active · {starters.size}/5 starters</span>
        </div>

        {allPlayers.length === 0 && (
          <div className="empty">No active players — go to Roster to add players first.</div>
        )}

        {allPlayers.map(p => {
          const isActive = active.has(p.id);
          const isStarter = starters.has(p.id);
          return (
            <div key={p.id} className="player-setup-row">
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: "var(--amber)", minWidth: 36, textAlign: "center" }}>{p.number || "–"}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, opacity: isActive ? 1 : 0.4 }}>{p.name}</span>
              <button className={`tog ${isActive ? "on" : ""}`} onClick={() => toggleActive(p.id)}>
                {isActive ? "IN" : "OUT"}
              </button>
              <button className={`tog ${isStarter ? "start-on" : ""}`}
                style={{ opacity: isActive ? 1 : 0.3 }}
                disabled={!isActive}
                onClick={() => toggleStarter(p.id)}>
                {isStarter ? "START" : "BENCH"}
              </button>
            </div>
          );
        })}

        <div className="note" style={{ marginTop: 12 }}>
          <span>{active.size}</span> players active · <span>{starters.size}/5</span> starters selected
        </div>
        <button className="btn-primary" style={{ width: "100%", marginTop: 10 }} disabled={!canStart} onClick={handleStart}>
          TIP OFF →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: Home
// ─────────────────────────────────────────────────────────────────────────────
function HomeScreen({ db, onNewGame, onHistory, onRoster, onResume }) {
  const teamName = dbGet(db, "SELECT name FROM team WHERE id=1")?.name ?? "My Team";
  const inProgress = dbAll(db, "SELECT * FROM games WHERE finished=0 ORDER BY id DESC");
  const recentDone = dbAll(db, "SELECT * FROM games WHERE finished=1 ORDER BY id DESC LIMIT 5");

  return (
    <div className="app">
      <GlobalStyles />
      <div className="hdr">
        <span className="hdr-title">SUBTRACKER</span>
        <span className="hdr-team">{teamName}</span>
        <div className="hdr-acts">
          <button className="hbtn" onClick={onRoster}>ROSTER</button>
          <button className="hbtn" onClick={onHistory}>HISTORY</button>
        </div>
      </div>
      <div className="scroll-area">
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
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: Active Game
// ─────────────────────────────────────────────────────────────────────────────
function GameScreen({ db, gameId, initialPlayers, onEnd }) {
  const gameRow = dbGet(db, "SELECT * FROM games WHERE id=?", [gameId]);

  const [quarter, setQuarter] = useState(1);
  const [players, setPlayers] = useState(initialPlayers);
  const [selOut, setSelOut] = useState(new Set());
  const [selIn, setSelIn] = useState(new Set());
  const [showStats, setShowStats] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [subLog, setSubLog] = useState([]);   // in-memory for display

  // ── Wall-clock timing ──
  const runningRef = useRef(false);
  const gameAccMs = useRef((gameRow?.total_secs ?? 0) * 1000);
  const clockStartWall = useRef(null);
  const stintStart = useRef({});
  const bankedMs = useRef({});

  // Load existing court times for resumed games
  useEffect(() => {
    const gps = dbAll(db, "SELECT player_id, court_ms FROM game_players WHERE game_id=?", [gameId]);
    gps.forEach(gp => { bankedMs.current[gp.player_id] = gp.court_ms; });
    // Load sub log
    const sl = dbAll(db, `SELECT s.*,po.name as out_name,pi.name as in_name
      FROM substitutions s
      JOIN players po ON po.id=s.player_out_id
      JOIN players pi ON pi.id=s.player_in_id
      WHERE s.game_id=? ORDER BY s.id DESC`, [gameId]);
    setSubLog(sl.map(s => ({ time: fmt(s.game_time_sec), quarter: s.quarter, out: s.out_name, in: s.in_name, ts: s.id })));
  }, []);

  const [, tick] = useReducer(x => x + 1, 0);
  const rafRef = useRef(null);
  useEffect(() => {
    const loop = () => { tick(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const now = Date.now();
  const displayGameMs = runningRef.current
    ? gameAccMs.current + (now - clockStartWall.current)
    : gameAccMs.current;

  const liveCourtMs = (pid) => {
    const b = bankedMs.current[pid] ?? 0;
    const s = stintStart.current[pid];
    return s != null ? b + (now - s) : b;
  };

  // Persist game time + court times to DB
  const persistTimes = useCallback((wallNow) => {
    const totalSec = Math.floor(gameAccMs.current / 1000);
    db.run("UPDATE games SET total_secs=? WHERE id=?", [totalSec, gameId]);
    players.forEach(p => {
      const ms = bankedMs.current[p.id] ?? 0;
      db.run("UPDATE game_players SET court_ms=? WHERE game_id=? AND player_id=?", [ms, gameId, p.id]);
    });
    saveDb(db);
  }, [db, gameId, players]);

  const startClock = useCallback(() => {
    if (runningRef.current) return;
    const w = Date.now();
    clockStartWall.current = w;
    runningRef.current = true;
    setPlayers(ps => { ps.forEach(p => { if (p.onCourt) stintStart.current[p.id] = w; }); return ps; });
  }, []);

  const pauseClock = useCallback(() => {
    if (!runningRef.current) return;
    const w = Date.now();
    gameAccMs.current += w - clockStartWall.current;
    clockStartWall.current = null;
    runningRef.current = false;
    setPlayers(ps => {
      ps.forEach(p => {
        if (stintStart.current[p.id] != null) {
          bankedMs.current[p.id] = (bankedMs.current[p.id] ?? 0) + (w - stintStart.current[p.id]);
          stintStart.current[p.id] = null;
        }
      });
      return ps;
    });
    persistTimes(w);
  }, [persistTimes]);

  const toggleClock = () => runningRef.current ? pauseClock() : startClock();
  const zeroClock = () => { pauseClock(); gameAccMs.current = 0; };

  // Tap logic
  const tapPlayer = (pid) => {
    const p = players.find(x => x.id === pid);
    if (!p) return;
    if (p.onCourt) setSelOut(prev => { const n = new Set(prev); n.has(pid) ? n.delete(pid) : n.add(pid); return n; });
    else setSelIn(prev => { const n = new Set(prev); n.has(pid) ? n.delete(pid) : n.add(pid); return n; });
  };

  const outArr = [...selOut], inArr = [...selIn];
  const pairCount = Math.min(outArr.length, inArr.length);
  const pairs = outArr.slice(0, pairCount).map((oid, i) => ({ out: oid, in: inArr[i] }));
  const extraOut = outArr.slice(pairCount);
  const extraIn = inArr.slice(pairCount);
  const canConfirm = pairCount > 0 && extraOut.length === 0 && extraIn.length === 0;

  const confirmSwap = () => {
    if (!canConfirm) return;
    const w = Date.now();
    const gameSec = Math.floor(displayGameMs / 1000);
    const newLog = [];

    setPlayers(ps => {
      const updated = [...ps];
      pairs.forEach(({ out: oid, in: iid }) => {
        const outP = ps.find(p => p.id === oid), inP = ps.find(p => p.id === iid);
        if (!outP || !inP) return;

        // Bank outgoing stint
        if (stintStart.current[oid] != null) {
          bankedMs.current[oid] = (bankedMs.current[oid] ?? 0) + (w - stintStart.current[oid]);
          stintStart.current[oid] = null;
        }
        // Start incoming stint if running
        if (runningRef.current) stintStart.current[iid] = w;

        const oi = updated.findIndex(p => p.id === oid), ii = updated.findIndex(p => p.id === iid);
        if (oi >= 0) updated[oi] = { ...updated[oi], onCourt: false };
        if (ii >= 0) updated[ii] = { ...updated[ii], onCourt: true };

        // Persist substitution
        db.run("INSERT INTO substitutions (game_id,game_time_sec,quarter,player_out_id,player_in_id) VALUES (?,?,?,?,?)",
          [gameId, gameSec, quarter, oid, iid]);
        // Update court time snapshot in game_players
        db.run("UPDATE game_players SET court_ms=? WHERE game_id=? AND player_id=?",
          [bankedMs.current[oid] ?? 0, gameId, oid]);
        db.run("UPDATE game_players SET court_ms=? WHERE game_id=? AND player_id=?",
          [bankedMs.current[iid] ?? 0, gameId, iid]);

        newLog.push({ time: fmt(gameSec), quarter, out: outP.name, in: inP.name, ts: Date.now() + newLog.length });
      });
      // Save game total secs
      db.run("UPDATE games SET total_secs=? WHERE id=?", [Math.floor(gameAccMs.current / 1000), gameId]);
      saveDb(db);
      return updated;
    });

    setSubLog(log => [...newLog, ...log].slice(0, 50));
    setSelOut(new Set()); setSelIn(new Set());
  };

  const cancelSel = () => { setSelOut(new Set()); setSelIn(new Set()); };

  const endGame = () => {
    pauseClock();
    const totalSec = Math.floor(gameAccMs.current / 1000);
    // Final persist of all court times
    players.forEach(p => {
      db.run("UPDATE game_players SET court_ms=? WHERE game_id=? AND player_id=?",
        [bankedMs.current[p.id] ?? 0, gameId, p.id]);
    });
    db.run("UPDATE games SET finished=1,total_secs=? WHERE id=?", [totalSec, gameId]);
    saveDb(db);
    onEnd();
  };

  const onCourt = players.filter(p => p.onCourt);
  const bench = players.filter(p => !p.onCourt);
  const hasSel = selOut.size > 0 || selIn.size > 0;
  const isRunning = runningRef.current;
  const opponent = gameRow?.opponent ?? "Opponent";

  return (
    <>
      <GlobalStyles />
      <div className="app">
        <div className="hdr">
          <span className="hdr-title" style={{ fontSize: 15 }}>vs {opponent}</span>
          <div className="hdr-acts">
            <button className="hbtn" onClick={() => setShowLog(true)}>LOG</button>
            <button className="hbtn" onClick={() => setShowStats(true)}>STATS</button>
            <button className="hbtn" onClick={endGame}>END</button>
          </div>
        </div>

        <div className="clock-bar">
          <div className={`clock-disp ${isRunning ? "" : "paused"}`}>{fmt(displayGameMs / 1000)}</div>
          <div className="clock-mid">
            <div className="qbtns">
              {["Q1", "Q2", "Q3", "Q4", "OT"].map((q, i) => (
                <button key={q} className={`qbtn ${quarter === i + 1 ? "active" : ""}`}
                  onClick={() => { setQuarter(i + 1); pauseClock(); }}>{q}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="cbtns">
                <button className="cbtn cbtn-play" onClick={toggleClock}>{isRunning ? "⏸ PAUSE" : "▶ START"}</button>
                <button className="cbtn cbtn-zero" onClick={zeroClock}>ZERO</button>
              </div>
              <span className="period-pill">{["Q1", "Q2", "Q3", "Q4", "OT"][quarter - 1]} · {isRunning ? "LIVE" : "STOPPED"}</span>
            </div>
          </div>
        </div>

        <div className="court-area">
          <div className="zone">
            <div className="zone-hdr">
              <div className="zone-title" style={{ color: "var(--green)" }}><span className="dot dot-g" />ON COURT</div>
              <span className="zone-cnt">{onCourt.length}/5</span>
            </div>
            <div className="pgrid">
              {onCourt.map(p => {
                const sel = selOut.has(p.id);
                return (
                  <div key={p.id} className={`pcard on-c ${sel ? "sel-out" : ""}`} onClick={() => tapPlayer(p.id)}>
                    <div className="pnum">#{p.number}</div>
                    <div className="pinfo"><FitName>{p.name}</FitName><div className="ptime">{fmtMs(liveCourtMs(p.id))}</div></div>
                    <span className={`pbadge ${sel ? "b-out" : "b-on"}`}>{sel ? "OUT ▼" : "ON"}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="zone">
            <div className="zone-hdr">
              <div className="zone-title" style={{ color: "var(--blue)" }}><span className="dot dot-b" />BENCH</div>
              <span className="zone-cnt">{bench.length}</span>
            </div>
            <div className="pgrid">
              {bench.map(p => {
                const sel = selIn.has(p.id);
                return (
                  <div key={p.id} className={`pcard bnch ${sel ? "sel-in" : ""}`} onClick={() => tapPlayer(p.id)}>
                    <div className="pnum">#{p.number}</div>
                    <div className="pinfo"><FitName>{p.name}</FitName><div className="ptime">{fmtMs(liveCourtMs(p.id))}</div></div>
                    <span className={`pbadge ${sel ? "b-in" : "b-bnch"}`}>{sel ? "IN ▲" : "BENCH"}</span>
                  </div>
                );
              })}
              {bench.length === 0 && <div style={{ padding: "10px 6px", fontSize: 10, color: "var(--text-dim)", fontStyle: "italic" }}>Full squad on court</div>}
            </div>
          </div>
        </div>

        {hasSel && (
          <div className="sub-panel">
            <div className="sub-title">
              SUBSTITUTION — {selOut.size} OUT · {selIn.size} IN
              {(extraOut.length > 0 || extraIn.length > 0) && <span style={{ color: "var(--red)", marginLeft: 8, fontSize: 10 }}>⚠ UNEVEN</span>}
            </div>
            <div className="sub-pairs">
              {pairs.map(({ out: oid, in: iid }, i) => {
                const op = players.find(p => p.id === oid), ip = players.find(p => p.id === iid);
                return <div key={i} className="spair"><span className="sp-out">{op?.name}</span><span className="sp-arr">→</span><span className="sp-in">{ip?.name}</span></div>;
              })}
              {extraOut.map((oid, i) => { const op = players.find(p => p.id === oid); return <div key={"xo" + i} className="spair"><span className="sp-out">{op?.name}</span><span className="sp-arr">→</span><span className="sp-um">needs IN</span></div>; })}
              {extraIn.map((iid, i) => { const ip = players.find(p => p.id === iid); return <div key={"xi" + i} className="spair"><span className="sp-um">needs OUT</span><span className="sp-arr">→</span><span className="sp-in">{ip?.name}</span></div>; })}
            </div>
            <div className="sub-acts">
              <button className="sbtn sbtn-ok" disabled={!canConfirm} onClick={confirmSwap}>
                CONFIRM{pairCount > 1 ? ` ${pairCount} SUBS` : " SUB"}
              </button>
              <button className="sbtn sbtn-cl" onClick={cancelSel}>CANCEL</button>
            </div>
          </div>
        )}
      </div>

      {showStats && (
        <div className="overlay" onClick={() => setShowStats(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">PLAYER STATS</div>
            {[...players].sort((a, b) => liveCourtMs(b.id) - liveCourtMs(a.id)).map(p => {
              const ms = liveCourtMs(p.id);
              const pct = displayGameMs > 0 ? Math.round(ms / displayGameMs * 100) : 0;
              return (
                <div key={p.id} className="srow">
                  <div><span className="srow-num">#{p.number}</span><span style={{ fontWeight: 600 }}>{p.name}</span>
                    {p.onCourt && <span style={{ fontSize: 9, color: "var(--green)", marginLeft: 6 }}>● LIVE</span>}
                  </div>
                  <div style={{ textAlign: "right" }}><div className="srow-time">{fmtMs(ms)}</div><div className="srow-pct">{pct}%</div></div>
                </div>
              );
            })}
            <button className="hbtn" style={{ width: "100%", marginTop: 14, padding: "9px", fontSize: 13 }} onClick={() => setShowStats(false)}>CLOSE</button>
          </div>
        </div>
      )}

      {showLog && (
        <div className="overlay" onClick={() => setShowLog(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">SUB LOG</div>
            {subLog.length === 0 && <div className="empty">No substitutions yet</div>}
            {subLog.map(e => (
              <div key={e.ts} className="log-entry">
                <span className="log-t">{e.quarter === 5 ? "OT" : `Q${e.quarter}`} {e.time}</span>
                <span style={{ color: "var(--red)", fontWeight: 600 }}>{e.out}</span>
                <span style={{ color: "var(--text-dim)" }}>→</span>
                <span style={{ color: "var(--green)", fontWeight: 600 }}>{e.in}</span>
              </div>
            ))}
            <button className="hbtn" style={{ width: "100%", marginTop: 14, padding: "9px", fontSize: 13 }} onClick={() => setShowLog(false)}>CLOSE</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP — navigation shell
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [db, setDb] = useState(null);
  const [dbError, setDbError] = useState(null);
  const [screen, setScreen] = useState("home"); // home | roster | newgame | game | history
  const [gameCtx, setGameCtx] = useState(null);   // { gameId, players }

  useEffect(() => {
    loadSqlJs()
      .then(database => setDb(database))
      .catch(err => setDbError(err.message));
  }, []);

  const resumeGame = useCallback((gid) => {
    if (!db) return;
    const gps = dbAll(db, `SELECT gp.player_id,gp.court_ms,gp.is_starter,p.name,p.number
      FROM game_players gp JOIN players p ON p.id=gp.player_id
      WHERE gp.game_id=?`, [gid]);
    // Determine on-court from last sub state: starters minus subbed-out + subbed-in
    // Simplest heuristic: last known state — we track is_starter but subs have updated the DB
    // Instead, reconstruct on-court from substitutions
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

  if (screen === "roster") return <RosterScreen db={db} onBack={() => setScreen("home")} />;
  if (screen === "history") return <HistoryScreen db={db} onBack={() => setScreen("home")} onResume={resumeGame} />;
  if (screen === "newgame") return (
    <NewGameScreen db={db} onBack={() => setScreen("home")}
      onStart={ctx => { setGameCtx(ctx); setScreen("game"); }} />
  );
  if (screen === "game" && gameCtx) return (
    <GameScreen db={db} gameId={gameCtx.gameId} initialPlayers={gameCtx.players}
      onEnd={() => { setGameCtx(null); setScreen("home"); }} />
  );

  return (
    <HomeScreen db={db}
      onNewGame={() => setScreen("newgame")}
      onHistory={() => setScreen("history")}
      onRoster={() => setScreen("roster")}
      onResume={resumeGame}
    />
  );
}
