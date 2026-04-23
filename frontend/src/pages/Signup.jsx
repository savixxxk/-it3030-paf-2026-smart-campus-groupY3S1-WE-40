import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import campusHero from "../assets/campus-real.jpg";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
	const navigate = useNavigate();
	const { register } = useAuth();

	const [form, setForm] = useState({ fullName: "", email: "", password: "" });
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
			await register(form);
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
				<div className="order-2 flex items-center justify-center px-6 py-10 md:order-1 md:px-10 md:py-14">
					<div className="w-full max-w-md fade-up">
						<p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
							Create Profile
						</p>
						<h1 className="mt-4 text-3xl font-extrabold text-white">Register</h1>
						<p className="mt-2 text-sm text-slate-300">Create your Smart Campus account.</p>

						<form onSubmit={onSubmit} className="mt-6 space-y-4">
							<div>
								<label className="mb-1 block text-sm font-medium text-slate-200">Full name</label>
								<input
									type="text"
									name="fullName"
									value={form.fullName}
									onChange={onChange}
									required
									className="w-full rounded-lg border border-slate-600 bg-slate-950/80 px-3 py-2 text-white outline-none ring-cyan-300/60 transition placeholder:text-slate-500 focus:ring"
								/>
							</div>

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
									minLength={6}
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
								{loading ? "Creating account..." : "Register"}
							</button>
						</form>

						<p className="mt-6 text-sm text-slate-300">
							Already registered?{" "}
							<Link to="/login" className="font-semibold text-cyan-200 underline">
								Login here
							</Link>
						</p>
					</div>
				</div>

				<section className="order-1 hidden md:order-2 md:block">
					<img src={campusHero} alt="Students walking in university campus" className="h-full w-full object-cover" />
				</section>
			</section>
		</main>
	);
}
