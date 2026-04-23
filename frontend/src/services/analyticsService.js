const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const ANALYTICS_URL = `${API_BASE}/api/analytics`;

function authHeaders() {
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

export async function getAnalyticsDashboard() {
	const response = await fetch(`${ANALYTICS_URL}/dashboard`, { headers: { ...authHeaders() } });
	return parseJsonResponse(response);
}
