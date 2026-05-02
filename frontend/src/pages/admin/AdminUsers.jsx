import { useEffect, useMemo, useState } from "react";
import { getAllUsers, blockUser, unblockUser } from "../../services/userService";

function downloadCsv(filename, rows) {
	const escapeCsv = (value) => {
		const text = value == null ? "" : String(value);
		return `"${text.replaceAll('"', '""')}"`;
	};

	const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}

export default function AdminUsers() {
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("ALL");
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadUsers = async () => {
			try {
				setLoading(true);
				setError("");
				const data = await getAllUsers();
				const normalized = data.map((user, index) => ({
					id: user.id ?? index + 1,
					name: user.fullName || user.name || "Unknown User",
					email: user.email,
					role: user.role || "USER",
					blocked: !!user.blocked,
					status: user.blocked ? "Blocked" : "Active",
					createdAt: user.createdAt || null
				}));
				setRows(normalized);
				setSelectedUserId((current) => current ?? normalized[0]?.id ?? null);
			} catch (loadError) {
				setError(loadError.message || "Failed to load users");
			} finally {
				setLoading(false);
			}
		};

		loadUsers();
	}, []);

	const filteredUsers = useMemo(() => {
		return rows.filter((user) => {
			const matchesSearch = `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase());
			const matchesRole = roleFilter === "ALL" ? true : user.role === roleFilter;
			return matchesSearch && matchesRole;
		});
	}, [rows, roleFilter, search]);

	const selectedUser = rows.find((user) => user.id === selectedUserId) || filteredUsers[0] || rows[0];

	const exportReport = () => {
		downloadCsv("smart-campus-users-report.csv", [
			["Name", "Email", "Role", "Status", "Joined"],
			...filteredUsers.map((user) => [
				user.name,
				user.email,
				user.role,
				user.status,
				user.createdAt ? new Date(user.createdAt).toLocaleString() : ""
			])
		]);
	};

	return (
		<div className="space-y-6">
			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<h2 className="text-2xl font-black text-white">User Management</h2>
						<p className="mt-2 text-sm text-slate-300">Search and review registered campus users from the live database.</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<button
							type="button"
							onClick={exportReport}
							disabled={!filteredUsers.length}
							className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Download Report
						</button>
						<input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search users..."
							className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-cyan-300/60 placeholder:text-slate-500 focus:ring sm:w-72"
						/>
						<select
							value={roleFilter}
							onChange={(event) => setRoleFilter(event.target.value)}
							className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-cyan-300/60 focus:ring"
						>
							<option value="ALL">All roles</option>
							<option value="USER">USER</option>
							<option value="ADMIN">ADMIN</option>
						</select>
					</div>
				</div>
			</div>

			<div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
				<div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
					<div className="overflow-x-auto">
						<table className="min-w-full text-left text-sm text-slate-300">
							<thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.18em] text-cyan-200">
								<tr>
									<th className="px-6 py-4">Name</th>
									<th className="px-6 py-4">Email</th>
									<th className="px-6 py-4">Role</th>
									<th className="px-6 py-4">Joined</th>
									<th className="px-6 py-4">Status</th>
									<th className="px-6 py-4">Actions</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td className="px-6 py-8 text-sm text-slate-300" colSpan={6}>
											Loading users...
										</td>
									</tr>
								) : error ? (
									<tr>
										<td className="px-6 py-8 text-sm text-rose-300" colSpan={6}>
											{error}
										</td>
									</tr>
								) : filteredUsers.length === 0 ? (
									<tr>
										<td className="px-6 py-8 text-sm text-slate-300" colSpan={6}>
											No users match your search.
										</td>
									</tr>
								) : (
									filteredUsers.map((user) => (
										<tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
										<td className="px-6 py-4 font-semibold text-white">{user.name}</td>
										<td className="px-6 py-4">{user.email}</td>
										<td className="px-6 py-4">
											<span className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
												{user.role}
											</span>
										</td>
										<td className="px-6 py-4 text-slate-300">
											{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "--"}
										</td>
										<td className="px-6 py-4">
											<span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.blocked ? "bg-rose-400/15 text-rose-200" : "bg-emerald-400/15 text-emerald-200"}`}>
												{user.status}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-wrap gap-2">
												<button type="button" onClick={() => setSelectedUserId(user.id)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10">
													View user
												</button>
												{user.blocked ? (
													<button
														type="button"
														onClick={async () => {
														try {
															await unblockUser(user.id);
															setRows((prev) => prev.map((r) => (r.id === user.id ? { ...r, blocked: false, status: "Active" } : r)));
														} catch (err) {
															console.error(err);
														}
													}}
														className="rounded-lg border border-white/10 bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
													>
														Unblock
													</button>
												) : (
													<button
														type="button"
														onClick={async () => {
														try {
															await blockUser(user.id);
															setRows((prev) => prev.map((r) => (r.id === user.id ? { ...r, blocked: true, status: "Blocked" } : r)));
														} catch (err) {
															console.error(err);
														}
													}}
														className="rounded-lg border border-white/10 bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
													>
														Block
													</button>
												)}
											</div>
										</td>
										</tr>
									)))}
							</tbody>
						</table>
					</div>
				</div>

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<h3 className="text-lg font-bold text-white">Selected User</h3>
					<div className="mt-4 space-y-3 text-sm text-slate-300">
						<p><span className="text-cyan-200">Name:</span> {selectedUser?.name}</p>
						<p><span className="text-cyan-200">Email:</span> {selectedUser?.email}</p>
						<p><span className="text-cyan-200">Role:</span> {selectedUser?.role}</p>
						<p><span className="text-cyan-200">Status:</span> {selectedUser?.status}</p>
						<p><span className="text-cyan-200">Joined:</span> {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "--"}</p>
					</div>
					<div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
						<p className="font-semibold text-white">User detail panel</p>
						<p className="mt-2">This panel now reflects live registered users from the backend.</p>
					</div>
					<div className="mt-4 flex gap-3">
						{selectedUser && (selectedUser.blocked ? (
							<button
								type="button"
								className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
								onClick={async () => {
									try {
										await unblockUser(selectedUser.id);
										setRows((prev) => prev.map((r) => (r.id === selectedUser.id ? { ...r, blocked: false, status: "Active" } : r)));
									} catch (err) {
										console.error(err);
									}
								}}
							>
								Unblock user
							</button>
						) : (
							<button
								type="button"
								className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white"
								onClick={async () => {
									try {
										await blockUser(selectedUser.id);
										setRows((prev) => prev.map((r) => (r.id === selectedUser.id ? { ...r, blocked: true, status: "Blocked" } : r)));
									} catch (err) {
										console.error(err);
									}
								}}
							>
								Block user
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
