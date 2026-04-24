import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getNotificationPreferences, updateNotificationPreference } from "../services/notificationService";

const CATEGORIES = {
	ACADEMIC_NOTICES: {
		name: "Academic Notices",
		description: "Important academic updates, exam schedules, and course information"
	},
	EVENTS_ACTIVITIES: {
		name: "Events & Activities",
		description: "Campus events, clubs, activities, and social gatherings"
	},
	MAINTENANCE_ALERTS: {
		name: "Maintenance Alerts",
		description: "Facility maintenance notifications and service updates"
	},
	REMINDERS: {
		name: "Reminder Notifications",
		description: "Booking reminders and follow-up alerts for unfinished tickets"
	}
};

export default function NotificationPreferences() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [preferences, setPreferences] = useState({});
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
		} catch (loadError) {
			setError(loadError.message || "Failed to load preferences");
		} finally {
			setLoading(false);
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
		<main className="min-h-[calc(100vh-73px)] bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
			<section className="mx-auto max-w-2xl">
				<button
					onClick={() => navigate("/notifications")}
					className="mb-6 rounded-lg border border-white/15 bg-slate-900/50 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800/50"
				>
					← Back to Notifications
				</button>

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
					<p className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
						Notification Settings
					</p>
					<h1 className="mt-3 text-3xl font-black text-white">Manage Preferences</h1>
					<p className="mt-2 text-sm text-slate-300">
						Choose which notification categories you want to receive. Disabled categories won't appear in your notifications.
					</p>

					{loading ? <p className="mt-6 text-sm text-slate-300">Loading preferences...</p> : null}
					{error ? <p className="mt-6 text-sm font-semibold text-rose-300">{error}</p> : null}
					{status ? <p className="mt-6 text-sm font-semibold text-emerald-300">{status}</p> : null}

					<div className="mt-8 space-y-4">
						{Object.entries(CATEGORIES).map(([key, category]) => (
							<div
								key={key}
								className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition hover:bg-slate-900/80"
							>
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<h3 className="text-base font-bold text-white">{category.name}</h3>
										<p className="mt-1 text-sm text-slate-400">{category.description}</p>
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

					<div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/40 p-4">
						<p className="text-xs text-slate-400">
							<span className="font-semibold">Note:</span> When you disable a category, new notifications in that category will not appear in
							your notifications page, but previously read notifications will remain visible.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
