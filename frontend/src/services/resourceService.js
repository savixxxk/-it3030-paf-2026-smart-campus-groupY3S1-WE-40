const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const RESOURCES_URL = `${API_BASE}/api/resources`;

async function parseJsonResponse(response) {
	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(data.message || data.error || "Request failed");
	}
	return data;
}

function buildQuery(params) {
	const qs = new URLSearchParams();
	Object.entries(params || {}).forEach(([key, value]) => {
		if (value === undefined || value === null || value === "") return;
		qs.set(key, String(value));
	});
	const str = qs.toString();
	return str ? `?${str}` : "";
}

export async function listResources(filters) {
	const response = await fetch(`${RESOURCES_URL}${buildQuery(filters)}`, {
		credentials: "include"
	});
	return parseJsonResponse(response);
}

export async function getResourceById(id) {
	const response = await fetch(`${RESOURCES_URL}/${id}`, { credentials: "include" });
	return parseJsonResponse(response);
}

export async function createResource(payload) {
	const response = await fetch(RESOURCES_URL, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}

export async function updateResource(id, payload) {
	const response = await fetch(`${RESOURCES_URL}/${id}`, {
		method: "PUT",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}

export async function deleteResource(id) {
	const response = await fetch(`${RESOURCES_URL}/${id}`, {
		method: "DELETE",
		credentials: "include"
	});
	if (!response.ok) {
		const data = await response.json().catch(() => ({}));
		throw new Error(data.message || data.error || "Request failed");
	}
	return true;
}

