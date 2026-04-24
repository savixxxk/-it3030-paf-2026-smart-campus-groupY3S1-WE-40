import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
	const { isAuthenticated, user, logout } = useAuth();

	return (
		<header className="border-b border-slate-200 bg-white/90 backdrop-blur">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
					Smart Campus
				</Link>

				<div className="flex items-center gap-3">
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
<<<<<<< HEAD
								<Link to="/notifications" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
									Notifications
								</Link>
=======
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
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
							)}
							<span className="hidden text-sm text-slate-600 md:block">{user?.fullName}</span>
							<button
								onClick={logout}
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
