<<<<<<< HEAD
export default function AdminTickets() {
	return (
		<section className="space-y-6">
			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<h2 className="text-2xl font-black text-white">Support Tickets</h2>
				<p className="mt-2 text-sm text-slate-300">Manage student support and service requests.</p>
				
				<div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/40 p-8 text-center">
					<p className="text-slate-400">Ticket management interface coming soon...</p>
=======
import { useEffect, useMemo, useState } from "react";
import {
	assignTicket,
	closeTicket,
	getAllTickets,
	rejectTicket,
	resolveTicket,
	updateTicketStatus
} from "../../services/ticketService";

const STATUSES = ["", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];
const PRIORITIES = ["", "LOW", "MEDIUM", "HIGH"];
const CATEGORIES = ["", "ELECTRICAL", "HARDWARE", "SOFTWARE", "OTHER"];

export default function AdminTickets() {
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [filters, setFilters] = useState({ status: "", priority: "", category: "", resourceId: "" });

	const activeFilters = useMemo(() => {
		const out = {};
		if (filters.status) out.status = filters.status;
		if (filters.priority) out.priority = filters.priority;
		if (filters.category) out.category = filters.category;
		if (filters.resourceId) out.resourceId = filters.resourceId;
		return out;
	}, [filters]);

	const refresh = async () => {
		setLoading(true);
		setError("");
		try {
			const data = await getAllTickets(activeFilters);
			setTickets(Array.isArray(data) ? data : []);
		} catch (e) {
			setError(e?.message || "Failed to load tickets");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeFilters.status, activeFilters.priority, activeFilters.category, activeFilters.resourceId]);

	const doAssign = async (t) => {
		const email = window.prompt("Technician email:");
		if (!email) return;
		setError("");
		try {
			await assignTicket(t.id, email);
			await refresh();
		} catch (e) {
			setError(e?.message || "Assign failed");
		}
	};

	const doReject = async (t) => {
		const reason = window.prompt("Reject reason:");
		if (!reason) return;
		setError("");
		try {
			await rejectTicket(t.id, reason);
			await refresh();
		} catch (e) {
			setError(e?.message || "Reject failed");
		}
	};

	const doResolve = async (t) => {
		const notes = window.prompt("Resolution notes:");
		if (!notes) return;
		setError("");
		try {
			await resolveTicket(t.id, notes);
			await refresh();
		} catch (e) {
			setError(e?.message || "Resolve failed");
		}
	};

	const doClose = async (t) => {
		const ok = window.confirm("Close this ticket?");
		if (!ok) return;
		setError("");
		try {
			await closeTicket(t.id);
			await refresh();
		} catch (e) {
			setError(e?.message || "Close failed");
		}
	};

	const changeStatus = async (t, status) => {
		setError("");
		try {
			await updateTicketStatus(t.id, status);
			await refresh();
		} catch (e) {
			setError(e?.message || "Status update failed");
		}
	};

	return (
		<section className="space-y-6">
			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-2xl font-black text-white">Support Tickets</h2>
						<p className="mt-2 text-sm text-slate-300">Manage student support and service requests.</p>
					</div>
					<button
						onClick={refresh}
						className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
					>
						Refresh
					</button>
				</div>

				{error ? <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

				<div className="mt-6 grid gap-3 md:grid-cols-4">
					<select
						value={filters.status}
						onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
						className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
					>
						{STATUSES.map((s) => (
							<option key={s || "ALL"} value={s}>
								{s || "All statuses"}
							</option>
						))}
					</select>
					<select
						value={filters.priority}
						onChange={(e) => setFilters((p) => ({ ...p, priority: e.target.value }))}
						className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
					>
						{PRIORITIES.map((p) => (
							<option key={p || "ALL"} value={p}>
								{p || "All priorities"}
							</option>
						))}
					</select>
					<select
						value={filters.category}
						onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
						className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
					>
						{CATEGORIES.map((c) => (
							<option key={c || "ALL"} value={c}>
								{c || "All categories"}
							</option>
						))}
					</select>
					<input
						placeholder="Resource ID"
						value={filters.resourceId}
						onChange={(e) => setFilters((p) => ({ ...p, resourceId: e.target.value }))}
						className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
					/>
				</div>

				<div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
					<table className="min-w-[980px] w-full text-left text-sm text-slate-200">
						<thead className="bg-slate-900/60 text-xs uppercase text-slate-400">
							<tr>
								<th className="px-4 py-3">Ticket</th>
								<th className="px-4 py-3">Resource</th>
								<th className="px-4 py-3">Created by</th>
								<th className="px-4 py-3">Category</th>
								<th className="px-4 py-3">Priority</th>
								<th className="px-4 py-3">Status</th>
								<th className="px-4 py-3">Technician</th>
								<th className="px-4 py-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-white/5 bg-slate-950/20">
							{loading ? (
								<tr>
									<td className="px-4 py-6 text-slate-400" colSpan={8}>
										Loading...
									</td>
								</tr>
							) : tickets.length === 0 ? (
								<tr>
									<td className="px-4 py-6 text-slate-400" colSpan={8}>
										No tickets found.
									</td>
								</tr>
							) : (
								tickets.map((t) => (
									<tr key={t.id} className="hover:bg-white/5">
										<td className="px-4 py-3">
											<div className="font-semibold text-white">#{t.id}</div>
											<div className="line-clamp-2 text-xs text-slate-400">{t.description}</div>
											{t.rejectReason ? <div className="text-xs text-slate-500">Reject: {t.rejectReason}</div> : null}
										</td>
										<td className="px-4 py-3">
											<div className="font-semibold text-white">{t.resourceName}</div>
											<div className="text-xs text-slate-400">ID: {t.resourceId}</div>
										</td>
										<td className="px-4 py-3">{t.createdByEmail}</td>
										<td className="px-4 py-3">{t.category}</td>
										<td className="px-4 py-3">{t.priority}</td>
										<td className="px-4 py-3">
											<select
												value={t.status}
												onChange={(e) => changeStatus(t, e.target.value)}
												className="rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1 text-xs text-white"
											>
												{STATUSES.filter(Boolean).map((s) => (
													<option key={s} value={s}>
														{s}
													</option>
												))}
											</select>
										</td>
										<td className="px-4 py-3">{t.assignedTechnicianEmail || "—"}</td>
										<td className="px-4 py-3 text-right">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => doAssign(t)}
													className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
												>
													Assign
												</button>
												<button
													onClick={() => doResolve(t)}
													className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20"
												>
													Resolve
												</button>
												<button
													onClick={() => doClose(t)}
													className="rounded-lg bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20"
												>
													Close
												</button>
												<button
													onClick={() => doReject(t)}
													className="rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/20"
												>
													Reject
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
				</div>
			</div>
		</section>
	);
}
