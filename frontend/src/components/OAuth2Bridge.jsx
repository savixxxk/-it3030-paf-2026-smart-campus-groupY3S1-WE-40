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
			return;
		}

		const name = params.get("name") || "Google User";
		const email = params.get("email") || "";
		const role = params.get("role") || "USER";
		const token = params.get("token") || "";

		if (!email) {
			return;
		}

		completeOAuthLogin({ fullName: name, email, role, token });
		navigate("/", { replace: true });
	}, [completeOAuthLogin, location.search, navigate]);

	return null;
}
