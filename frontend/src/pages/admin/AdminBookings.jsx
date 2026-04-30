import { useEffect, useMemo, useState } from "react";
import { approveBooking, getAllBookings, rejectBooking } from "../../services/bookingService";

const STATUSES = ["", "PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"];

export default function AdminBookings() {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [filters, setFilters] = useState({ status: "", resourceId: "" });

	const activeFilters = useMemo(() => {
		const out = {};
		if (filters.status) out.status = filters.status;
		if (filters.resourceId) out.resourceId = filters.resourceId;
		return out;
	}, [filters]);

	const refresh = async () => {
		setLoading(true);
		setError("");
		try {
			const data = await getAllBookings(activeFilters);
			setBookings(Array.isArray(data) ? data : []);
		} catch (e) {
			setError(e?.message || "Failed to load bookings");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeFilters.status, activeFilters.resourceId]);

	const approve = async (booking) => {
		setError("");
		try {
			await approveBooking(booking.id);
			await refresh();
		} catch (e) {
			setError(e?.message || "Approve failed");
		}
	};

	const reject = async (booking) => {
		const reason = window.prompt("Reject reason (required):");
		if (!reason) return;
		setError("");
		try {
			await rejectBooking(booking.id, reason);
			await refresh();
		} catch (e) {
			setError(e?.message || "Reject failed");
		}
	};

	return (
		<section className="space-y-6">
			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-2xl font-black text-white">Bookings</h2>
						<p className="mt-2 text-sm text-slate-300">Manage resource bookings and approvals.</p>
					</div>
					<button
						onClick={refresh}
						className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
					>
						Refresh
					</button>
				</div>

				{error ? <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

				<div className="mt-6 grid gap-3 md:grid-cols-2">
					<select
						value={filters.status}
						onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
						className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
					>
						{STATUSES.map((s) => (
							<option key={s || "ALL"} value={s}>
								{s ? s : "All statuses"}
							</option>
						))}
					</select>
					<input
						placeholder="Filter by resourceId"
						value={filters.resourceId}
						onChange={(e) => setFilters((p) => ({ ...p, resourceId: e.target.value }))}
						className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
					/>
				</div>

				<div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
					<table className="w-full text-left text-sm text-slate-200">
						<thead className="bg-slate-900/60 text-xs uppercase text-slate-400">
							<tr>
								<th className="px-4 py-3">Booking</th>
								<th className="px-4 py-3">User</th>
								<th className="px-4 py-3">Resource</th>
								<th className="px-4 py-3">When</th>
								<th className="px-4 py-3">Status</th>
								<th className="px-4 py-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-white/5 bg-slate-950/20">
							{loading ? (
								<tr>
									<td className="px-4 py-6 text-slate-400" colSpan={6}>
										Loading...
									</td>
								</tr>
							) : bookings.length === 0 ? (
								<tr>
									<td className="px-4 py-6 text-slate-400" colSpan={6}>
										No bookings found.
									</td>
								</tr>
							) : (
								bookings.map((b) => (
									<tr key={b.id} className="hover:bg-white/5">
										<td className="px-4 py-3">
											<div className="font-semibold text-white">#{b.id}</div>
											<div className="text-xs text-slate-400">{b.purpose}</div>
											{b.adminResponseReason ? <div className="text-xs text-slate-500">Reason: {b.adminResponseReason}</div> : null}
										</td>
										<td className="px-4 py-3">{b.userEmail}</td>
										<td className="px-4 py-3">
											<div className="font-semibold text-white">{b.resourceName}</div>
											<div className="text-xs text-slate-400">ID: {b.resourceId}</div>
										</td>
										<td className="px-4 py-3">
											<div>{b.date}</div>
											<div className="text-xs text-slate-400">
												{b.startTime} - {b.endTime}
											</div>
										</td>
										<td className="px-4 py-3">{b.status}</td>
										<td className="px-4 py-3 text-right">
											{b.status === "PENDING" ? (
												<div className="flex justify-end gap-2">
													<button
														onClick={() => approve(b)}
														className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20"
													>
														Approve
													</button>
													<button
														onClick={() => reject(b)}
														className="rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/20"
													>
														Reject
													</button>
												</div>
											) : (
												<span className="text-xs text-slate-500">—</span>
											)}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
