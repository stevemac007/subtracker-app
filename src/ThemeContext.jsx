import { createContext, useContext, useState, useEffect, useCallback } from "react";
import THEMES, { THEME_KEYS } from "./themes.js";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try { return localStorage.getItem("subtracker-theme") || "hardwood"; }
        catch { return "hardwood"; }
    });

    useEffect(() => {
        try { localStorage.setItem("subtracker-theme", theme); } catch { /* noop */ }
    }, [theme]);

    const cycleTheme = useCallback(() => {
        setTheme(t => {
            const i = THEME_KEYS.indexOf(t);
            return THEME_KEYS[(i + 1) % THEME_KEYS.length];
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, vars: THEMES[theme]?.vars || THEMES.hardwood.vars }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
