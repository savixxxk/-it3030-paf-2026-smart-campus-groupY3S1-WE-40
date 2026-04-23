import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createBooking, getMyBookings, cancelBooking } from "../services/bookingService";
import { getAvailableResources } from "../services/resourceService";

const STATUS_STYLES = {
	PENDING: "bg-amber-400/20 text-amber-200",
	APPROVED: "bg-emerald-400/15 text-emerald-200",
	REJECTED: "bg-rose-400/20 text-rose-200",
	CANCELLED: "bg-slate-400/20 text-slate-200"
};

function toIsoFromLocalInput(value) {
	if (!value) return "";
	const date = new Date(value);
	return date.toISOString();
}

export default function StudentBookings() {
	const { user } = useAuth();
	const email = user?.email;

	const [resources, setResources] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [status, setStatus] = useState("");

	const [form, setForm] = useState({
		resourceId: "",
		startLocal: "",
		endLocal: "",
		purpose: "",
		expectedAttendees: ""
	});

	const canSubmit = useMemo(() => Boolean(email && form.resourceId && form.startLocal && form.endLocal), [email, form]);

	const loadData = async () => {
		if (!email) return;
		setLoading(true);
		setError("");
		try {
			const [resourceData, bookingData] = await Promise.all([getAvailableResources(), getMyBookings(email)]);
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
	}, [email]);

	const handleChange = (key) => (event) => {
		setForm((prev) => ({ ...prev, [key]: event.target.value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!canSubmit) return;

		setSubmitting(true);
		setError("");
		setStatus("");

		try {
			await createBooking({
				userEmail: email,
				resourceId: Number(form.resourceId),
				startTime: toIsoFromLocalInput(form.startLocal),
				endTime: toIsoFromLocalInput(form.endLocal),
				purpose: form.purpose,
				expectedAttendees: form.expectedAttendees ? Number(form.expectedAttendees) : null
			});

			setStatus("Booking request submitted (PENDING).");
			setForm({ resourceId: "", startLocal: "", endLocal: "", purpose: "", expectedAttendees: "" });
			await loadData();
		} catch (submitError) {
			setError(submitError.message || "Failed to submit booking");
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = async (bookingId) => {
		setError("");
		setStatus("");
		try {
			await cancelBooking(bookingId, email);
			setStatus("Booking cancelled.");
			await loadData();
		} catch (cancelError) {
			setError(cancelError.message || "Failed to cancel booking");
		}
	};

	return (
		<main className="min-h-[calc(100vh-73px)] bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
			<section className="mx-auto max-w-5xl space-y-6">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
					<p className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
						Bookings
					</p>
					<h1 className="mt-3 text-3xl font-black text-white">Request a Resource Booking</h1>
					<p className="mt-2 text-sm text-slate-300">Submit a booking request. Admin will approve or reject it.</p>

					{error ? <p className="mt-6 text-sm font-semibold text-rose-300">{error}</p> : null}
					{status ? <p className="mt-6 text-sm font-semibold text-emerald-300">{status}</p> : null}

					<form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
						<label className="space-y-2">
							<span className="text-sm font-semibold text-slate-200">Resource</span>
							<select
								value={form.resourceId}
								onChange={handleChange("resourceId")}
								className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
							>
								<option value="">Select a resource</option>
								{resources.map((resource) => (
									<option key={resource.id} value={resource.id}>
										{resource.name} · {resource.location} · cap {resource.capacity}
									</option>
								))}
							</select>
						</label>

						<label className="space-y-2">
							<span className="text-sm font-semibold text-slate-200">Expected Attendees (optional)</span>
							<input
								type="number"
								min="0"
								value={form.expectedAttendees}
								onChange={handleChange("expectedAttendees")}
								className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
								placeholder="e.g., 25"
							/>
						</label>

						<label className="space-y-2">
							<span className="text-sm font-semibold text-slate-200">Start Time</span>
							<input
								type="datetime-local"
								value={form.startLocal}
								onChange={handleChange("startLocal")}
								className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
							/>
						</label>

						<label className="space-y-2">
							<span className="text-sm font-semibold text-slate-200">End Time</span>
							<input
								type="datetime-local"
								value={form.endLocal}
								onChange={handleChange("endLocal")}
								className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
							/>
						</label>

						<label className="space-y-2 md:col-span-2">
							<span className="text-sm font-semibold text-slate-200">Purpose (optional)</span>
							<textarea
								value={form.purpose}
								onChange={handleChange("purpose")}
								rows={3}
								className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
								placeholder="e.g., Group presentation practice"
							/>
						</label>

						<div className="md:col-span-2">
							<button
								type="submit"
								disabled={!canSubmit || submitting}
								className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{submitting ? "Submitting..." : "Submit Booking Request"}
							</button>
						</div>
					</form>
				</div>

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
					<h2 className="text-2xl font-black text-white">My Bookings</h2>
					<p className="mt-2 text-sm text-slate-300">View your booking requests and their status.</p>

					{loading ? <p className="mt-6 text-sm text-slate-300">Loading bookings...</p> : null}

					<div className="mt-6 space-y-3">
						{!loading && bookings.length === 0 ? <p className="text-sm text-slate-300">You don’t have any bookings yet.</p> : null}

						{bookings.map((booking) => (
							<article key={booking.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<h3 className="text-base font-bold text-white">
											{booking.resourceName} <span className="text-slate-400">· {booking.resourceLocation}</span>
										</h3>
										<p className="mt-1 text-sm text-slate-300">
											{new Date(booking.startTime).toLocaleString()} → {new Date(booking.endTime).toLocaleString()}
										</p>
										{booking.purpose ? <p className="mt-2 text-sm text-slate-200">{booking.purpose}</p> : null}
										{booking.adminReason ? <p className="mt-2 text-sm text-slate-300">Note: {booking.adminReason}</p> : null}
									</div>

									<div className="flex flex-col items-end gap-3">
										<span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${STATUS_STYLES[booking.status] || "bg-slate-400/15 text-slate-200"}`}>
											{booking.status}
										</span>
										{booking.status === "APPROVED" ? (
											<button
												onClick={() => handleCancel(booking.id)}
												className="rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-300/15"
											>
												Cancel
											</button>
										) : null}
									</div>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}

