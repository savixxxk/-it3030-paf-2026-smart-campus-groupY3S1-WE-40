import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import campusHero from "../assets/campus-real.jpg";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [form, setForm] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const onChange = (event) => {
		setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setLoading(true);
		try {
			await login(form);
			navigate("/");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-slate-950 px-6 py-12 text-slate-100">
			<div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl floating-blob" />
			<div className="pointer-events-none absolute -right-16 bottom-8 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl floating-blob floating-blob-delay" />

			<section className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-slate-900/60 shadow-[0_30px_80px_-30px_rgba(34,211,238,0.45)] backdrop-blur md:grid-cols-2">
				<div className="hidden md:block">
					<img src={campusHero} alt="Students in campus library" className="h-full w-full object-cover" />
				</div>

				<div className="flex items-center justify-center px-6 py-10 md:px-10 md:py-14">
					<div className="w-full max-w-md fade-up">
						<p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
							Secure Access
						</p>
						<h1 className="mt-4 text-3xl font-extrabold text-white">Login</h1>
						<p className="mt-2 text-sm text-slate-300">Welcome back to Smart Campus.</p>

						<form onSubmit={onSubmit} className="mt-6 space-y-4">
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-200">Email</label>
							<input
								type="email"
								name="email"
								value={form.email}
								onChange={onChange}
								required
								className="w-full rounded-lg border border-slate-600 bg-slate-950/80 px-3 py-2 text-white outline-none ring-cyan-300/60 transition placeholder:text-slate-500 focus:ring"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-slate-200">Password</label>
							<input
								type="password"
								name="password"
								value={form.password}
								onChange={onChange}
								required
								className="w-full rounded-lg border border-slate-600 bg-slate-950/80 px-3 py-2 text-white outline-none ring-cyan-300/60 transition placeholder:text-slate-500 focus:ring"
							/>
						</div>

						{error ? <p className="text-sm text-red-600">{error}</p> : null}

						<button
							type="submit"
							disabled={loading}
							className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{loading ? "Logging in..." : "Login"}
						</button>

						<a
							href={`${API_BASE}/oauth2/authorization/google`}
							className="flex w-full items-center justify-center rounded-lg border border-slate-600 bg-slate-950/60 px-4 py-2 font-semibold text-white transition hover:border-cyan-300 hover:bg-slate-900"
						>
							Continue with Google
						</a>
						</form>

						<p className="mt-6 text-sm text-slate-300">
						New user?{" "}
						<Link to="/signup" className="font-semibold text-cyan-200 underline">
							Create an account
						</Link>
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
