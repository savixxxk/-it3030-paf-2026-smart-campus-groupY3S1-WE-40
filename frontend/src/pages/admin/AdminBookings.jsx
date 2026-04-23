import { useEffect, useMemo, useState } from "react";
import { approveBooking, getAllBookings, rejectBooking } from "../../services/bookingService";
import { getResources } from "../../services/resourceService";
import { useAuth } from "../../context/AuthContext";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];

const STATUS_STYLES = {
	PENDING: "bg-amber-400/20 text-amber-200",
	APPROVED: "bg-emerald-400/15 text-emerald-200",
	REJECTED: "bg-rose-400/20 text-rose-200",
	CANCELLED: "bg-slate-400/20 text-slate-200"
};

export default function AdminBookings() {
	const { user } = useAuth();
	const adminEmail = user?.email || "admin@gmail.com";

	const [bookings, setBookings] = useState([]);
	const [resources, setResources] = useState([]);
	const [filters, setFilters] = useState({ status: "", resourceId: "" });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [status, setStatus] = useState("");
	const [decision, setDecision] = useState({ bookingId: null, action: null, reason: "" });

	const filteredBookings = useMemo(() => bookings, [bookings]);

	const loadData = async () => {
		setLoading(true);
		setError("");
		try {
			const [resourceData, bookingData] = await Promise.all([
				getResources(),
				getAllBookings({
					status: filters.status || undefined,
					resourceId: filters.resourceId || undefined
				})
			]);
			setResources(resourceData);
			setBookings(bookingData);
		} catch (loadError) {
			setError(loadError.message || "Failed to load bookings");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, [filters.status, filters.resourceId]);

	const openDecision = (bookingId, action) => {
		setStatus("");
		setError("");
		setDecision({ bookingId, action, reason: "" });
	};

	const closeDecision = () => setDecision({ bookingId: null, action: null, reason: "" });

	const submitDecision = async () => {
		if (!decision.bookingId || !decision.action) return;
		setStatus("");
		setError("");
		try {
			const payload = { adminEmail, reason: decision.reason };
			if (decision.action === "approve") {
				await approveBooking(decision.bookingId, payload);
				setStatus("Booking approved.");
			} else {
				await rejectBooking(decision.bookingId, payload);
				setStatus("Booking rejected.");
			}
			closeDecision();
			await loadData();
		} catch (decisionError) {
			setError(decisionError.message || "Failed to update booking");
		}
	};

	return (
		<section className="space-y-6">
			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<h2 className="text-2xl font-black text-white">Bookings</h2>
				<p className="mt-2 text-sm text-slate-300">Review booking requests and approve or reject them.</p>

				<div className="mt-6 grid gap-4 md:grid-cols-2">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-200">Status</span>
						<select
							value={filters.status}
							onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
							className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
						>
							<option value="">All</option>
							{STATUS_OPTIONS.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-slate-200">Resource</span>
						<select
							value={filters.resourceId}
							onChange={(event) => setFilters((prev) => ({ ...prev, resourceId: event.target.value }))}
							className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
						>
							<option value="">All</option>
							{resources.map((resource) => (
								<option key={resource.id} value={resource.id}>
									{resource.name} · {resource.location}
								</option>
							))}
						</select>
					</label>
				</div>

				{loading ? <p className="mt-6 text-sm text-slate-300">Loading bookings...</p> : null}
				{error ? <p className="mt-6 text-sm font-semibold text-rose-300">{error}</p> : null}
				{status ? <p className="mt-6 text-sm font-semibold text-emerald-300">{status}</p> : null}

				<div className="mt-6 space-y-3">
					{!loading && filteredBookings.length === 0 ? (
						<p className="text-sm text-slate-300">No bookings found.</p>
					) : null}

					{filteredBookings.map((booking) => (
						<article key={booking.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div className="flex-1">
									<h3 className="text-base font-bold text-white">
										{booking.resourceName} <span className="text-slate-400">· {booking.resourceLocation}</span>
									</h3>
									<p className="mt-1 text-sm text-slate-300">
										{new Date(booking.startTime).toLocaleString()} → {new Date(booking.endTime).toLocaleString()}
									</p>
									<p className="mt-2 text-sm text-slate-200">
										<span className="text-slate-400">Requested by:</span> {booking.userName || booking.userEmail}{" "}
										<span className="text-slate-500">({booking.userEmail})</span>
									</p>
									{booking.purpose ? <p className="mt-2 text-sm text-slate-200">{booking.purpose}</p> : null}
									{booking.expectedAttendees != null ? (
										<p className="mt-1 text-sm text-slate-300">Expected attendees: {booking.expectedAttendees}</p>
									) : null}
									{booking.adminReason ? <p className="mt-2 text-sm text-slate-300">Reason/Note: {booking.adminReason}</p> : null}
								</div>

								<div className="flex flex-col items-end gap-3">
									<span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${STATUS_STYLES[booking.status] || "bg-slate-400/15 text-slate-200"}`}>
										{booking.status}
									</span>

									{booking.status === "PENDING" ? (
										<div className="flex flex-wrap items-center justify-end gap-2">
											<button
												onClick={() => openDecision(booking.id, "approve")}
												className="rounded-xl bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-300"
											>
												Approve
											</button>
											<button
												onClick={() => openDecision(booking.id, "reject")}
												className="rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-300/15"
											>
												Reject
											</button>
										</div>
									) : null}
								</div>
							</div>
						</article>
					))}
				</div>
			</div>

			{decision.bookingId ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
					<div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
						<h3 className="text-xl font-black text-white">
							{decision.action === "approve" ? "Approve Booking" : "Reject Booking"}
						</h3>
						<p className="mt-2 text-sm text-slate-300">
							{decision.action === "approve"
								? "Optionally leave a note (it will be visible to the student)."
								: "Provide a reason for rejection (required)."}
						</p>

						<textarea
							rows={4}
							value={decision.reason}
							onChange={(event) => setDecision((prev) => ({ ...prev, reason: event.target.value }))}
							className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
							placeholder={decision.action === "approve" ? "Optional note..." : "Reason for rejection..."}
						/>

						<div className="mt-6 flex items-center justify-end gap-3">
							<button
								onClick={closeDecision}
								className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-900/80"
							>
								Cancel
							</button>
							<button
								onClick={submitDecision}
								className="rounded-xl bg-cyan-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}
