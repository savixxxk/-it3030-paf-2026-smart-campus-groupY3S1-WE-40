import { useEffect, useMemo, useState } from "react";
import { createResource, deleteResource, listResources, updateResource } from "../../services/resourceService";

const RESOURCE_TYPES = ["LECTURE_HALL", "LAB", "MEETING_ROOM", "EQUIPMENT"];
const RESOURCE_STATUSES = ["ACTIVE", "OUT_OF_SERVICE"];

const emptyForm = {
	name: "",
	description: "",
	type: "LECTURE_HALL",
	capacity: 1,
	location: "",
	availabilityStart: "08:00",
	availabilityEnd: "18:00",
	status: "ACTIVE"
};

function normalizePayload(form) {
	return {
		name: form.name?.trim(),
		description: form.description?.trim() || null,
		type: form.type,
		capacity: Number(form.capacity),
		location: form.location?.trim(),
		availabilityStart: form.availabilityStart,
		availabilityEnd: form.availabilityEnd,
		status: form.status
	};
}

export default function AdminFacilities() {
	const [resources, setResources] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [filters, setFilters] = useState({ type: "", capacity: "", location: "" });

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [form, setForm] = useState(emptyForm);
	const [saving, setSaving] = useState(false);

	const activeFilters = useMemo(() => {
		const payload = {};
		if (filters.type) payload.type = filters.type;
		if (filters.capacity) payload.capacity = filters.capacity;
		if (filters.location) payload.location = filters.location;
		return payload;
	}, [filters]);

	const refresh = async () => {
		setLoading(true);
		setError("");
		try {
			const data = await listResources(activeFilters);
			setResources(Array.isArray(data) ? data : []);
		} catch (e) {
			setError(e?.message || "Failed to load resources");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeFilters.type, activeFilters.capacity, activeFilters.location]);

	const openCreate = () => {
		setEditing(null);
		setForm(emptyForm);
		setError("");
		setIsModalOpen(true);
	};

	const openEdit = (resource) => {
		setEditing(resource);
		setForm({
			name: resource.name || "",
			description: resource.description || "",
			type: resource.type || "LECTURE_HALL",
			capacity: resource.capacity ?? 1,
			location: resource.location || "",
			availabilityStart: resource.availabilityStart || "08:00",
			availabilityEnd: resource.availabilityEnd || "18:00",
			status: resource.status || "ACTIVE"
		});
		setError("");
		setIsModalOpen(true);
	};

	const closeModal = () => {
		if (saving) return;
		setIsModalOpen(false);
	};

	const submit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setError("");
		try {
			const payload = normalizePayload(form);
			if (editing?.id) {
				await updateResource(editing.id, payload);
			} else {
				await createResource(payload);
			}
			setIsModalOpen(false);
			await refresh();
		} catch (err) {
			setError(err?.message || "Save failed");
		} finally {
			setSaving(false);
		}
	};

	const remove = async (resource) => {
		const ok = window.confirm(`Delete "${resource.name}"?`);
		if (!ok) return;
		setError("");
		try {
			await deleteResource(resource.id);
			await refresh();
		} catch (err) {
			setError(err?.message || "Delete failed");
		}
	};

	return (
		<section className="space-y-6">
			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-2xl font-black text-white">Facilities</h2>
						<p className="mt-2 text-sm text-slate-300">Manage campus facilities and resources.</p>
					</div>
					<button
						onClick={openCreate}
						className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300"
					>
						Add resource
					</button>
				</div>

				{error ? <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

				<div className="mt-6 grid gap-3 md:grid-cols-3">
					<select
						value={filters.type}
						onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
						className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
					>
						<option value="">All types</option>
						{RESOURCE_TYPES.map((t) => (
							<option key={t} value={t}>
								{t.replaceAll("_", " ")}
							</option>
						))}
					</select>
					<input
						type="number"
						min="1"
						placeholder="Min capacity"
						value={filters.capacity}
						onChange={(e) => setFilters((p) => ({ ...p, capacity: e.target.value }))}
						className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
					/>
					<input
						placeholder="Location contains..."
						value={filters.location}
						onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
						className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
					/>
				</div>

				<div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
					<table className="w-full text-left text-sm text-slate-200">
						<thead className="bg-slate-900/60 text-xs uppercase text-slate-400">
							<tr>
								<th className="px-4 py-3">Name</th>
								<th className="px-4 py-3">Type</th>
								<th className="px-4 py-3">Capacity</th>
								<th className="px-4 py-3">Location</th>
								<th className="px-4 py-3">Availability</th>
								<th className="px-4 py-3">Status</th>
								<th className="px-4 py-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-white/5 bg-slate-950/20">
							{loading ? (
								<tr>
									<td className="px-4 py-6 text-slate-400" colSpan={7}>
										Loading...
									</td>
								</tr>
							) : resources.length === 0 ? (
								<tr>
									<td className="px-4 py-6 text-slate-400" colSpan={7}>
										No resources found.
									</td>
								</tr>
							) : (
								resources.map((r) => (
									<tr key={r.id} className="hover:bg-white/5">
										<td className="px-4 py-3">
											<div className="font-semibold text-white">{r.name}</div>
											{r.description ? <div className="text-xs text-slate-400">{r.description}</div> : null}
										</td>
										<td className="px-4 py-3">{(r.type || "").replaceAll("_", " ")}</td>
										<td className="px-4 py-3">{r.capacity}</td>
										<td className="px-4 py-3">{r.location}</td>
										<td className="px-4 py-3">
											{r.availabilityStart} - {r.availabilityEnd}
										</td>
										<td className="px-4 py-3">
											<span
												className={[
													"inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
													r.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-200" : "bg-amber-500/15 text-amber-200"
												].join(" ")}
											>
												{r.status?.replaceAll("_", " ")}
											</span>
										</td>
										<td className="px-4 py-3 text-right">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => openEdit(r)}
													className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
												>
													Edit
												</button>
												<button
													onClick={() => remove(r)}
													className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/20"
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{isModalOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
					<div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-xl">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h3 className="text-lg font-black text-white">{editing ? "Edit resource" : "Add resource"}</h3>
								<p className="mt-1 text-sm text-slate-400">Fill all required fields. Availability start must be before end.</p>
							</div>
							<button
								onClick={closeModal}
								className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
							>
								Close
							</button>
						</div>

						<form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-2">
							<label className="grid gap-1">
								<span className="text-xs font-semibold text-slate-300">Name</span>
								<input
									required
									value={form.name}
									onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
									className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
								/>
							</label>
							<label className="grid gap-1">
								<span className="text-xs font-semibold text-slate-300">Type</span>
								<select
									value={form.type}
									onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
									className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
								>
									{RESOURCE_TYPES.map((t) => (
										<option key={t} value={t}>
											{t.replaceAll("_", " ")}
										</option>
									))}
								</select>
							</label>
							<label className="grid gap-1">
								<span className="text-xs font-semibold text-slate-300">Capacity</span>
								<input
									type="number"
									min="1"
									required
									value={form.capacity}
									onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
									className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
								/>
							</label>
							<label className="grid gap-1">
								<span className="text-xs font-semibold text-slate-300">Location</span>
								<input
									required
									value={form.location}
									onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
									className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
								/>
							</label>
							<label className="grid gap-1 md:col-span-2">
								<span className="text-xs font-semibold text-slate-300">Description</span>
								<input
									value={form.description}
									onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
									className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
								/>
							</label>
							<label className="grid gap-1">
								<span className="text-xs font-semibold text-slate-300">Availability start</span>
								<input
									type="time"
									required
									value={form.availabilityStart}
									onChange={(e) => setForm((p) => ({ ...p, availabilityStart: e.target.value }))}
									className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
								/>
							</label>
							<label className="grid gap-1">
								<span className="text-xs font-semibold text-slate-300">Availability end</span>
								<input
									type="time"
									required
									value={form.availabilityEnd}
									onChange={(e) => setForm((p) => ({ ...p, availabilityEnd: e.target.value }))}
									className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
								/>
							</label>
							<label className="grid gap-1">
								<span className="text-xs font-semibold text-slate-300">Status</span>
								<select
									value={form.status}
									onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
									className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white"
								>
									{RESOURCE_STATUSES.map((s) => (
										<option key={s} value={s}>
											{s.replaceAll("_", " ")}
										</option>
									))}
								</select>
							</label>

							<div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
								<button
									type="button"
									onClick={closeModal}
									className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
								>
									Cancel
								</button>
								<button
									disabled={saving}
									type="submit"
									className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
								>
									{saving ? "Saving..." : "Save"}
								</button>
							</div>
						</form>
					</div>
				</div>
			) : null}
		</section>
	);
}
