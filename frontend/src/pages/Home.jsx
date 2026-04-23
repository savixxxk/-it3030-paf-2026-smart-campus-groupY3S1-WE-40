import { Link } from "react-router-dom";
import campusHero from "../assets/campus-real.jpg";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
	const { user, isAuthenticated } = useAuth();
	const { isDark } = useTheme();
	const displayName = user?.fullName || user?.name || user?.email?.split("@")[0] || "Student";

	return (
		<main className={`relative min-h-[calc(100vh-73px)] overflow-hidden ${isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>
			{isDark && (
				<>
					<div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl floating-blob" />
					<div className="pointer-events-none absolute -right-20 bottom-12 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl floating-blob floating-blob-delay" />
				</>
			)}

			<section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center lg:py-20">
				<div className="fade-up">
					{isAuthenticated ? (
						<p className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
							isDark
								? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100"
								: "border-emerald-300 bg-emerald-50 text-emerald-700"
						}`}>
							Welcome, {displayName}
						</p>
					) : null}

					<p className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
						isDark
							? "border-cyan-300/35 bg-cyan-300/10 text-cyan-100"
							: "border-cyan-300 bg-cyan-50 text-cyan-700"
					}`}>
						Future-ready campus platform
					</p>

					<h1 className={`mt-5 text-4xl font-black leading-tight md:text-5xl lg:text-6xl ${
						isDark ? "text-white" : "text-slate-900"
					}`}>
						Modern Campus Experience,
						<span className={`block ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>
							Built for Real Student Life
						</span>
					</h1>

					<p className={`mt-5 max-w-xl text-lg leading-relaxed ${
						isDark ? "text-slate-200/90" : "text-slate-700"
					}`}>
						Smart Campus connects alerts, student tools, and secure access into one interactive space that feels fast on every device.
					</p>

					<div className="mt-8 flex flex-wrap gap-3">
						{isAuthenticated ? (
							user?.role === "ADMIN" ? (
								<Link
									to="/admin-dashboard"
									className="group rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
								>
									Go to Admin Dashboard
									<span className="ml-2 inline-block transition group-hover:translate-x-1">→</span>
								</Link>
							) : (
								<p className={`rounded-xl border px-6 py-3 text-sm font-semibold ${
									isDark
										? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
										: "border-emerald-300 bg-emerald-50 text-emerald-700"
								}`}>
									You are logged in. Explore your campus updates below.
								</p>
							)
						) : (
							<>
								<Link
									to="/signup"
									className="group rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
								>
									Create Account
									<span className="ml-2 inline-block transition group-hover:translate-x-1">→</span>
								</Link>
								<Link
									to="/login"
									className={`rounded-xl border px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
										isDark
											? "border-slate-500/70 bg-slate-900/60 text-white hover:border-cyan-300/60"
											: "border-slate-300 bg-slate-100 text-slate-900 hover:border-cyan-300"
									}`}
								>
									Login Now
								</Link>
							</>
						)}
					</div>

					<div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
						<div className={`rounded-xl border p-4 backdrop-blur soft-card ${
							isDark
								? "border-white/10 bg-white/5"
								: "border-slate-200 bg-slate-50"
						}`}>
							<p className={`text-2xl font-extrabold ${isDark ? "text-cyan-200" : "text-cyan-600"}`}>24/7</p>
							<p className={`mt-1 text-xs uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-600"}`}>
								Access
							</p>
						</div>
						<div className={`rounded-xl border p-4 backdrop-blur soft-card ${
							isDark
								? "border-white/10 bg-white/5"
								: "border-slate-200 bg-slate-50"
						}`}>
							<p className={`text-2xl font-extrabold ${isDark ? "text-cyan-200" : "text-cyan-600"}`}>10k+</p>
							<p className={`mt-1 text-xs uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-600"}`}>
								Students
							</p>
						</div>
						<div className={`rounded-xl border p-4 backdrop-blur soft-card ${
							isDark
								? "border-white/10 bg-white/5"
								: "border-slate-200 bg-slate-50"
						}`}>
							<p className={`text-2xl font-extrabold ${isDark ? "text-cyan-200" : "text-cyan-600"}`}>99.9%</p>
							<p className={`mt-1 text-xs uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-600"}`}>
								Uptime
							</p>
						</div>
					</div>
				</div>

				<div className="relative fade-up-delay">
					<div className={`absolute -inset-4 rounded-[2rem] bg-gradient-to-tr blur-2xl ${
						isDark
							? "from-cyan-400/20 via-emerald-400/10 to-sky-500/20"
							: "from-cyan-200/20 via-emerald-200/10 to-sky-300/20"
					}`} />
					<div className={`relative overflow-hidden rounded-[2rem] border p-3 shadow-[0_30px_80px_-30px_rgba(34,211,238,0.55)] backdrop-blur ${
						isDark
							? "border-white/20 bg-slate-900/60"
							: "border-slate-300 bg-slate-50"
					}`}>
						<img
							src={campusHero}
							alt="Students studying together in a modern campus library"
							className="h-[420px] w-full rounded-[1.35rem] object-cover transition duration-700 hover:scale-[1.03]"
						/>
						<div className={`absolute bottom-8 left-8 rounded-xl border px-4 py-3 text-sm backdrop-blur ${
							isDark
								? "border-white/30 bg-slate-950/65 text-slate-100"
								: "border-slate-300 bg-white/80 text-slate-900"
						}`}>
							<p className="font-semibold">Live Campus Feed</p>
							<p className={isDark ? "text-slate-300" : "text-slate-600"}>Events, classes, and alerts in one place</p>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 pb-8 pt-4 md:pb-12">
				<div className="grid gap-4 md:grid-cols-3">
					<div className={`rounded-2xl border p-6 soft-card backdrop-blur ${
						isDark
							? "border-white/10 bg-white/5"
							: "border-slate-200 bg-slate-50"
					}`}>
						<p className={`text-sm uppercase tracking-wider ${isDark ? "text-cyan-200" : "text-cyan-700"}`}>Smart Alerts</p>
						<h3 className={`mt-2 text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
							Never Miss a Campus Update
						</h3>
						<p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
							Get event reminders, class notices, and emergency notifications in one stream.
						</p>
					</div>
					<div className={`rounded-2xl border p-6 soft-card backdrop-blur ${
						isDark
							? "border-white/10 bg-white/5"
							: "border-slate-200 bg-slate-50"
					}`}>
						<p className={`text-sm uppercase tracking-wider ${isDark ? "text-cyan-200" : "text-cyan-700"}`}>Unified Access</p>
						<h3 className={`mt-2 text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
							One Login for Everything
						</h3>
						<p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
							Move between academic services, schedules, and profile tools without friction.
						</p>
					</div>
					<div className={`rounded-2xl border p-6 soft-card backdrop-blur ${
						isDark
							? "border-white/10 bg-white/5"
							: "border-slate-200 bg-slate-50"
					}`}>
						<p className={`text-sm uppercase tracking-wider ${isDark ? "text-cyan-200" : "text-cyan-700"}`}>Fast UI</p>
						<h3 className={`mt-2 text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
							Designed for Daily Use
						</h3>
						<p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
							A clean, high-contrast interface that feels smooth on both mobile and desktop.
						</p>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 pb-16 pt-6 md:pb-24">
				<div className={`rounded-3xl border p-8 shadow-[0_30px_80px_-35px_rgba(34,211,238,0.55)] md:p-12 ${
					isDark
						? "border-cyan-300/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30"
						: "border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-slate-50"
				}`}>
					<p className={`text-sm uppercase tracking-[0.22em] ${isDark ? "text-cyan-200" : "text-cyan-700"}`}>
						Student Voice
					</p>
					<blockquote className={`mt-4 max-w-3xl text-2xl font-semibold leading-relaxed md:text-3xl ${
						isDark ? "text-white" : "text-slate-900"
					}`}>
						"Smart Campus made our daily routine easier. Updates are faster, and everything we need is now in one place."
					</blockquote>
					<div className="mt-8 flex flex-wrap items-center justify-between gap-4">
						<p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
							Aarav S. · Final Year Computer Science
						</p>
						<Link
							to="/signup"
							className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
						>
							Join Smart Campus
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
