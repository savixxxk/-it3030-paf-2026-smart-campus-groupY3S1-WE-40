import { useTheme } from "../context/ThemeContext";

export default function Facilities() {
	const { isDark } = useTheme();

	return (
		<main className={`min-h-[calc(100vh-73px)] px-6 py-12 ${isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>
			<section className={`mx-auto max-w-4xl rounded-3xl border p-8 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
				<p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? "bg-cyan-300/10 text-cyan-100 border border-cyan-300/30" : "bg-cyan-50 text-cyan-700"}`}>
					Facilities
				</p>
				<h1 className={`mt-4 text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Campus Facilities</h1>
				<p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
					Browse labs, library spaces, study rooms, and shared resources from one place.
				</p>
				<div className="mt-8 grid gap-4 md:grid-cols-3">
					{["Library", "Labs", "Study Rooms"].map((item) => (
						<div key={item} className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-white"}`}>
							<h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{item}</h2>
							<p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Availability, booking, and usage details will connect to live campus data.</p>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}