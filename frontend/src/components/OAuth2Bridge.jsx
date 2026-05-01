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
				console.error("OAuth error detected in URL");
				navigate("/login", { replace: true });
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
		
		// Wait a tick to ensure state is updated before navigation
		setTimeout(() => {
			navigate("/", { replace: true });
		}, 0);
	}, [completeOAuthLogin, location.search, navigate]);

	return null;
}
