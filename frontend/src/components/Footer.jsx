import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-slate-200">
			<div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
			<div className="pointer-events-none absolute -right-16 bottom-0 h-44 w-44 rounded-full bg-emerald-400/15 blur-3xl" />

			<div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
				<div>
					<h3 className="text-lg font-bold text-white">Smart Campus</h3>
					<p className="mt-2 max-w-sm text-sm text-slate-300">
						A connected experience for students, staff, and campus services with secure and simple access.
					</p>
				</div>

				<div>
					<p className="text-sm font-semibold uppercase tracking-wider text-cyan-200">Quick Links</p>
					<div className="mt-3 flex flex-col gap-2 text-sm">
						<Link to="/" className="text-slate-300 transition hover:text-cyan-200">
							Home
						</Link>
						<Link to="/login" className="text-slate-300 transition hover:text-cyan-200">
							Login
						</Link>
						<Link to="/signup" className="text-slate-300 transition hover:text-cyan-200">
							Sign Up
						</Link>
					</div>
				</div>

				<div>
					<p className="text-sm font-semibold uppercase tracking-wider text-cyan-200">Contact</p>
					<p className="mt-3 text-sm text-slate-300">support@smartcampus.local</p>
					<p className="text-sm text-slate-300">+91 99999 99999</p>
				</div>
			</div>

			<div className="relative border-t border-white/10 px-6 py-4 text-center text-xs text-slate-400">
				© {new Date().getFullYear()} Smart Campus. All rights reserved.
			</div>
		</footer>
	);
}