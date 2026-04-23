import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { getDoNotDisturb, getNotificationPreferences, updateDoNotDisturb, updateNotificationPreference } from "../services/notificationService";

const CATEGORIES = {
	ACADEMIC_NOTICES: {
		name: "Academic Notices",
		description: "Important academic updates, exam schedules, and course information"
	},
	BOOKING: {
		name: "Booking",
		description: "Resource booking alerts and reservation updates"
	},
	TICKETS: {
		name: "Tickets",
		description: "Support and service request updates"
	},
	MAINTENANCE_ALERTS: {
		name: "Maintenance Alerts",
		description: "Facility maintenance notifications and service updates"
	}
};

export default function NotificationPreferences() {
	const { user } = useAuth();
	const { isDark } = useTheme();
	const navigate = useNavigate();
	const [preferences, setPreferences] = useState({});
	const [dnd, setDnd] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [status, setStatus] = useState("");

	useEffect(() => {
		loadPreferences();
	}, [user?.email]);

	const loadPreferences = async () => {
		if (!user?.email) {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError("");

		try {
			const data = await getNotificationPreferences(user.email);
			setPreferences(data);
			const dndData = await getDoNotDisturb(user.email);
			setDnd(Boolean(dndData.enabled));
		} catch (loadError) {
			setError(loadError.message || "Failed to load preferences");
		} finally {
			setLoading(false);
		}
	};

	const handleToggleDnd = async () => {
		setStatus("");
		setError("");

		try {
			const nextValue = !dnd;
			await updateDoNotDisturb(user.email, nextValue);
			setDnd(nextValue);
			setStatus("Do Not Disturb updated successfully.");
			setTimeout(() => setStatus(""), 3000);
		} catch (dndError) {
			setError(dndError.message || "Failed to update DND");
		}
	};

	const handleTogglePreference = async (category) => {
		setStatus("");
		setError("");

		try {
			const newValue = !preferences[category];
			await updateNotificationPreference(user.email, category, newValue);
			setPreferences((prev) => ({
				...prev,
				[category]: newValue
			}));
			setStatus("Preference updated successfully.");
			setTimeout(() => setStatus(""), 3000);
		} catch (toggleError) {
			setError(toggleError.message || "Failed to update preference");
		}
	};

	return (
		<main className={`min-h-[calc(100vh-73px)] px-4 py-10 sm:px-6 lg:px-8 ${isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>
			<section className="mx-auto max-w-2xl">
				<button
					onClick={() => navigate("/notifications")}
					className={`mb-6 rounded-lg border px-4 py-2 text-sm font-semibold transition ${isDark ? "border-white/15 bg-slate-900/50 text-slate-200 hover:bg-slate-800/50" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"}`}
				>
					← Back to Notifications
				</button>

				<div className={`rounded-3xl border p-6 md:p-8 ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-slate-50 shadow-sm"}`}>
					<p className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? "border-cyan-300/35 bg-cyan-300/10 text-cyan-100" : "border-cyan-200 bg-cyan-50 text-cyan-700"}`}>
						Notification Settings
					</p>
					<h1 className={`mt-3 text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Manage Preferences</h1>
					<p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
						Choose which notification categories you want to receive. Disabled categories won't appear in your notifications.
					</p>

					<div className={`mt-6 rounded-2xl border p-4 ${isDark ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-white"}`}>
						<div className="flex items-start justify-between gap-4">
							<div>
								<h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Do Not Disturb</h3>
								<p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Pause notification delivery and hide unread alerts while studying or sleeping.</p>
							</div>
							<button
								onClick={handleToggleDnd}
								className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${dnd ? "bg-cyan-500" : isDark ? "bg-slate-700" : "bg-slate-300"}`}
								role="switch"
								aria-checked={dnd}
							>
								<span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${dnd ? "translate-x-6" : "translate-x-0"}`} style={{ margin: "2px" }} />
							</button>
						</div>
					</div>

					{loading ? <p className={`mt-6 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Loading preferences...</p> : null}
					{error ? <p className={`mt-6 text-sm font-semibold ${isDark ? "text-rose-300" : "text-rose-700"}`}>{error}</p> : null}
					{status ? <p className={`mt-6 text-sm font-semibold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>{status}</p> : null}

					<div className="mt-8 space-y-4">
						{Object.entries(CATEGORIES).map(([key, category]) => (
							<div
								key={key}
								className={`rounded-2xl border p-4 transition ${isDark ? "border-white/10 bg-slate-900/60 hover:bg-slate-900/80" : "border-slate-200 bg-white hover:bg-slate-50"}`}
							>
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{category.name}</h3>
										<p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{category.description}</p>
									</div>
									<button
										onClick={() => handleTogglePreference(key)}
										className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${
											preferences[key] ? "bg-cyan-500" : "bg-slate-700"
										}`}
										role="switch"
										aria-checked={preferences[key] || false}
									>
										<span
											className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
												preferences[key] ? "translate-x-6" : "translate-x-0"
											}`}
											style={{ margin: "2px" }}
										/>
									</button>
								</div>
							</div>
						))}
					</div>

					<div className={`mt-8 rounded-2xl border p-4 ${isDark ? "border-white/10 bg-slate-900/40" : "border-slate-200 bg-slate-50"}`}>
						<p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
							<span className="font-semibold">Note:</span> When you disable a category, new notifications in that category will not appear in
							your notifications page, but previously read notifications will remain visible.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
