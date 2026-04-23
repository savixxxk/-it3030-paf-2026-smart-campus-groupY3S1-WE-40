const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const NOTIFICATIONS_URL = `${API_BASE}/api/notifications`;
const PREFERENCES_URL = `${API_BASE}/api/preferences`;

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

export async function getAdminNotifications() {
	const response = await fetch(`${NOTIFICATIONS_URL}/admin`, { headers: { ...authHeaders() } });
	return parseJsonResponse(response);
}

export async function createNotification(payload) {
	const response = await fetch(`${NOTIFICATIONS_URL}/admin`, {
		method: "POST",
		headers: { "Content-Type": "application/json", ...authHeaders() },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}

export async function getStudentNotifications(email) {
	const response = await fetch(`${NOTIFICATIONS_URL}/student?email=${encodeURIComponent(email)}`, { headers: { ...authHeaders() } });
	return parseJsonResponse(response);
}

export async function markNotificationRead(notificationId, email) {
	const response = await fetch(`${NOTIFICATIONS_URL}/${notificationId}/read?email=${encodeURIComponent(email)}`, {
		method: "POST",
		headers: { ...authHeaders() }
	});
	return parseJsonResponse(response);
}

export async function getNotificationPreferences(email) {
	const response = await fetch(`${PREFERENCES_URL}/notifications?email=${encodeURIComponent(email)}`, { headers: { ...authHeaders() } });
	return parseJsonResponse(response);
}

export async function updateNotificationPreference(email, category, enabled) {
	const response = await fetch(`${PREFERENCES_URL}/notifications?email=${encodeURIComponent(email)}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json", ...authHeaders() },
		body: JSON.stringify({ category, enabled })
	});
	return parseJsonResponse(response);
}

export async function getDoNotDisturb(email) {
	const response = await fetch(`${PREFERENCES_URL}/dnd?email=${encodeURIComponent(email)}`, { headers: { ...authHeaders() } });
	return parseJsonResponse(response);
}

export async function updateDoNotDisturb(email, enabled) {
	const response = await fetch(`${PREFERENCES_URL}/dnd?email=${encodeURIComponent(email)}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json", ...authHeaders() },
		body: JSON.stringify({ enabled })
	});
	return parseJsonResponse(response);
}