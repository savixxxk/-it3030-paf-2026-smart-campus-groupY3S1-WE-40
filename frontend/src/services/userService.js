const BASE_URL = "http://localhost:8081/api/users";

function authHeaders() {
	const token = localStorage.getItem("smart-campus-token");
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getUserByEmail(email) {
	const response = await fetch(`${BASE_URL}/by-email?email=${encodeURIComponent(email)}`, { headers: { ...authHeaders() } });
	if (!response.ok) {
		throw new Error("User not found");
	}
	return response.json();
}
