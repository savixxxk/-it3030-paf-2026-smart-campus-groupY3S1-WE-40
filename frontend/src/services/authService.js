const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const BASE_URL = `${API_BASE}/api/auth`;

async function parseJsonResponse(response) {
	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(data.message || data.error || "Request failed");
	}
	return data;
}

export async function registerUser(payload) {
	const response = await fetch(`${BASE_URL}/register`, {
		method: "POST",
<<<<<<< HEAD
=======
		credentials: "include",
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}

export async function loginUser(payload) {
	const response = await fetch(`${BASE_URL}/login`, {
		method: "POST",
<<<<<<< HEAD
=======
		credentials: "include",
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}
