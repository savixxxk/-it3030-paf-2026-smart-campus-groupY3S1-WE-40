import { Link } from "react-router-dom";
import campusHero from "../assets/campus-real.jpg";
import { useAuth } from "../context/AuthContext";

export default function Home() {
	const { user, isAuthenticated } = useAuth();
	const displayName = user?.fullName || user?.name || user?.email?.split("@")[0] || "Student";

	return (
		<main className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-slate-950 text-slate-100">
			<div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl floating-blob" />
			<div className="pointer-events-none absolute -right-20 bottom-12 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl floating-blob floating-blob-delay" />

			<section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center lg:py-20">
				<div className="fade-up">
					{isAuthenticated ? (
						<p className="inline-flex items-center rounded-full border border-emerald-300/40 bg-emerald-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
							Welcome, {displayName}
						</p>
					) : null}

					<p className="inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
						Future-ready campus platform
					</p>

					<h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
						Modern Campus Experience,
						<span className="block text-cyan-300">Built for Real Student Life</span>
					</h1>

					<p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200/90">
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
								<p className="rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-6 py-3 text-sm font-semibold text-emerald-100">
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
									className="rounded-xl border border-slate-500/70 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-300/60"
								>
									Login Now
								</Link>
							</>
						)}
					</div>

					<div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
						<div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur soft-card">
							<p className="text-2xl font-extrabold text-cyan-200">24/7</p>
							<p className="mt-1 text-xs uppercase tracking-wider text-slate-300">Access</p>
						</div>
						<div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur soft-card">
							<p className="text-2xl font-extrabold text-cyan-200">10k+</p>
							<p className="mt-1 text-xs uppercase tracking-wider text-slate-300">Students</p>
						</div>
						<div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur soft-card">
							<p className="text-2xl font-extrabold text-cyan-200">99.9%</p>
							<p className="mt-1 text-xs uppercase tracking-wider text-slate-300">Uptime</p>
						</div>
					</div>
				</div>

				<div className="relative fade-up-delay">
					<div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-cyan-400/20 via-emerald-400/10 to-sky-500/20 blur-2xl" />
					<div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-slate-900/60 p-3 shadow-[0_30px_80px_-30px_rgba(34,211,238,0.55)] backdrop-blur">
						<img
							src={campusHero}
							alt="Students studying together in a modern campus library"
							className="h-[420px] w-full rounded-[1.35rem] object-cover transition duration-700 hover:scale-[1.03]"
						/>
						<div className="absolute bottom-8 left-8 rounded-xl border border-white/30 bg-slate-950/65 px-4 py-3 text-sm text-slate-100 backdrop-blur">
							<p className="font-semibold">Live Campus Feed</p>
							<p className="text-slate-300">Events, classes, and alerts in one place</p>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 pb-8 pt-4 md:pb-12">
				<div className="grid gap-4 md:grid-cols-3">
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur soft-card">
						<p className="text-sm uppercase tracking-wider text-cyan-200">Smart Alerts</p>
						<h3 className="mt-2 text-xl font-bold text-white">Never Miss a Campus Update</h3>
						<p className="mt-2 text-sm text-slate-300">Get event reminders, class notices, and emergency notifications in one stream.</p>
					</div>
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur soft-card">
						<p className="text-sm uppercase tracking-wider text-cyan-200">Unified Access</p>
						<h3 className="mt-2 text-xl font-bold text-white">One Login for Everything</h3>
						<p className="mt-2 text-sm text-slate-300">Move between academic services, schedules, and profile tools without friction.</p>
					</div>
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur soft-card">
						<p className="text-sm uppercase tracking-wider text-cyan-200">Fast UI</p>
						<h3 className="mt-2 text-xl font-bold text-white">Designed for Daily Use</h3>
						<p className="mt-2 text-sm text-slate-300">A clean, high-contrast interface that feels smooth on both mobile and desktop.</p>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 pb-16 pt-6 md:pb-24">
				<div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-8 shadow-[0_30px_80px_-35px_rgba(34,211,238,0.55)] md:p-12">
					<p className="text-sm uppercase tracking-[0.22em] text-cyan-200">Student Voice</p>
					<blockquote className="mt-4 max-w-3xl text-2xl font-semibold leading-relaxed text-white md:text-3xl">
						"Smart Campus made our daily routine easier. Updates are faster, and everything we need is now in one place."
					</blockquote>
					<div className="mt-8 flex flex-wrap items-center justify-between gap-4">
						<p className="text-sm text-slate-300">Aarav S. · Final Year Computer Science</p>
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
