import { createContext, createElement, useContext, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem("smart-campus-user");
		return saved ? JSON.parse(saved) : null;
	});
	const [token, setToken] = useState(() => localStorage.getItem("smart-campus-token") || "");

	const persistSession = (data) => {
		setUser(data);
		localStorage.setItem("smart-campus-user", JSON.stringify(data));
		if (data?.token) {
			setToken(data.token);
			localStorage.setItem("smart-campus-token", data.token);
		} else {
			setToken("");
			localStorage.removeItem("smart-campus-token");
		}
	};

	const login = async (payload) => {
		const data = await loginUser(payload);
		persistSession(data);
		return data;
	};

	const completeOAuthLogin = (payload) => {
		persistSession(payload);
		return payload;
	};

	const register = async (payload) => {
		const data = await registerUser(payload);
		persistSession(data);
		return data;
	};

	const logout = () => {
		setUser(null);
		setToken("");
		localStorage.removeItem("smart-campus-user");
		localStorage.removeItem("smart-campus-token");
	};

	const value = useMemo(
		() => ({ user, token, isAuthenticated: Boolean(user), login, register, logout, completeOAuthLogin }),
		[user, token]
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
