const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const BASE_URL = `${API_BASE}/api/users`;

async function parseJsonResponse(response) {
	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(data.message || data.error || "Request failed");
	}
	return data;
}

export async function getUserByEmail(email) {
	const response = await fetch(`${BASE_URL}/by-email?email=${encodeURIComponent(email)}`, {
		credentials: "include"
	});
	return parseJsonResponse(response);
}

export async function getAllUsers() {
	const response = await fetch(`${BASE_URL}/admin`, {
		credentials: "include"
	});
	return parseJsonResponse(response);
}
