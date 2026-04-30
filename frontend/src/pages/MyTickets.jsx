import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listResources } from "../services/resourceService";
import { createTicket, getMyTickets } from "../services/ticketService";

const CATEGORIES = ["ELECTRICAL", "HARDWARE", "SOFTWARE", "OTHER"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

const emptyForm = {
	resourceId: "",
	category: "HARDWARE",
	priority: "MEDIUM",
	description: ""
};

export default function MyTickets() {
	const [resources, setResources] = useState([]);
	const [tickets, setTickets] = useState([]);
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
			const [resourceData, ticketData] = await Promise.all([listResources(), getMyTickets()]);
			setResources(Array.isArray(resourceData) ? resourceData : []);
			setTickets(Array.isArray(ticketData) ? ticketData : []);
		} catch (e) {
			setError(e?.message || "Failed to load tickets");
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
			await createTicket({
				resourceId: Number(form.resourceId),
				category: form.category,
				priority: form.priority,
				description: form.description
			});
			setForm(emptyForm);
			await refresh();
		} catch (err) {
			setError(err?.message || "Ticket creation failed");
		}
	};

	return (
		<main className="min-h-[calc(100vh-73px)] bg-slate-950 text-slate-100">
			<section className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h1 className="text-3xl font-black text-white">My tickets</h1>
							<p className="mt-2 text-sm text-slate-300">Report issues related to campus resources and track progress.</p>
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
										{selectedResource.location}
									</span>
									<span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
										Status {selectedResource.status}
									</span>
								</div>
							) : null}
						</label>

						<label className="grid gap-1">
							<span className="text-xs font-semibold text-slate-300">Category</span>
							<select
								value={form.category}
								onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
								className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
							>
								{CATEGORIES.map((c) => (
									<option key={c} value={c}>
										{c}
									</option>
								))}
							</select>
						</label>

						<label className="grid gap-1">
							<span className="text-xs font-semibold text-slate-300">Priority</span>
							<select
								value={form.priority}
								onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
								className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
							>
								{PRIORITIES.map((p) => (
									<option key={p} value={p}>
										{p}
									</option>
								))}
							</select>
						</label>

						<label className="grid gap-1 md:col-span-2">
							<span className="text-xs font-semibold text-slate-300">Description</span>
							<textarea
								required
								rows={4}
								placeholder="Describe the issue clearly..."
								value={form.description}
								onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
								className="resize-none rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
							/>
						</label>

						<div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
							<button className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300" type="submit">
								Submit ticket
							</button>
						</div>
					</form>
				</div>

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-black text-white">Your tickets</h2>
						{loading ? <span className="text-xs text-slate-400">Loading…</span> : null}
					</div>

					<div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
						<table className="min-w-[860px] w-full text-left text-sm text-slate-200">
							<thead className="bg-slate-900/60 text-xs uppercase text-slate-400">
								<tr>
									<th className="px-4 py-3">Ticket</th>
									<th className="px-4 py-3">Resource</th>
									<th className="px-4 py-3">Category</th>
									<th className="px-4 py-3">Priority</th>
									<th className="px-4 py-3">Status</th>
									<th className="px-4 py-3 text-right">Open</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5 bg-slate-950/20">
								{tickets.length === 0 ? (
									<tr>
										<td className="px-4 py-6 text-slate-400" colSpan={6}>
											No tickets yet.
										</td>
									</tr>
								) : (
									tickets.map((t) => (
										<tr key={t.id} className="hover:bg-white/5">
											<td className="px-4 py-3">
												<div className="font-semibold text-white">#{t.id}</div>
												<div className="line-clamp-2 text-xs text-slate-400">{t.description}</div>
											</td>
											<td className="px-4 py-3">{t.resourceName}</td>
											<td className="px-4 py-3">{t.category}</td>
											<td className="px-4 py-3">{t.priority}</td>
											<td className="px-4 py-3">
												<span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold">
													{t.status}
												</span>
											</td>
											<td className="px-4 py-3 text-right">
												<Link
													to={`/tickets/${t.id}`}
													className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
												>
													Details
												</Link>
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

