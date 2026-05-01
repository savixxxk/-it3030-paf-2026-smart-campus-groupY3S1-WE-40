import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
	const { isAuthenticated, user, logout } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<header className="border-b border-slate-200 bg-white/90 backdrop-blur transition-colors duration-300">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
					Smart Campus
				</Link>

				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={toggleTheme}
						className="rounded-md border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
						aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
					>
						{theme === "dark" ? "Light mode" : "Dark mode"}
					</button>
					<Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
						Home
					</Link>
					{isAuthenticated ? (
						<>
							{user?.role === "ADMIN" ? (
								<Link to="/admin-dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
									Admin Dashboard
								</Link>
							) : (
								<>
									<Link to="/my-bookings" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
										My Bookings
									</Link>
									<Link to="/my-tickets" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
										My Tickets
									</Link>
									<Link to="/notifications" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
										Notifications
									</Link>
								</>
							)}
							<span className="hidden text-sm text-slate-600 md:block">{user?.fullName}</span>
							<button
								onClick={handleLogout}
								className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
								Login
							</Link>
							<Link to="/signup" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700">
								Register
							</Link>
						</>
					)}
				</div>
			</nav>
		</header>
	);
}
