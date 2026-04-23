import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getStudentNotifications, markNotificationRead } from "../services/notificationService";
import { useNavigate } from "react-router-dom";

const CATEGORIES = {
	ACADEMIC_NOTICES: "Academic Notices",
	EVENTS_ACTIVITIES: "Events & Activities",
	MAINTENANCE_ALERTS: "Maintenance Alerts"
};

const CATEGORY_COLORS = {
	ACADEMIC_NOTICES: "bg-blue-400/15 text-blue-200",
	EVENTS_ACTIVITIES: "bg-emerald-400/15 text-emerald-200",
	MAINTENANCE_ALERTS: "bg-orange-400/15 text-orange-200"
};

export default function StudentNotifications() {
	const { user } = useAuth();
	const { isDark } = useTheme();
	const navigate = useNavigate();
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		loadNotifications();
	}, [user?.email]);

	const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);
	const pageStyles = isDark
		? {
			main: "bg-slate-950 text-slate-100",
			panel: "border-white/10 bg-white/5 backdrop-blur",
			card: "border-white/10 bg-slate-900/60",
			muted: "text-slate-300",
			soft: "text-slate-400",
			button: "bg-slate-800/70 text-slate-200 hover:bg-slate-700",
			prefButton: "bg-cyan-400 text-slate-950 hover:bg-cyan-300",
			badgeNew: "bg-amber-400/20 text-amber-200",
			badgeRead: "bg-emerald-400/15 text-emerald-200",
			categoryFallback: "bg-slate-400/15 text-slate-200"
		}
		: {
			main: "bg-white text-slate-900",
			panel: "border-slate-200 bg-slate-50 shadow-sm",
			card: "border-slate-200 bg-white",
			muted: "text-slate-600",
			soft: "text-slate-500",
			button: "bg-slate-900 text-white hover:bg-slate-700",
			prefButton: "bg-cyan-600 text-white hover:bg-cyan-500",
			badgeNew: "bg-amber-100 text-amber-700",
			badgeRead: "bg-emerald-100 text-emerald-700",
			categoryFallback: "bg-slate-100 text-slate-700"
		};

	const loadNotifications = async () => {
		if (!user?.email) {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError("");

		try {
			const data = await getStudentNotifications(user.email);
			setNotifications(data);
		} catch (loadError) {
			setError(loadError.message || "Failed to load notifications");
		} finally {
			setLoading(false);
		}
	};

	const handleMarkRead = async (notificationId) => {
		try {
			await markNotificationRead(notificationId, user.email);
			setNotifications((prev) => prev.map((item) => (item.id === notificationId ? { ...item, read: true } : item)));
		} catch (markError) {
			setError(markError.message || "Failed to mark as read");
		}
	};

	return (
		<main className={`min-h-[calc(100vh-73px)] px-4 py-10 sm:px-6 lg:px-8 ${pageStyles.main}`}>
			<section className={`mx-auto max-w-5xl rounded-3xl border p-6 md:p-8 ${pageStyles.panel}`}>
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? "border-cyan-300/35 bg-cyan-300/10 text-cyan-100" : "border-cyan-200 bg-cyan-50 text-cyan-700"}`}>
							Student Notifications
						</p>
						<h1 className={`mt-3 text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Campus Notices</h1>
						<p className={`mt-2 text-sm ${pageStyles.muted}`}>Read the latest updates posted by the admin team.</p>
					</div>
					<div className="flex flex-col gap-3">
						<div className={`rounded-2xl border px-4 py-3 text-center ${isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white"}`}>
							<p className={`text-xs uppercase tracking-[0.2em] ${pageStyles.soft}`}>Unread</p>
							<p className={`text-2xl font-black ${isDark ? "text-cyan-200" : "text-cyan-700"}`}>{unreadCount}</p>
						</div>
						<button
							onClick={() => navigate("/notification-preferences")}
							className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${pageStyles.button}`}
						>
							Manage Preferences
						</button>
					</div>
				</div>

				{loading ? <p className={`mt-6 text-sm ${pageStyles.muted}`}>Loading notifications...</p> : null}
				{error ? <p className={`mt-6 text-sm font-semibold ${isDark ? "text-rose-300" : "text-rose-700"}`}>{error}</p> : null}

				<div className="mt-6 space-y-3">
					{!loading && notifications.length === 0 ? (
						<p className={`text-sm ${pageStyles.muted}`}>No notifications available right now.</p>
					) : null}

					{notifications.map((item) => (
						<article key={item.id} className={`rounded-2xl border p-4 ${pageStyles.card}`}>
							<div className="flex flex-wrap items-start justify-between gap-2">
								<div className="flex-1">
									<h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{item.title}</h2>
									<div className="mt-1 flex flex-wrap items-center gap-2">
										<span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${isDark ? (CATEGORY_COLORS[item.category] || pageStyles.categoryFallback) : (item.category === "ACADEMIC_NOTICES" ? "bg-blue-100 text-blue-700" : item.category === "EVENTS_ACTIVITIES" ? "bg-emerald-100 text-emerald-700" : item.category === "MAINTENANCE_ALERTS" ? "bg-orange-100 text-orange-700" : pageStyles.categoryFallback)}`}>
											{CATEGORIES[item.category] || item.category}
										</span>
										<p className={`text-sm ${pageStyles.soft}`}>{new Date(item.createdAt).toLocaleString()}</p>
									</div>
								</div>
								<span
									className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
										item.read ? pageStyles.badgeRead : pageStyles.badgeNew
									}`}
								>
									{item.read ? "Read" : "New"}
								</span>
							</div>
							<p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700"}`}>{item.message}</p>

							{item.read ? null : (
								<button
									onClick={() => handleMarkRead(item.id)}
									className="mt-4 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 dark:bg-cyan-600 dark:text-white dark:hover:bg-cyan-500"
								>
									Mark as Read
								</button>
							)}
						</article>
					))}
				</div>
			</section>
		</main>
	);
}