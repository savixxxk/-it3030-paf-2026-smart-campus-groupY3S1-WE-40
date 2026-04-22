import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinkClass = ({ isActive }) =>
	`rounded-xl px-4 py-3 text-sm font-semibold transition ${
		isActive ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20" : "text-slate-300 hover:bg-white/5 hover:text-white"
	}`;

export default function AdminLayout() {
	const { user } = useAuth();

	return (
		<main className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-slate-950 text-slate-100">
			<div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl floating-blob" />
			<div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl floating-blob floating-blob-delay" />

			<section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<p className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
								Admin Control Center
							</p>
							<h1 className="mt-3 text-3xl font-black text-white md:text-4xl">Smart Campus Admin</h1>
							<p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
								Manage users and campus notifications from one modern dashboard.
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-right">
							<p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Signed in as</p>
							<p className="mt-1 text-lg font-bold text-white">{user?.fullName || user?.name || "Admin"}</p>
							<p className="text-sm text-slate-300">{user?.email}</p>
						</div>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-[260px_1fr]">
					<aside className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
						<nav className="flex flex-col gap-2">
							<NavLink to="/admin-dashboard" end className={navLinkClass}>
								Overview
							</NavLink>
							<NavLink to="/admin-dashboard/analytics" className={navLinkClass}>
								Analytics
							</NavLink>
							<NavLink to="/admin-dashboard/users" className={navLinkClass}>
								Users
							</NavLink>
							<NavLink to="/admin-dashboard/notifications" className={navLinkClass}>
								Notifications
							</NavLink>
							<NavLink to="/admin-dashboard/bookings" className={navLinkClass}>
								Bookings
							</NavLink>
							<NavLink to="/admin-dashboard/facilities" className={navLinkClass}>
								Facilities
							</NavLink>
							<NavLink to="/admin-dashboard/tickets" className={navLinkClass}>
								Tickets
							</NavLink>
						</nav>
					</aside>

					<div className="min-w-0">
						<Outlet />
					</div>
				</div>
			</section>
		</main>
	);
}
