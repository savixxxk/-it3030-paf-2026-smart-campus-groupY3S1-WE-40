import { useEffect, useState } from "react";
import { getAnalyticsDashboard } from "../../services/analyticsService";

export default function AdminOverview() {
	const [analytics, setAnalytics] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const accentTextClass = {
		amber: "text-amber-200",
		rose: "text-rose-200",
		cyan: "text-cyan-200"
	};

	useEffect(() => {
		const loadAnalytics = async () => {
			setLoading(true);
			setError("");
			try {
				const data = await getAnalyticsDashboard();
				setAnalytics(data);
			} catch (loadError) {
				setError(loadError.message || "Failed to load admin overview");
			} finally {
				setLoading(false);
			}
		};

		loadAnalytics();
	}, []);

	const cards = [
		{ label: "Pending Bookings", value: analytics?.pendingBookings || 0, note: "Requests awaiting admin review", accent: "amber" },
		{ label: "Open Tickets", value: analytics?.openTickets || 0, note: "Issues that still need attention", accent: "rose" },
		{ label: "Total Bookings", value: analytics?.totalBookings || 0, note: "All booking records", accent: "cyan" }
	];

	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{cards.map((item) => (
					<div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
						<p className="text-sm text-slate-300">{item.label}</p>
						<p className={`mt-2 text-3xl font-black ${accentTextClass[item.accent] || "text-white"}`}>
							{loading ? "..." : item.value}
						</p>
						<p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-200">{item.note}</p>
					</div>
				))}
			</div>

			{error ? <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</div> : null}

			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<h3 className="text-lg font-bold text-white">Admin Workflow</h3>
				<div className="mt-5 space-y-4 text-sm text-slate-300">
					<p>• Review pending bookings first so requests do not stall.</p>
					<p>• Check open tickets daily to keep support moving.</p>
					<p>• Use the Notifications tab to publish campus notices and reminders.</p>
				</div>
			</div>
		</div>
	);
}
