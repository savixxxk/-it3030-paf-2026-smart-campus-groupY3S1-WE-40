const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const BASE_URL = `${API_BASE}/api/auth`;

function getAuthHeaders() {
	const token = localStorage.getItem("smart-campus-token");
	return token ? { Authorization: `Bearer ${token}` } : {};
}

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
		headers: { "Content-Type": "application/json", ...getAuthHeaders() },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}

export async function loginUser(payload) {
	const response = await fetch(`${BASE_URL}/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json", ...getAuthHeaders() },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}
