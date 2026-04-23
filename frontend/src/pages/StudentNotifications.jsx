import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
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
	const navigate = useNavigate();
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		loadNotifications();
	}, [user?.email]);

	const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

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
		<main className="min-h-[calc(100vh-73px)] bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
			<section className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
							Student Notifications
						</p>
						<h1 className="mt-3 text-3xl font-black text-white">Campus Notices</h1>
						<p className="mt-2 text-sm text-slate-300">Read the latest updates posted by the admin team.</p>
					</div>
					<div className="flex flex-col gap-3">
						<div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-400">Unread</p>
							<p className="text-2xl font-black text-cyan-200">{unreadCount}</p>
						</div>
						<button
							onClick={() => navigate("/notification-preferences")}
							className="rounded-xl bg-slate-800/70 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
						>
							Manage Preferences
						</button>
					</div>
				</div>

				{loading ? <p className="mt-6 text-sm text-slate-300">Loading notifications...</p> : null}
				{error ? <p className="mt-6 text-sm font-semibold text-rose-300">{error}</p> : null}

				<div className="mt-6 space-y-3">
					{!loading && notifications.length === 0 ? (
						<p className="text-sm text-slate-300">No notifications available right now.</p>
					) : null}

					{notifications.map((item) => (
						<article key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
							<div className="flex flex-wrap items-start justify-between gap-2">
								<div className="flex-1">
									<h2 className="text-lg font-bold text-white">{item.title}</h2>
									<div className="mt-1 flex flex-wrap items-center gap-2">
										<span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[item.category] || "bg-slate-400/15 text-slate-200"}`}>
											{CATEGORIES[item.category] || item.category}
										</span>
										<p className="text-sm text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
									</div>
								</div>
								<span
									className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
										item.read ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-400/20 text-amber-200"
									}`}
								>
									{item.read ? "Read" : "New"}
								</span>
							</div>
							<p className="mt-3 text-sm leading-relaxed text-slate-200">{item.message}</p>

							{item.read ? null : (
								<button
									onClick={() => handleMarkRead(item.id)}
									className="mt-4 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
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