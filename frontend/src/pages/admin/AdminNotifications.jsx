import { useEffect, useState } from "react";
import { createNotification, getAdminNotifications } from "../../services/notificationService";

const CATEGORIES = {
	ACADEMIC_NOTICES: "Academic Notices",
	EVENTS_ACTIVITIES: "Events & Activities",
	MAINTENANCE_ALERTS: "Maintenance Alerts",
	REMINDERS: "Reminder Notifications"
};

const PRIORITIES = {
	HIGH: "High",
	MEDIUM: "Medium",
	LOW: "Low"
};

export default function AdminNotifications() {
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [category, setCategory] = useState("ACADEMIC_NOTICES");
	const [priority, setPriority] = useState("MEDIUM");
	const [notifications, setNotifications] = useState([]);
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		loadNotifications();
	}, []);

	const loadNotifications = async () => {
		try {
			const data = await getAdminNotifications();
			setNotifications(data);
		} catch (loadError) {
			setError(loadError.message || "Failed to load notifications");
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setStatus("");

		try {
			await createNotification({ title, message, category, priority });
			setTitle("");
			setMessage("");
			setCategory("ACADEMIC_NOTICES");
			setPriority("MEDIUM");
			setStatus("Notification posted successfully.");
			await loadNotifications();
		} catch (submitError) {
			setError(submitError.message || "Failed to post notification");
		}
	};

	return (
		<section className="space-y-6">
			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<h2 className="text-2xl font-black text-white">Notifications</h2>
				<p className="mt-2 text-sm text-slate-300">Upload campus notices so all students can view them in their notifications page.</p>

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="notice-title">
							Title
						</label>
						<input
							id="notice-title"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							required
							className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
							placeholder="Exam schedule update"
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="notice-category">
							Category
						</label>
						<select
							id="notice-category"
							value={category}
							onChange={(event) => setCategory(event.target.value)}
							className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
						>
							<option value="ACADEMIC_NOTICES">Academic Notices</option>
							<option value="EVENTS_ACTIVITIES">Events & Activities</option>
							<option value="MAINTENANCE_ALERTS">Maintenance Alerts</option>
						</select>
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="notice-priority">
							Priority
						</label>
						<select
							id="notice-priority"
							value={priority}
							onChange={(event) => setPriority(event.target.value)}
							className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
						>
							<option value="HIGH">High</option>
							<option value="MEDIUM">Medium</option>
							<option value="LOW">Low</option>
						</select>
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="notice-message">
							Message
						</label>
						<textarea
							id="notice-message"
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							required
							rows={5}
							className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
							placeholder="Classes for Section B are moved to Hall 3 from Monday."
						/>
					</div>
					<button
						type="submit"
						className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
					>
						Post Notification
					</button>
				</form>

				{status ? <p className="mt-4 text-sm font-semibold text-emerald-300">{status}</p> : null}
				{error ? <p className="mt-4 text-sm font-semibold text-rose-300">{error}</p> : null}
			</div>

			<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
				<h3 className="text-xl font-bold text-white">Published Notices</h3>
				<div className="mt-4 space-y-3">
					{notifications.length === 0 ? (
						<p className="text-sm text-slate-300">No notifications posted yet.</p>
					) : (
						notifications.map((item) => (
							<article key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
								<div className="flex items-start justify-between gap-3">
									<h4 className="text-base font-bold text-cyan-200">{item.title}</h4>
									<span className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
								</div>
								<div className="mt-2 flex flex-wrap items-center gap-2">
									<span className="inline-block rounded-full bg-purple-400/20 px-2 py-1 text-xs font-semibold text-purple-200">
										{CATEGORIES[item.category] || item.category}
									</span>
									<span className="inline-block rounded-full bg-slate-400/15 px-2 py-1 text-xs font-semibold text-slate-200">
										{PRIORITIES[item.priority] || item.priority || "Medium"}
									</span>
								</div>
								<p className="mt-2 text-sm text-slate-200">{item.message}</p>
							</article>
						))
					)}
				</div>
			</div>
		</section>
	);
}