import { createContext, createElement, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem("smart-campus-user");
		return saved ? JSON.parse(saved) : null;
	});

	// Listen for auth changes in other tabs/popups (e.g., OAuth flow in a popup)
	useEffect(() => {
		const onStorage = (e) => {
			if (e.key === "smart-campus-user") {
				setUser(e.newValue ? JSON.parse(e.newValue) : null);
			}
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	const login = useCallback(async (payload) => {
		const data = await loginUser(payload);
		setUser(data);
		localStorage.setItem("smart-campus-user", JSON.stringify(data));
		return data;
	}, []);

	const completeOAuthLogin = useCallback((payload) => {
		setUser(payload);
		localStorage.setItem("smart-campus-user", JSON.stringify(payload));
		return payload;
	}, []);

	const register = useCallback(async (payload) => {
		const data = await registerUser(payload);
		setUser(data);
		localStorage.setItem("smart-campus-user", JSON.stringify(data));
		return data;
	}, []);

	const logout = useCallback(() => {
		setUser(null);
		localStorage.removeItem("smart-campus-user");

		void fetch(`${API_BASE}/api/auth/logout`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" }
		}).catch((err) => {
			console.error("Logout error:", err);
		});
	}, []);

	const value = useMemo(
		() => ({ user, isAuthenticated: Boolean(user), login, register, logout, completeOAuthLogin }),
		[user]
	);

	return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
