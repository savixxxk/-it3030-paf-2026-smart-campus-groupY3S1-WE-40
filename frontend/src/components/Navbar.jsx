import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getStudentNotifications } from "../services/notificationService";

export default function Navbar() {
	const { isAuthenticated, user, logout } = useAuth();
	const { isDark, toggleTheme } = useTheme();
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		let isMounted = true;

		const loadUnreadCount = async () => {
			if (!isAuthenticated || user?.role === "ADMIN" || !user?.email) {
				if (isMounted) {
					setUnreadCount(0);
				}
				return;
			}

			try {
				const notifications = await getStudentNotifications(user.email);
				if (!isMounted) {
					return;
				}

				setUnreadCount(notifications.filter((notification) => !notification.read).length);
			} catch {
				if (isMounted) {
					setUnreadCount(0);
				}
			}
		};

		loadUnreadCount();

		return () => {
			isMounted = false;
		};
	}, [isAuthenticated, user?.email, user?.role]);

	const navLinkClass = "rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

	const serviceLinks = [
		{ to: "/facilities", label: "Facilities" },
		{ to: "/bookings", label: "Bookings" },
		{ to: "/tickets", label: "Tickets" }
	];

	return (
		<header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
			<nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
				<Link to="/" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
					Smart Campus
				</Link>

				<div className="flex flex-wrap items-center gap-3">
					<Link to="/" className={navLinkClass}>
						Home
					</Link>
					{isAuthenticated ? (
						<>
							{user?.role === "ADMIN" ? (
								<Link to="/admin-dashboard" className={navLinkClass}>
									Admin Dashboard
								</Link>
							) : (
								<Link to="/notifications" className={navLinkClass}>
									<span className="inline-flex items-center gap-2">
										Notifications
										{unreadCount > 0 ? (
											<span className="inline-flex min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
												{unreadCount > 9 ? "9+" : unreadCount}
											</span>
										) : null}
									</span>
								</Link>
							)}
							{user?.role !== "ADMIN" ? (
								serviceLinks.map((link) => (
									<Link key={link.to} to={link.to} className={navLinkClass}>
										{link.label}
									</Link>
								))
							) : null}
							<span className="hidden text-sm text-slate-600 dark:text-slate-400 md:block">{user?.fullName}</span>
						</>
					) : (
						<>
							<Link to="/login" className={navLinkClass}>
								Login
							</Link>
							<Link to="/signup" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-cyan-600 dark:hover:bg-cyan-500">
								Register
							</Link>
						</>
					)}
					<button
						onClick={toggleTheme}
						className="rounded-md p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
						title={isDark ? "Switch to light mode" : "Switch to dark mode"}
					>
						{isDark ? (
							<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
							</svg>
						) : (
							<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.828-2.828a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm.464 4.536a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zm-2.828-2.828a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM13 11a1 1 0 110-2h1a1 1 0 110 2h-1zM9 17a1 1 0 100-2H8a1 1 0 100 2h1z" clipRule="evenodd" />
							</svg>
						)}
					</button>
					{isAuthenticated && (
						<button
							onClick={logout}
							className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
						>
							Logout
						</button>
					)}
				</div>
			</nav>
		</header>
	);
}
