import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import OAuth2Bridge from "./components/OAuth2Bridge";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminFacilities from "./pages/admin/AdminFacilities";
import AdminTickets from "./pages/admin/AdminTickets";
import StudentNotifications from "./pages/StudentNotifications";
import NotificationPreferences from "./pages/NotificationPreferences";
import Facilities from "./pages/Facilities";
import Bookings from "./pages/Bookings";
import Tickets from "./pages/Tickets";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
	return (
		<ThemeProvider>
			<BrowserRouter>
				<AuthProvider>
					<OAuth2Bridge />
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route
							path="/notifications"
							element={
								<PrivateRoute>
									<StudentNotifications />
								</PrivateRoute>
							}
						/>
						<Route
							path="/notification-preferences"
							element={
								<PrivateRoute>
									<NotificationPreferences />
								</PrivateRoute>
							}
						/>
						<Route
							path="/facilities"
							element={
								<PrivateRoute>
									<Facilities />
								</PrivateRoute>
							}
						/>
						<Route
							path="/bookings"
							element={
								<PrivateRoute>
									<Bookings />
								</PrivateRoute>
							}
						/>
						<Route
							path="/tickets"
							element={
								<PrivateRoute>
									<Tickets />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin-dashboard"
							element={
								<PrivateRoute requiredRole="ADMIN">
									<AdminLayout />
								</PrivateRoute>
							}
						>
							<Route index element={<AdminOverview />} />
							<Route path="analytics" element={<AdminAnalytics />} />
							<Route path="users" element={<AdminUsers />} />
							<Route path="notifications" element={<AdminNotifications />} />
							<Route path="bookings" element={<AdminBookings />} />
							<Route path="facilities" element={<AdminFacilities />} />
							<Route path="tickets" element={<AdminTickets />} />
						</Route>
					</Routes>
					<Footer />
				</AuthProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
}
