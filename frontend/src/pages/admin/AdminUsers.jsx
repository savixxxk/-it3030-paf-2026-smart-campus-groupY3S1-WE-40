import { useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { users as initialUsers } from "../../data/adminMockData";

export default function AdminUsers() {
	const { isDark } = useTheme();
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("ALL");
	const [selectedUserId, setSelectedUserId] = useState(initialUsers[0].id);
	const [rows, setRows] = useState(initialUsers);

	const filteredUsers = useMemo(() => {
		return rows.filter((user) => {
			const matchesSearch = `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase());
			const matchesRole = roleFilter === "ALL" ? true : user.role === roleFilter;
			return matchesSearch && matchesRole;
		});
	}, [rows, roleFilter, search]);

	const selectedUser = rows.find((user) => user.id === selectedUserId) || filteredUsers[0] || rows[0];

	const updateRole = (userId, role) => {
		setRows((current) => current.map((user) => (user.id === userId ? { ...user, role } : user)));
	};

	const toggleStatus = (userId) => {
		setRows((current) =>
			current.map((user) =>
				user.id === userId ? { ...user, status: user.status === "Active" ? "Disabled" : "Active" } : user
			)
		);
	};

	return (
		<div className="space-y-6">
			<div className={`rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<h2 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>User Management</h2>
						<p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Search, filter, view, change role, and disable users.</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search users..."
							className={`w-full rounded-xl border px-4 py-3 outline-none sm:w-72 ${
								isDark
									? "border-white/10 bg-slate-950/80 text-white placeholder:text-slate-500 focus:ring focus:ring-cyan-300/60"
									: "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring focus:ring-cyan-300"
							}`}
						/>
						<select
							value={roleFilter}
							onChange={(event) => setRoleFilter(event.target.value)}
							className={`rounded-xl border px-4 py-3 outline-none ${
								isDark
									? "border-white/10 bg-slate-950/80 text-white focus:ring focus:ring-cyan-300/60"
									: "border-slate-300 bg-white text-slate-900 focus:ring focus:ring-cyan-300"
							}`}
						>
							<option value="ALL">All roles</option>
							<option value="USER">USER</option>
							<option value="ADMIN">ADMIN</option>
						</select>
					</div>
				</div>
			</div>

			<div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
				<div className={`overflow-hidden rounded-3xl border ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-white shadow-sm"}`}>
					<div className="overflow-x-auto">
						<table className={`min-w-full text-left text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
							<thead className={`border-b text-xs uppercase tracking-[0.18em] ${isDark ? "border-white/10 bg-white/5 text-cyan-200" : "border-slate-200 bg-slate-50 text-cyan-700"}`}>
								<tr>
									<th className="px-6 py-4">Name</th>
									<th className="px-6 py-4">Email</th>
									<th className="px-6 py-4">Role</th>
									<th className="px-6 py-4">Status</th>
									<th className="px-6 py-4">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.map((user) => (
									<tr key={user.id} className={`border-b ${isDark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-100"}`}>
										<td className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{user.name}</td>
										<td className="px-6 py-4">{user.email}</td>
										<td className="px-6 py-4">
											<span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
												isDark
													? "border-white/10 bg-slate-900 text-white"
													: "border-slate-300 bg-slate-100 text-slate-900"
											}`}>
												{user.role}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className={`rounded-full px-3 py-1 text-xs font-semibold ${
												user.status === "Active"
													? isDark
														? "bg-emerald-400/15 text-emerald-200"
														: "bg-emerald-100 text-emerald-700"
													: isDark
														? "bg-rose-400/15 text-rose-200"
														: "bg-rose-100 text-rose-700"
											}`}>
												{user.status}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-wrap gap-2">
												<button
													onClick={() => setSelectedUserId(user.id)}
													className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
														isDark
															? "border-white/10 text-white hover:bg-white/10"
															: "border-slate-300 text-slate-900 hover:bg-slate-100"
													}`}
												>
													View user
												</button>
												<button
													onClick={() => updateRole(user.id, user.role === "ADMIN" ? "USER" : "ADMIN")}
													className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-500"
												>
													Change role
												</button>
												<button
													onClick={() => toggleStatus(user.id)}
													className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
														isDark
															? "border-rose-300/30 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20"
															: "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
													}`}
												>
													Disable user
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className={`rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
					<h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Selected User</h3>
					<div className={`mt-4 space-y-3 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
						<p>
							<span className={isDark ? "text-cyan-200" : "text-cyan-700"}>Name:</span> {selectedUser?.name}
						</p>
						<p>
							<span className={isDark ? "text-cyan-200" : "text-cyan-700"}>Email:</span> {selectedUser?.email}
						</p>
						<p>
							<span className={isDark ? "text-cyan-200" : "text-cyan-700"}>Role:</span> {selectedUser?.role}
						</p>
						<p>
							<span className={isDark ? "text-cyan-200" : "text-cyan-700"}>Status:</span> {selectedUser?.status}
						</p>
					</div>
					<div className={`mt-6 rounded-2xl border p-4 text-sm ${
						isDark
							? "border-white/10 bg-slate-950/70 text-slate-300"
							: "border-slate-300 bg-slate-100 text-slate-600"
					}`}>
						<p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>User detail panel</p>
						<p className="mt-2">This panel can later be wired to real backend user records and audit logs.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
