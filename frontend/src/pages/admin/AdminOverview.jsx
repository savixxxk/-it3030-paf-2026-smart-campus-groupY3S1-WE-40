import { useTheme } from "../../context/ThemeContext";
import { adminStats } from "../../data/adminMockData";

export default function AdminOverview() {
	const { isDark } = useTheme();

	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{adminStats.map((item) => (
					<div
						key={item.label}
						className={`rounded-3xl border p-5 transition ${
							isDark
								? "border-white/10 bg-white/5 backdrop-blur hover:bg-white/8"
								: "border-slate-200 bg-slate-50 shadow-sm hover:shadow-md"
						}`}
					>
						<p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-500"}`}>
							{item.label}
						</p>
						<p className={`mt-2 text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
							{item.value}
						</p>
						<p className={`mt-1 text-xs uppercase tracking-[0.18em] ${isDark ? "text-cyan-200" : "text-cyan-700"}`}>
							{item.delta}
						</p>
					</div>
				))}
			</div>

			<div
				className={`rounded-3xl border p-6 ${
					isDark
						? "border-white/10 bg-white/5 backdrop-blur"
						: "border-slate-200 bg-slate-50 shadow-sm"
				}`}
			>
				<h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
					Admin Workflow
				</h3>
				<div className={`mt-5 space-y-4 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
					<p>• Use the Users tab to manage student accounts and roles.</p>
					<p>• Use the Notifications tab to publish campus notices for all students.</p>
					<p>• Students can mark each notice as read from their Notifications page.</p>
				</div>
			</div>
		</div>
	);
}
