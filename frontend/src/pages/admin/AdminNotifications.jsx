import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { createNotification, getAdminNotifications } from "../../services/notificationService";

const CATEGORIES = {
	ACADEMIC_NOTICES: "Academic Notices",
	EVENTS_ACTIVITIES: "Events & Activities",
	MAINTENANCE_ALERTS: "Maintenance Alerts"
};

export default function AdminNotifications() {
	const { isDark } = useTheme();
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [category, setCategory] = useState("ACADEMIC_NOTICES");
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
			await createNotification({ title, message, category });
			setTitle("");
			setMessage("");
			setCategory("ACADEMIC_NOTICES");
			setStatus("Notification posted successfully.");
			await loadNotifications();
		} catch (submitError) {
			setError(submitError.message || "Failed to post notification");
		}
	};

	return (
		<section className="space-y-6">
			<div className={`rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
				<h2 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Notifications</h2>
				<p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
					Upload campus notices so all students can view them in their notifications page.
				</p>

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
					<div>
						<label className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`} htmlFor="notice-title">
							Title
						</label>
						<input
							id="notice-title"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							required
							className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
								isDark
									? "border-white/15 bg-slate-900/70 text-white focus:border-cyan-300/50"
									: "border-slate-300 bg-white text-slate-900 focus:border-cyan-300"
							}`}
							placeholder="Exam schedule update"
						/>
					</div>
					<div>
						<label className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`} htmlFor="notice-category">
							Category
						</label>
						<select
							id="notice-category"
							value={category}
							onChange={(event) => setCategory(event.target.value)}
							className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
								isDark
									? "border-white/15 bg-slate-900/70 text-white focus:border-cyan-300/50"
									: "border-slate-300 bg-white text-slate-900 focus:border-cyan-300"
							}`}
						>
							<option value="ACADEMIC_NOTICES">Academic Notices</option>
							<option value="EVENTS_ACTIVITIES">Events & Activities</option>
							<option value="MAINTENANCE_ALERTS">Maintenance Alerts</option>
						</select>
					</div>
					<div>
						<label className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`} htmlFor="notice-message">
							Message
						</label>
						<textarea
							id="notice-message"
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							required
							rows={5}
							className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
								isDark
									? "border-white/15 bg-slate-900/70 text-white focus:border-cyan-300/50"
									: "border-slate-300 bg-white text-slate-900 focus:border-cyan-300"
							}`}
							placeholder="Classes for Section B are moved to Hall 3 from Monday."
						/>
					</div>
					<button
						type="submit"
						className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-500"
					>
						Post Notification
					</button>
				</form>

				{status ? <p className="mt-4 text-sm font-semibold text-emerald-300">{status}</p> : null}
				{error ? <p className="mt-4 text-sm font-semibold text-rose-300">{error}</p> : null}
			</div>

			<div className={`rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
				<h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Published Notices</h3>
				<div className="mt-4 space-y-3">
					{notifications.length === 0 ? (
						<p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>No notifications posted yet.</p>
					) : (
						notifications.map((item) => (
							<article key={item.id} className={`rounded-2xl border p-4 ${
								isDark
									? "border-white/10 bg-slate-900/60"
									: "border-slate-200 bg-white"
							}`}>
								<div className="flex items-start justify-between gap-3">
									<h4 className={`text-base font-bold ${isDark ? "text-cyan-200" : "text-cyan-700"}`}>{item.title}</h4>
									<span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
										{new Date(item.createdAt).toLocaleString()}
									</span>
								</div>
								<div className="mt-2 flex items-center gap-2">
									<span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
										isDark
											? "bg-purple-400/20 text-purple-200"
											: "bg-purple-100 text-purple-700"
									}`}>
										{CATEGORIES[item.category] || item.category}
									</span>
								</div>
								<p className={`mt-2 text-sm ${isDark ? "text-slate-200" : "text-slate-600"}`}>{item.message}</p>
							</article>
						))
					)}
				</div>
			</div>
		</section>
	);
}
