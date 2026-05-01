import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export default function PrivateRoute({ children, requiredRole }) {
	const { isAuthenticated, user, completeOAuthLogin } = useAuth();
	const [verified, setVerified] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const verifyAuth = async () => {
			try {
				const response = await fetch(`${API_BASE}/api/auth/verify`, {
					credentials: "include",
					headers: { "Content-Type": "application/json" }
				});

				if (response.ok) {
					const userData = await response.json();
					if (userData?.email) {
						completeOAuthLogin({
							fullName: userData.name,
							email: userData.email,
							role: userData.role
						});
						setVerified(true);
					}
				}
			} catch (err) {
				// Verification failed, will redirect to login
			} finally {
				setLoading(false);
			}
		};

		if (!isAuthenticated) {
			verifyAuth();
		} else {
			setLoading(false);
			setVerified(true);
		}
	}, [isAuthenticated, completeOAuthLogin]);

	if (loading) {
		return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
	}

	if (!isAuthenticated && !verified) {
		return <Navigate to="/login" replace />;
	}

	if (requiredRole && user?.role !== requiredRole) {
		return <Navigate to="/" replace />;
	}

	return children;
}
