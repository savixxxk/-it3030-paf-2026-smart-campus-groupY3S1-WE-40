const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const BOOKINGS_URL = `${API_BASE}/api/bookings`;

async function parseJsonResponse(response) {
	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(data.message || data.error || "Request failed");
	}
	return data;
}

export async function createBooking(payload) {
	const response = await fetch(BOOKINGS_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}

export async function getMyBookings(email) {
	const response = await fetch(`${BOOKINGS_URL}/my?email=${encodeURIComponent(email)}`);
	return parseJsonResponse(response);
}

export async function cancelBooking(bookingId, email) {
	const response = await fetch(`${BOOKINGS_URL}/${bookingId}/cancel?email=${encodeURIComponent(email)}`, {
		method: "PUT"
	});
	return parseJsonResponse(response);
}

export async function getAllBookings(filters = {}) {
	const params = new URLSearchParams();
	if (filters.status) params.set("status", filters.status);
	if (filters.resourceId) params.set("resourceId", String(filters.resourceId));
	if (filters.from) params.set("from", filters.from);
	if (filters.to) params.set("to", filters.to);

	const query = params.toString();
	const url = query ? `${BOOKINGS_URL}?${query}` : BOOKINGS_URL;
	const response = await fetch(url);
	return parseJsonResponse(response);
}

export async function approveBooking(bookingId, payload) {
	const response = await fetch(`${BOOKINGS_URL}/${bookingId}/approve`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}

export async function rejectBooking(bookingId, payload) {
	const response = await fetch(`${BOOKINGS_URL}/${bookingId}/reject`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}

