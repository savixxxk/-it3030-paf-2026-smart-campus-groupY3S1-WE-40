const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const TICKETS_URL = `${API_BASE}/api/tickets`;
const COMMENTS_URL = `${API_BASE}/api/comments`;

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

export async function createTicket(payload) {
	const response = await fetch(TICKETS_URL, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	return parseJsonResponse(response);
}

export async function getMyTickets() {
	const response = await fetch(`${TICKETS_URL}/my`, { credentials: "include" });
	return parseJsonResponse(response);
}

export async function getAllTickets(filters) {
	const response = await fetch(`${TICKETS_URL}${buildQuery(filters)}`, { credentials: "include" });
	return parseJsonResponse(response);
}

export async function getTicketById(id) {
	const response = await fetch(`${TICKETS_URL}/${id}`, { credentials: "include" });
	return parseJsonResponse(response);
}

export async function assignTicket(id, technicianEmail) {
	const response = await fetch(`${TICKETS_URL}/${id}/assign`, {
		method: "PUT",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ technicianEmail })
	});
	return parseJsonResponse(response);
}

export async function rejectTicket(id, reason) {
	const response = await fetch(`${TICKETS_URL}/${id}/reject`, {
		method: "PUT",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ reason })
	});
	return parseJsonResponse(response);
}

export async function updateTicketStatus(id, status) {
	const response = await fetch(`${TICKETS_URL}/${id}/status`, {
		method: "PUT",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ status })
	});
	return parseJsonResponse(response);
}

export async function resolveTicket(id, resolutionNotes) {
	const response = await fetch(`${TICKETS_URL}/${id}/resolve`, {
		method: "PUT",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ resolutionNotes })
	});
	return parseJsonResponse(response);
}

export async function closeTicket(id) {
	const response = await fetch(`${TICKETS_URL}/${id}/close`, {
		method: "PUT",
		credentials: "include"
	});
	return parseJsonResponse(response);
}

export async function uploadTicketAttachments(ticketId, files) {
	const form = new FormData();
	(files || []).forEach((file) => {
		if (file) form.append("files", file);
	});

	const response = await fetch(`${TICKETS_URL}/${ticketId}/attachments`, {
		method: "POST",
		credentials: "include",
		body: form
	});
	return parseJsonResponse(response);
}

export async function addTicketComment(ticketId, message) {
	const response = await fetch(`${TICKETS_URL}/${ticketId}/comments`, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message })
	});
	return parseJsonResponse(response);
}

export async function updateComment(commentId, message) {
	const response = await fetch(`${COMMENTS_URL}/${commentId}`, {
		method: "PUT",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message })
	});
	return parseJsonResponse(response);
}

export async function deleteComment(commentId) {
	const response = await fetch(`${COMMENTS_URL}/${commentId}`, {
		method: "DELETE",
		credentials: "include"
	});
	if (!response.ok) {
		const data = await response.json().catch(() => ({}));
		throw new Error(data.message || data.error || "Request failed");
	}
	return true;
}

