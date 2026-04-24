import { createContext, createElement, useContext, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin@1";
const ADMIN_NAME = "admin";

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem("smart-campus-user");
		return saved ? JSON.parse(saved) : null;
	});

	const login = async (payload) => {
		let data;

<<<<<<< HEAD
		if (payload.email?.toLowerCase() === ADMIN_EMAIL && payload.password === ADMIN_PASSWORD) {
			data = { fullName: ADMIN_NAME, email: ADMIN_EMAIL, role: "ADMIN" };
		} else {
			data = await loginUser(payload);
		}
=======
		data = await loginUser(payload);
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb

		setUser(data);
		localStorage.setItem("smart-campus-user", JSON.stringify(data));
		return data;
	};

	const completeOAuthLogin = (payload) => {
		setUser(payload);
		localStorage.setItem("smart-campus-user", JSON.stringify(payload));
		return payload;
	};

	const register = async (payload) => {
		const data = await registerUser(payload);
		setUser(data);
		localStorage.setItem("smart-campus-user", JSON.stringify(data));
		return data;
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("smart-campus-user");
	};

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
