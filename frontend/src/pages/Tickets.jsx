import { useTheme } from "../context/ThemeContext";

export default function Tickets() {
	const { isDark } = useTheme();

	return (
		<main className={`min-h-[calc(100vh-73px)] px-6 py-12 ${isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>
			<section className={`mx-auto max-w-4xl rounded-3xl border p-8 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
				<p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? "bg-cyan-300/10 text-cyan-100 border border-cyan-300/30" : "bg-cyan-50 text-cyan-700"}`}>
					Tickets
				</p>
				<h1 className={`mt-4 text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Support Tickets</h1>
				<p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
					Track campus help requests, service issues, and follow-ups.
				</p>
				<div className={`mt-8 rounded-2xl border p-5 ${isDark ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-white"}`}>
					<p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Support center</p>
					<p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Use this area for ticket submission and status tracking once the ticket workflow is wired in.</p>
				</div>
			</section>
		</main>
	);
}