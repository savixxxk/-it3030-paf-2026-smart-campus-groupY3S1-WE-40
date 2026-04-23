import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const navLinkClass = ({ isActive }) =>
	`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
		isActive
			? "bg-cyan-100 text-cyan-900 border border-cyan-200 dark:bg-cyan-600 dark:text-white dark:border-cyan-500"
			: "text-slate-700 border border-transparent hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
	}`;

export default function AdminLayout() {
	const { user } = useAuth();
	const { isDark } = useTheme();

	return (
		<main className={`relative min-h-[calc(100vh-73px)] overflow-hidden ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
			{isDark && (
				<>
					<div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl floating-blob" />
					<div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl floating-blob floating-blob-delay" />
				</>
			)}

			<section className={`relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8`}>
				<div className={`mb-6 rounded-3xl border p-6 ${
					isDark
						? "border-white/10 bg-white/5 backdrop-blur"
						: "border-slate-200 bg-white shadow-sm"
				}`}>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
								isDark
									? "border border-cyan-300/35 bg-cyan-300/10 text-cyan-100"
									: "bg-cyan-50 text-cyan-700"
							}`}>
								Admin Dashboard
							</p>
							<h1 className={`mt-3 text-3xl font-black md:text-4xl ${isDark ? "text-white" : "text-slate-900"}`}>
								Smart Campus Admin
							</h1>
							<p className={`mt-2 max-w-2xl text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
								Manage users and campus notifications from one dashboard.
							</p>
						</div>
						<div className={`rounded-2xl border px-4 py-3 text-right ${
							isDark
								? "border-white/10 bg-slate-900/70"
								: "border-slate-200 bg-slate-50"
						}`}>
							<p className={`text-xs uppercase tracking-[0.2em] ${isDark ? "text-cyan-200" : "text-slate-500"}`}>Signed in as</p>
							<p className={`mt-1 text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
								{user?.fullName || user?.name || "Admin"}
							</p>
							<p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{user?.email}</p>
						</div>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-[260px_1fr]">
					<aside className={`rounded-3xl border p-4 ${
						isDark
							? "border-white/10 bg-white/5 backdrop-blur"
							: "border-slate-200 bg-white shadow-sm"
					}`}>
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

					<div className={`min-w-0 rounded-3xl border p-4 sm:p-6 ${
						isDark
							? "border-white/10 bg-white/5 backdrop-blur"
							: "border-slate-200 bg-white shadow-sm"
					}`}>
						<Outlet />
					</div>
				</div>
			</section>
		</main>
	);
}
