import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

/**
 * Hook to verify authentication with the backend
 * Useful after OAuth redirect to ensure session is properly established
 */
export function useAuthVerify() {
	const { completeOAuthLogin } = useAuth();

	useEffect(() => {
		const verifyAuth = async () => {
			try {
				const response = await fetch(`${API_BASE}/api/auth/verify`, {
					method: "GET",
					credentials: "include",
					headers: { "Content-Type": "application/json" }
				});

				if (response.ok) {
					const user = await response.json();
					if (user?.email) {
						completeOAuthLogin({
							fullName: user.name,
							email: user.email,
							role: user.role
						});
					}
				}
			} catch (err) {
				// Silently fail - user might not be authenticated
			}
		};

		verifyAuth();
	}, [completeOAuthLogin]);
}
