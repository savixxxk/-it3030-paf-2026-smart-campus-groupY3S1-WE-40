import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuth2Bridge() {
	const location = useLocation();
	const navigate = useNavigate();
	const { completeOAuthLogin } = useAuth();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const oauthStatus = params.get("oauth");

		if (oauthStatus !== "success") { 
			if (oauthStatus === "error") {
				const message = params.get("message") || "OAuth login failed";
				console.error("OAuth error detected in URL", message);
				navigate(`/login?error=${encodeURIComponent(message)}`, { replace: true });
			}
			return; 
		}

		const name = params.get("name") || "Google User";
		const email = params.get("email") || "";
		const role = params.get("role") || "USER";

		if (!email) { 
			console.error("OAuth: Missing email in callback");
			navigate("/login", { replace: true });
			return; 
		}

		console.log("OAuth2Bridge: Processing successful auth", { email, name, role });
		completeOAuthLogin({ fullName: name, email, role });

		// write a short ping so other windows/tabs receive a storage event
		try {
			localStorage.setItem("smart-campus-user-ping", String(Date.now()));
		} catch (e) {
			// ignore
		}

		// Wait a tick to ensure state is updated before navigation
		setTimeout(() => {
			navigate("/", { replace: true });
		}, 0);
	}, [location.search]);

	return null;
}
