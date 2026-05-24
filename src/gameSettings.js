const LS_KEY = "subtracker-game-settings";

const DEFAULTS = {
    sortMode: "game",        // "game" (total court time) or "stint" (current stint)
    showCourtStint: true,    // show stint timer for on-court players
    showBenchStint: true,    // show stint timer for bench players
    showGamePct: false,      // show % of game played on each card
    courtWarningMin: 10,     // highlight court player after N minutes in current stint
    benchWarningMin: 6,      // highlight bench player after N minutes in current stint
    showPlayerNumber: true,  // show jersey number on cards
    simplifiedControls: true, // simplified clock: Start/End period + Pause only
};

export function loadGameSettings() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return { ...DEFAULTS };
        return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
        return { ...DEFAULTS };
    }
}

export function saveGameSettings(settings) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(settings));
    } catch { /* noop */ }
}

export { DEFAULTS as GAME_SETTINGS_DEFAULTS };
