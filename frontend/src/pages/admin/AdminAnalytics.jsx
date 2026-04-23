import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
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
	const { isDark } = useTheme();
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
				<div className={`rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
					<p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Loading analytics...</p>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="space-y-6">
				<div className={`rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
					<p className={`text-sm font-semibold ${isDark ? "text-rose-300" : "text-rose-700"}`}>{error}</p>
				</div>
			</section>
		);
	}

	const statusData = [
		{ name: "Approved", value: analytics?.approvedBookings || 0, color: isDark ? "#06b6d4" : "#0891b2" },
		{ name: "Pending", value: analytics?.pendingBookings || 0, color: isDark ? "#f59e0b" : "#d97706" },
	];

	const COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
	const tooltipStyles = {
		backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
		border: `1px solid ${isDark ? "#64748b" : "#cbd5e1"}`,
		borderRadius: "8px",
	};
	const labelStyle = { color: isDark ? "#e2e8f0" : "#1e293b" };

	return (
		<section className="space-y-6">
			{/* Key Metrics */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<div className={`rounded-2xl border bg-gradient-to-br p-6 ${
					isDark
						? "border-white/10 from-cyan-500/10 to-transparent"
						: "border-cyan-200 from-cyan-50 to-transparent"
				}`}>
					<p className={`text-sm uppercase tracking-[0.2em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Total Bookings</p>
					<p className={`mt-2 text-3xl font-black ${isDark ? "text-cyan-200" : "text-cyan-700"}`}>
						{analytics?.totalBookings || 0}
					</p>
				</div>
				<div className={`rounded-2xl border bg-gradient-to-br p-6 ${
					isDark
						? "border-white/10 from-emerald-500/10 to-transparent"
						: "border-emerald-200 from-emerald-50 to-transparent"
				}`}>
					<p className={`text-sm uppercase tracking-[0.2em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Approved</p>
					<p className={`mt-2 text-3xl font-black ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>
						{analytics?.approvedBookings || 0}
					</p>
				</div>
				<div className={`rounded-2xl border bg-gradient-to-br p-6 ${
					isDark
						? "border-white/10 from-amber-500/10 to-transparent"
						: "border-amber-200 from-amber-50 to-transparent"
				}`}>
					<p className={`text-sm uppercase tracking-[0.2em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Pending</p>
					<p className={`mt-2 text-3xl font-black ${isDark ? "text-amber-200" : "text-amber-700"}`}>
						{analytics?.pendingBookings || 0}
					</p>
				</div>
				<div className={`rounded-2xl border bg-gradient-to-br p-6 ${
					isDark
						? "border-white/10 from-purple-500/10 to-transparent"
						: "border-purple-200 from-purple-50 to-transparent"
				}`}>
					<p className={`text-sm uppercase tracking-[0.2em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Total Resources</p>
					<p className={`mt-2 text-3xl font-black ${isDark ? "text-purple-200" : "text-purple-700"}`}>
						{analytics?.totalResources || 0}
					</p>
				</div>
			</div>

			{/* Top Resources Chart */}
			<div className={`rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
				<h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Top Resources by Bookings</h3>
				<div className="mt-6 h-80">
					{analytics?.topResources && analytics.topResources.length > 0 ? (
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={analytics.topResources}>
								<CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff15" : "#e2e8f015"} />
								<XAxis dataKey="resourceName" stroke={isDark ? "#94a3b8" : "#64748b"} />
								<YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
								<Tooltip contentStyle={tooltipStyles} labelStyle={labelStyle} />
								<Bar dataKey="bookingCount" fill="#06b6d4" radius={[8, 8, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					) : (
						<div className={`flex items-center justify-center h-full ${isDark ? "text-slate-400" : "text-slate-500"}`}>
							<p>No booking data available</p>
						</div>
					)}
				</div>
			</div>

			{/* Peak Hours Chart */}
			<div className={`rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
				<h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Peak Booking Hours</h3>
				<div className="mt-6 h-80">
					{analytics?.peakHours && analytics.peakHours.length > 0 ? (
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={analytics.peakHours}>
								<CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff15" : "#e2e8f015"} />
								<XAxis
									dataKey="hour"
									stroke={isDark ? "#94a3b8" : "#64748b"}
									tickFormatter={(hour) => `${hour}:00`}
								/>
								<YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
								<Tooltip contentStyle={tooltipStyles} labelStyle={labelStyle} formatter={(value) => [value, "Bookings"]} labelFormatter={(hour) => `${hour}:00`} />
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
						<div className={`flex items-center justify-center h-full ${isDark ? "text-slate-400" : "text-slate-500"}`}>
							<p>No hourly data available</p>
						</div>
					)}
				</div>
			</div>

			{/* Booking Status & Usage Stats */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Booking Status Pie Chart */}
				<div className={`rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
					<h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Booking Status Distribution</h3>
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
									<Tooltip contentStyle={tooltipStyles} labelStyle={labelStyle} />
								</PieChart>
							</ResponsiveContainer>
						) : (
							<div className={`flex items-center justify-center h-full ${isDark ? "text-slate-400" : "text-slate-500"}`}>
								<p>No status data available</p>
							</div>
						)}
					</div>
				</div>

				{/* Usage Statistics */}
				<div className={`rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
					<h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Usage Statistics</h3>
					<div className="mt-6 space-y-4">
						<div className={`rounded-2xl border p-4 ${
							isDark
								? "border-white/10 bg-slate-900/40"
								: "border-slate-300 bg-white"
						}`}>
							<p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>This Month Bookings</p>
							<p className={`mt-2 text-2xl font-bold ${isDark ? "text-cyan-200" : "text-cyan-700"}`}>
								{analytics?.usageStats?.thisMonthBookings || 0}
							</p>
						</div>
						<div className={`rounded-2xl border p-4 ${
							isDark
								? "border-white/10 bg-slate-900/40"
								: "border-slate-300 bg-white"
						}`}>
							<p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Avg Booking Duration</p>
							<p className={`mt-2 text-2xl font-bold ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>
								{analytics?.usageStats?.averageBookingDuration?.toFixed(1) || 0}h
							</p>
						</div>
						<div className={`rounded-2xl border p-4 ${
							isDark
								? "border-white/10 bg-slate-900/40"
								: "border-slate-300 bg-white"
						}`}>
							<p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Most Used Hour</p>
							<p className={`mt-2 text-2xl font-bold ${isDark ? "text-amber-200" : "text-amber-700"}`}>
								{analytics?.usageStats?.mostUsedHour}:00
							</p>
						</div>
						<div className={`rounded-2xl border p-4 ${
							isDark
								? "border-white/10 bg-slate-900/40"
								: "border-slate-300 bg-white"
						}`}>
							<p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Resource Utilization</p>
							<p className={`mt-2 text-2xl font-bold ${isDark ? "text-purple-200" : "text-purple-700"}`}>
								{analytics?.usageStats?.utilization?.toFixed(1) || 0}%
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
