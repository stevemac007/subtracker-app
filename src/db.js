// ─── sql.js loader ────────────────────────────────────────────────────────────
// Loaded via CDN script tag injected once
const SQL_JS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";
const SQL_WASM = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm";
const LS_KEY = "bball_subtracker_db";

let _sqlPromise = null;
export function loadSqlJs() {
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

    CREATE TABLE IF NOT EXISTS players (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      name    TEXT NOT NULL,
      number  TEXT NOT NULL DEFAULT '',
      active  INTEGER NOT NULL DEFAULT 1,
      team_id INTEGER NOT NULL DEFAULT 1 REFERENCES team(id)
    );

    CREATE TABLE IF NOT EXISTS games (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      opponent           TEXT NOT NULL DEFAULT 'Opponent',
      date               TEXT NOT NULL,
      notes              TEXT DEFAULT '',
      finished           INTEGER NOT NULL DEFAULT 0,
      total_secs         INTEGER NOT NULL DEFAULT 0,
      team_id            INTEGER NOT NULL DEFAULT 1 REFERENCES team(id),
      period_type        TEXT NOT NULL DEFAULT 'quarters',
      clock_direction    TEXT NOT NULL DEFAULT 'up',
      period_duration_sec INTEGER NOT NULL DEFAULT 0
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

    CREATE TABLE IF NOT EXISTS game_events (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id       INTEGER NOT NULL REFERENCES games(id),
      event_type    TEXT NOT NULL,
      game_time_sec INTEGER NOT NULL,
      quarter       INTEGER NOT NULL DEFAULT 1,
      detail        TEXT DEFAULT '',
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Idempotent column additions for existing databases
  // eslint-disable-next-line no-unused-vars
  try { db.run(`ALTER TABLE players ADD COLUMN team_id INTEGER NOT NULL DEFAULT 1 REFERENCES team(id);`); } catch (_) { /* column already exists */ }
  // eslint-disable-next-line no-unused-vars
  try { db.run(`ALTER TABLE games ADD COLUMN team_id INTEGER NOT NULL DEFAULT 1 REFERENCES team(id);`); } catch (_) { /* column already exists */ }
  // eslint-disable-next-line no-unused-vars
  try { db.run(`ALTER TABLE games ADD COLUMN period_type TEXT NOT NULL DEFAULT 'quarters';`); } catch (_) { /* column already exists */ }
  // eslint-disable-next-line no-unused-vars
  try { db.run(`ALTER TABLE games ADD COLUMN clock_direction TEXT NOT NULL DEFAULT 'up';`); } catch (_) { /* column already exists */ }
  // eslint-disable-next-line no-unused-vars
  try { db.run(`ALTER TABLE games ADD COLUMN period_duration_sec INTEGER NOT NULL DEFAULT 0;`); } catch (_) { /* column already exists */ }
  // eslint-disable-next-line no-unused-vars
  try { db.run(`ALTER TABLE game_events ADD COLUMN wall_time INTEGER;`); } catch (_) { /* column already exists */ }
  // eslint-disable-next-line no-unused-vars
  try { db.run(`ALTER TABLE substitutions ADD COLUMN wall_time INTEGER;`); } catch (_) { /* column already exists */ }

  // Seed default team only if the team table is empty
  const teamCount = db.exec(`SELECT COUNT(*) as cnt FROM team;`);
  if (teamCount.length === 0 || teamCount[0].values[0][0] === 0) {
    db.run(`INSERT INTO team (id, name) VALUES (1, 'My Team');`);
  }
}

export function saveDb(db) {
  const data = db.export();
  const b64 = btoa(String.fromCharCode(...data));
  localStorage.setItem(LS_KEY, b64);
}

// ─── DB helpers ───────────────────────────────────────────────────────────────
export function dbAll(db, sql, params = []) {
  const res = db.exec(sql, params);
  if (!res.length) return [];
  const { columns, values } = res[0];
  return values.map(row => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
}
export function dbGet(db, sql, params = []) { return dbAll(db, sql, params)[0] ?? null; }
export function dbRun(db, sql, params = []) { db.run(sql, params); saveDb(db); }

// ─── Team CRUD helpers ────────────────────────────────────────────────────────
const ACTIVE_TEAM_KEY = "subtracker_active_team";

export function createTeam(db, name) {
  if (!name || !name.trim()) return null;
  db.run(`INSERT INTO team (name) VALUES (?)`, [name.trim()]);
  const row = db.exec(`SELECT last_insert_rowid() as id`);
  const newId = row[0].values[0][0];
  saveDb(db);
  return newId;
}

export function deleteTeam(db, teamId) {
  // Get all game IDs belonging to this team
  const games = dbAll(db, `SELECT id FROM games WHERE team_id = ?`, [teamId]);
  const gameIds = games.map(g => g.id);

  if (gameIds.length > 0) {
    const placeholders = gameIds.map(() => '?').join(',');
    // Delete game_events for these games
    db.run(`DELETE FROM game_events WHERE game_id IN (${placeholders})`, gameIds);
    // Delete substitutions for these games
    db.run(`DELETE FROM substitutions WHERE game_id IN (${placeholders})`, gameIds);
    // Delete game_players for these games
    db.run(`DELETE FROM game_players WHERE game_id IN (${placeholders})`, gameIds);
  }

  // Delete players belonging to this team
  db.run(`DELETE FROM players WHERE team_id = ?`, [teamId]);
  // Delete games belonging to this team
  db.run(`DELETE FROM games WHERE team_id = ?`, [teamId]);
  // Delete the team itself
  db.run(`DELETE FROM team WHERE id = ?`, [teamId]);

  saveDb(db);
}

export function getTeams(db) {
  return dbAll(db, `SELECT * FROM team ORDER BY id`);
}

export function getActiveTeamId(db) {
  const stored = localStorage.getItem(ACTIVE_TEAM_KEY);
  if (stored) {
    const id = Number(stored);
    const team = dbGet(db, `SELECT id FROM team WHERE id = ?`, [id]);
    if (team) return id;
  }
  // Fall back to first team
  const first = dbGet(db, `SELECT id FROM team ORDER BY id LIMIT 1`);
  return first ? first.id : null;
}

export function setActiveTeamId(id) {
  localStorage.setItem(ACTIVE_TEAM_KEY, String(id));
}
