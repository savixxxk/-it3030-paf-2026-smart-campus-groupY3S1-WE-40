import { adminStats } from "../../data/adminMockData";

export default function AdminOverview() {
	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{adminStats.map((item) => (
					<div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
						<p className="text-sm text-slate-300">{item.label}</p>
						<p className="mt-2 text-3xl font-black text-white">{item.value}</p>
						<p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-200">{item.delta}</p>
					</div>
				))}
			</div>

			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<h3 className="text-lg font-bold text-white">Admin Workflow</h3>
				<div className="mt-5 space-y-4 text-sm text-slate-300">
					<p>• Use the Users tab to manage student accounts and roles.</p>
					<p>• Use the Notifications tab to publish campus notices for all students.</p>
					<p>• Students can mark each notice as read from their Notifications page.</p>
				</div>
			</div>
		</div>
	);
}
