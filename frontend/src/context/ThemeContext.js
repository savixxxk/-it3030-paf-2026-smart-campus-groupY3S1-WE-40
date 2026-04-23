import { createContext, createElement, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
	const [isDark, setIsDark] = useState(() => {
		const saved = localStorage.getItem("smart-campus-theme");
		if (saved) return saved === "dark";
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	useEffect(() => {
		localStorage.setItem("smart-campus-theme", isDark ? "dark" : "light");
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDark]);

	const toggleTheme = () => setIsDark((prev) => !prev);

	return createElement(ThemeContext.Provider, { value: { isDark, toggleTheme } }, children);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
