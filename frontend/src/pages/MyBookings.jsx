import { useEffect, useMemo, useState } from "react";
import { cancelBooking, createBooking, getMyBookings } from "../services/bookingService";
import { listResources } from "../services/resourceService";

const emptyForm = {
	resourceId: "",
	date: "",
	startTime: "",
	endTime: "",
	purpose: "",
	attendees: ""
};

export default function MyBookings() {
	const [resources, setResources] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [form, setForm] = useState(emptyForm);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const selectedResource = useMemo(
		() => resources.find((r) => String(r.id) === String(form.resourceId)),
		[resources, form.resourceId]
	);

	const refresh = async () => {
		setLoading(true);
		setError("");
		try {
			const [resourceData, bookingData] = await Promise.all([listResources(), getMyBookings()]);
			setResources(Array.isArray(resourceData) ? resourceData : []);
			setBookings(Array.isArray(bookingData) ? bookingData : []);
		} catch (e) {
			setError(e?.message || "Failed to load data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refresh();
	}, []);

	const submit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			await createBooking({
				resourceId: Number(form.resourceId),
				date: form.date,
				startTime: form.startTime,
				endTime: form.endTime,
				purpose: form.purpose,
				attendees: form.attendees ? Number(form.attendees) : null
			});
			setForm(emptyForm);
			await refresh();
		} catch (err) {
			setError(err?.message || "Booking failed");
		}
	};

	const cancel = async (booking) => {
		const ok = window.confirm(`Cancel booking #${booking.id}?`);
		if (!ok) return;
		setError("");
		try {
			await cancelBooking(booking.id);
			await refresh();
		} catch (err) {
			setError(err?.message || "Cancel failed");
		}
	};

	return (
		<main className="min-h-[calc(100vh-73px)] bg-slate-950 text-slate-100">
			<section className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h1 className="text-3xl font-black text-white">My bookings</h1>
							<p className="mt-2 text-sm text-slate-300">Request a booking and manage your existing ones.</p>
						</div>
						<button
							type="button"
							onClick={refresh}
							className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
						>
							Refresh
						</button>
					</div>

					{error ? (
						<p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>
					) : null}

					<form onSubmit={submit} className="mt-6 grid gap-3 md:grid-cols-2">
						<label className="grid gap-1 md:col-span-2">
							<span className="text-xs font-semibold text-slate-300">Resource</span>
							<select
								required
								value={form.resourceId}
								onChange={(e) => setForm((p) => ({ ...p, resourceId: e.target.value }))}
								className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
							>
								<option value="">Select resource</option>
								{resources.map((r) => (
									<option key={r.id} value={r.id}>
										{r.name} ({r.type})
									</option>
								))}
							</select>
							{selectedResource ? (
								<div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
									<span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
										Availability {selectedResource.availabilityStart}–{selectedResource.availabilityEnd}
									</span>
									<span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">Capacity {selectedResource.capacity}</span>
									<span
										className={[
											"rounded-full border border-white/10 bg-white/5 px-2 py-1",
											selectedResource.status === "ACTIVE" ? "text-emerald-200" : "text-amber-200"
										].join(" ")}
									>
										{selectedResource.status}
									</span>
								</div>
							) : null}
						</label>

						<label className="grid gap-1">
							<span className="text-xs font-semibold text-slate-300">Date</span>
							<input
								required
								type="date"
								value={form.date}
								onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
								className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
							/>
						</label>
						<div className="grid grid-cols-2 gap-3">
							<label className="grid gap-1">
								<span className="text-xs font-semibold text-slate-300">Start</span>
								<input
									required
									type="time"
									value={form.startTime}
									onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
									className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
								/>
							</label>
							<label className="grid gap-1">
								<span className="text-xs font-semibold text-slate-300">End</span>
								<input
									required
									type="time"
									value={form.endTime}
									onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
									className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
								/>
							</label>
						</div>

						<label className="grid gap-1 md:col-span-2">
							<span className="text-xs font-semibold text-slate-300">Purpose</span>
							<input
								required
								placeholder="Eg: Club meeting, lecture, workshop…"
								value={form.purpose}
								onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))}
								className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
							/>
						</label>

						<label className="grid gap-1">
							<span className="text-xs font-semibold text-slate-300">Attendees (optional)</span>
							<input
								type="number"
								min="1"
								placeholder="Eg: 30"
								value={form.attendees}
								onChange={(e) => setForm((p) => ({ ...p, attendees: e.target.value }))}
								className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
							/>
						</label>

						<div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
							<button
								className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300"
								type="submit"
							>
								Request booking
							</button>
						</div>
					</form>
				</div>

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-black text-white">Your bookings</h2>
						{loading ? <span className="text-xs text-slate-400">Loading…</span> : null}
					</div>
					<div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
						<table className="min-w-[720px] w-full text-left text-sm text-slate-200">
							<thead className="bg-slate-900/60 text-xs uppercase text-slate-400">
								<tr>
									<th className="px-4 py-3">Booking</th>
									<th className="px-4 py-3">Resource</th>
									<th className="px-4 py-3">When</th>
									<th className="px-4 py-3">Status</th>
									<th className="px-4 py-3 text-right">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5 bg-slate-950/20">
								{bookings.length === 0 ? (
									<tr>
										<td className="px-4 py-6 text-slate-400" colSpan={5}>
											No bookings yet.
										</td>
									</tr>
								) : (
									bookings.map((b) => (
										<tr key={b.id} className="hover:bg-white/5">
											<td className="px-4 py-3">
												<div className="font-semibold text-white">#{b.id}</div>
												<div className="text-xs text-slate-400">{b.purpose}</div>
												{b.adminResponseReason ? (
													<div className="text-xs text-slate-500">Reason: {b.adminResponseReason}</div>
												) : null}
											</td>
											<td className="px-4 py-3">{b.resourceName}</td>
											<td className="px-4 py-3">
												<div>{b.date}</div>
												<div className="text-xs text-slate-400">
													{b.startTime} - {b.endTime}
												</div>
											</td>
											<td className="px-4 py-3">
												<span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold">
													{b.status}
												</span>
											</td>
											<td className="px-4 py-3 text-right">
												{b.status === "PENDING" || b.status === "APPROVED" ? (
													<button
														onClick={() => cancel(b)}
														className="rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/20"
													>
														Cancel
													</button>
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
		</main>
	);
}

