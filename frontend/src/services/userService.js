const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const BASE_URL = `${API_BASE}/api/users`;

export async function getUserByEmail(email) {
	const response = await fetch(`${BASE_URL}/by-email?email=${encodeURIComponent(email)}`, {
		credentials: "include"
	});
	if (!response.ok) {
		throw new Error("User not found");
	}
	return response.json();
}
