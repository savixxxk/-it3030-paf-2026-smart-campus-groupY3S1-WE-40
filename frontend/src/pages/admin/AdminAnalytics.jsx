import { useEffect, useState } from "react";
import { getAnalyticsDashboard } from "../../services/analyticsService";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";

export default function AdminAnalytics() {
	const [analytics, setAnalytics] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		loadAnalytics();
	}, []);

	const loadAnalytics = async () => {
		setLoading(true);
		setError("");

		try {
			const data = await getAnalyticsDashboard();
			setAnalytics(data);
		} catch (loadError) {
			setError(loadError.message || "Failed to load analytics");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<section className="space-y-6">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<p className="text-sm text-slate-300">Loading analytics...</p>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="space-y-6">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<p className="text-sm font-semibold text-rose-300">{error}</p>
				</div>
			</section>
		);
	}

	const statusData = [
		{ name: "Approved", value: analytics?.approvedBookings || 0, color: "#06b6d4" },
		{ name: "Pending", value: analytics?.pendingBookings || 0, color: "#f59e0b" },
	];

	const COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

	return (
		<section className="space-y-6">
			{/* Key Metrics */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-6 backdrop-blur">
					<p className="text-sm uppercase tracking-[0.2em] text-slate-400">Total Bookings</p>
					<p className="mt-2 text-3xl font-black text-cyan-200">{analytics?.totalBookings || 0}</p>
				</div>
				<div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 backdrop-blur">
					<p className="text-sm uppercase tracking-[0.2em] text-slate-400">Approved</p>
					<p className="mt-2 text-3xl font-black text-emerald-200">{analytics?.approvedBookings || 0}</p>
				</div>
				<div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-transparent p-6 backdrop-blur">
					<p className="text-sm uppercase tracking-[0.2em] text-slate-400">Pending</p>
					<p className="mt-2 text-3xl font-black text-amber-200">{analytics?.pendingBookings || 0}</p>
				</div>
				<div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent p-6 backdrop-blur">
					<p className="text-sm uppercase tracking-[0.2em] text-slate-400">Total Resources</p>
					<p className="mt-2 text-3xl font-black text-purple-200">{analytics?.totalResources || 0}</p>
				</div>
				<div className="rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/10 to-transparent p-6 backdrop-blur">
					<p className="text-sm uppercase tracking-[0.2em] text-slate-400">Open Tickets</p>
					<p className="mt-2 text-3xl font-black text-rose-200">{analytics?.openTickets || 0}</p>
				</div>
			</div>

			{/* Top Resources Chart */}
			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<h3 className="text-xl font-bold text-white">Top Resources by Bookings</h3>
				<div className="mt-6 h-80">
					{analytics?.topResources && analytics.topResources.length > 0 ? (
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={analytics.topResources}>
								<CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
								<XAxis dataKey="resourceName" stroke="#94a3b8" />
								<YAxis stroke="#94a3b8" />
								<Tooltip
									contentStyle={{
										backgroundColor: "#1e293b",
										border: "1px solid #64748b",
										borderRadius: "8px",
									}}
									labelStyle={{ color: "#e2e8f0" }}
								/>
								<Bar dataKey="bookingCount" fill="#06b6d4" radius={[8, 8, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					) : (
						<div className="flex items-center justify-center h-full text-slate-400">
							<p>No booking data available</p>
						</div>
					)}
				</div>
			</div>

			{/* Peak Hours Chart */}
			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<h3 className="text-xl font-bold text-white">Peak Booking Hours</h3>
				<div className="mt-6 h-80">
					{analytics?.peakHours && analytics.peakHours.length > 0 ? (
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={analytics.peakHours}>
								<CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
								<XAxis
									dataKey="hour"
									stroke="#94a3b8"
									tickFormatter={(hour) => `${hour}:00`}
								/>
								<YAxis stroke="#94a3b8" />
								<Tooltip
									contentStyle={{
										backgroundColor: "#1e293b",
										border: "1px solid #64748b",
										borderRadius: "8px",
									}}
									labelStyle={{ color: "#e2e8f0" }}
									formatter={(value) => [value, "Bookings"]}
									labelFormatter={(hour) => `${hour}:00`}
								/>
								<Legend />
								<Line
									type="monotone"
									dataKey="bookingCount"
									stroke="#06b6d4"
									strokeWidth={2}
									dot={{ fill: "#06b6d4", r: 4 }}
									activeDot={{ r: 6 }}
									name="Bookings"
								/>
							</LineChart>
						</ResponsiveContainer>
					) : (
						<div className="flex items-center justify-center h-full text-slate-400">
							<p>No hourly data available</p>
						</div>
					)}
				</div>
			</div>

			{/* Booking Status & Usage Stats */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Booking Status Pie Chart */}
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<h3 className="text-xl font-bold text-white">Booking Status Distribution</h3>
					<div className="mt-6 h-80">
						{statusData.some((d) => d.value > 0) ? (
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={statusData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, value }) => `${name}: ${value}`}
										outerRadius={100}
										fill="#8884d8"
										dataKey="value"
									>
										{statusData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip
										contentStyle={{
											backgroundColor: "#1e293b",
											border: "1px solid #64748b",
											borderRadius: "8px",
										}}
										labelStyle={{ color: "#e2e8f0" }}
									/>
								</PieChart>
							</ResponsiveContainer>
						) : (
							<div className="flex items-center justify-center h-full text-slate-400">
								<p>No status data available</p>
							</div>
						)}
					</div>
				</div>

				{/* Usage Statistics */}
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<h3 className="text-xl font-bold text-white">Usage Statistics</h3>
					<div className="mt-6 space-y-4">
						<div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
							<p className="text-sm text-slate-400">This Month Bookings</p>
							<p className="mt-2 text-2xl font-bold text-cyan-200">
								{analytics?.usageStats?.thisMonthBookings || 0}
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
							<p className="text-sm text-slate-400">Avg Booking Duration</p>
							<p className="mt-2 text-2xl font-bold text-emerald-200">
								{analytics?.usageStats?.averageBookingDuration?.toFixed(1) || 0}h
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
							<p className="text-sm text-slate-400">Most Used Hour</p>
							<p className="mt-2 text-2xl font-bold text-amber-200">
								{analytics?.usageStats?.mostUsedHour}:00
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
							<p className="text-sm text-slate-400">Resource Utilization</p>
							<p className="mt-2 text-2xl font-bold text-purple-200">
								{analytics?.usageStats?.utilization?.toFixed(1) || 0}%
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
