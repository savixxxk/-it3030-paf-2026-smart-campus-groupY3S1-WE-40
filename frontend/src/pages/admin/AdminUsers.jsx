import { useMemo, useState } from "react";
import { users as initialUsers } from "../../data/adminMockData";

export default function AdminUsers() {
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
			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<h2 className="text-2xl font-black text-white">User Management</h2>
						<p className="mt-2 text-sm text-slate-300">Search, filter, view, change role, and disable users.</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row">
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
									<th className="px-6 py-4">Status</th>
									<th className="px-6 py-4">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.map((user) => (
									<tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
										<td className="px-6 py-4 font-semibold text-white">{user.name}</td>
										<td className="px-6 py-4">{user.email}</td>
										<td className="px-6 py-4">
											<span className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
												{user.role}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.status === "Active" ? "bg-emerald-400/15 text-emerald-200" : "bg-rose-400/15 text-rose-200"}`}>
												{user.status}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-wrap gap-2">
												<button onClick={() => setSelectedUserId(user.id)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10">
													View user
												</button>
												<button onClick={() => updateRole(user.id, user.role === "ADMIN" ? "USER" : "ADMIN")} className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-300">
													Change role
												</button>
												<button onClick={() => toggleStatus(user.id)} className="rounded-lg border border-rose-300/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-100 hover:bg-rose-400/20">
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

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<h3 className="text-lg font-bold text-white">Selected User</h3>
					<div className="mt-4 space-y-3 text-sm text-slate-300">
						<p><span className="text-cyan-200">Name:</span> {selectedUser?.name}</p>
						<p><span className="text-cyan-200">Email:</span> {selectedUser?.email}</p>
						<p><span className="text-cyan-200">Role:</span> {selectedUser?.role}</p>
						<p><span className="text-cyan-200">Status:</span> {selectedUser?.status}</p>
					</div>
					<div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
						<p className="font-semibold text-white">User detail panel</p>
						<p className="mt-2">This panel can later be wired to real backend user records and audit logs.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
