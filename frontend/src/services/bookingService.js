const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const BOOKINGS_URL = `${API_BASE}/api/bookings`;

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

export async function createBooking(payload) {
	const response = await fetch(BOOKINGS_URL, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}

export async function getMyBookings() {
	const response = await fetch(`${BOOKINGS_URL}/my`, { credentials: "include" });
	return parseJsonResponse(response);
}

export async function getAllBookings(filters) {
	const response = await fetch(`${BOOKINGS_URL}${buildQuery(filters)}`, { credentials: "include" });
	return parseJsonResponse(response);
}

export async function approveBooking(id) {
	const response = await fetch(`${BOOKINGS_URL}/${id}/approve`, {
		method: "PUT",
		credentials: "include"
	});
	return parseJsonResponse(response);
}

export async function rejectBooking(id, reason) {
	const response = await fetch(`${BOOKINGS_URL}/${id}/reject`, {
		method: "PUT",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ reason })
	});
	return parseJsonResponse(response);
}

export async function cancelBooking(id) {
	const response = await fetch(`${BOOKINGS_URL}/${id}/cancel`, {
		method: "PUT",
		credentials: "include"
	});
	return parseJsonResponse(response);
}

