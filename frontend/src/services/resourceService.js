const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const RESOURCES_URL = `${API_BASE}/api/resources`;

async function parseJsonResponse(response) {
	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(data.message || data.error || "Request failed");
	}
	return data;
}

export async function getResources(query) {
	const url = query ? `${RESOURCES_URL}?query=${encodeURIComponent(query)}` : RESOURCES_URL;
	const response = await fetch(url);
	return parseJsonResponse(response);
}

export async function getAvailableResources() {
	const response = await fetch(`${RESOURCES_URL}/available`);
	return parseJsonResponse(response);
}

