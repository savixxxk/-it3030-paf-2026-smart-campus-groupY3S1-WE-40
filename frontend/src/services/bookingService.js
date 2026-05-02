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

/**
 * Downloads the current user's bookings as a PDF (same data as the "Your bookings" table).
 */
export async function downloadMyBookingsPdf() {
	const response = await fetch(`${BOOKINGS_URL}/my/report/pdf`, {
		method: "GET",
		credentials: "include"
	});
	if (!response.ok) {
		const data = await response.json().catch(() => ({}));
		throw new Error(data.message || data.error || "Failed to download report");
	}
	const blob = await response.blob();
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = "my-bookings-report.pdf";
	anchor.style.display = "none";
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}

