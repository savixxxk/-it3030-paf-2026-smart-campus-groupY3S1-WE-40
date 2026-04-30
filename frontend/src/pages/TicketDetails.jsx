import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
	addTicketComment,
	deleteComment,
	getTicketById,
	updateComment,
	uploadTicketAttachments
} from "../services/ticketService";

export default function TicketDetails() {
	const { id } = useParams();
	const ticketId = Number(id);
	const { user } = useAuth();
	const myEmail = user?.email?.toLowerCase() || "";

	const [ticket, setTicket] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [comment, setComment] = useState("");
	const [uploading, setUploading] = useState(false);

	const canEditComment = (c) => (c?.userEmail || "").toLowerCase() === myEmail;

	const refresh = async () => {
		setLoading(true);
		setError("");
		try {
			const data = await getTicketById(ticketId);
			setTicket(data);
		} catch (e) {
			setError(e?.message || "Failed to load ticket");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticketId]);

	const attachments = ticket?.attachments || [];
	const comments = ticket?.comments || [];

	const remainingSlots = useMemo(() => Math.max(0, 3 - attachments.length), [attachments.length]);

	const submitComment = async (e) => {
		e.preventDefault();
		if (!comment.trim()) return;
		setError("");
		try {
			await addTicketComment(ticketId, comment.trim());
			setComment("");
			await refresh();
		} catch (err) {
			setError(err?.message || "Failed to add comment");
		}
	};

	const editComment = async (c) => {
		const next = window.prompt("Edit your comment:", c.message);
		if (!next) return;
		setError("");
		try {
			await updateComment(c.id, next);
			await refresh();
		} catch (err) {
			setError(err?.message || "Failed to update comment");
		}
	};

	const removeComment = async (c) => {
		const ok = window.confirm("Delete this comment?");
		if (!ok) return;
		setError("");
		try {
			await deleteComment(c.id);
			await refresh();
		} catch (err) {
			setError(err?.message || "Failed to delete comment");
		}
	};

	const onUpload = async (e) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;
		setUploading(true);
		setError("");
		try {
			await uploadTicketAttachments(ticketId, files.slice(0, remainingSlots));
			e.target.value = "";
			await refresh();
		} catch (err) {
			setError(err?.message || "Upload failed");
		} finally {
			setUploading(false);
		}
	};

	return (
		<main className="min-h-[calc(100vh-73px)] bg-slate-950 text-slate-100">
			<section className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
				<div className="flex items-center justify-between">
					<Link to="/my-tickets" className="text-sm font-semibold text-cyan-200 hover:text-cyan-100">
						← Back to My Tickets
					</Link>
					<button
						type="button"
						onClick={refresh}
						className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
					>
						Refresh
					</button>
				</div>

				{error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					{loading || !ticket ? (
						<p className="text-sm text-slate-400">Loading ticket…</p>
					) : (
						<>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
								<div>
									<h1 className="text-2xl font-black text-white">Ticket #{ticket.id}</h1>
									<p className="mt-2 text-sm text-slate-300">
										<span className="font-semibold text-white">{ticket.resourceName}</span> · {ticket.category} · {ticket.priority}
									</p>
								</div>
								<span className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold">
									{ticket.status}
								</span>
							</div>

							<div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-sm text-slate-200">
								<p className="whitespace-pre-wrap">{ticket.description}</p>
							</div>

							<div className="mt-4 grid gap-3 sm:grid-cols-2">
								<div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
									<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Assigned technician</p>
									<p className="mt-2 text-sm text-white">{ticket.assignedTechnicianEmail || "Not assigned"}</p>
								</div>
								<div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
									<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resolution notes</p>
									<p className="mt-2 text-sm text-white">{ticket.resolutionNotes || "—"}</p>
								</div>
							</div>
						</>
					)}
				</div>

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-black text-white">Attachments</h2>
						<span className="text-xs text-slate-400">{attachments.length}/3</span>
					</div>

					<div className="mt-4 grid gap-3 sm:grid-cols-2">
						{attachments.length === 0 ? <p className="text-sm text-slate-400">No attachments yet.</p> : null}
						{attachments.map((p) => (
							<div key={p} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
								<p className="break-all text-xs text-slate-300">{p}</p>
							</div>
						))}
					</div>

					<div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-xs text-slate-400">Upload up to {remainingSlots} more image(s).</p>
						<input
							disabled={uploading || remainingSlots === 0}
							type="file"
							multiple
							accept="image/png,image/jpeg,image/webp"
							onChange={onUpload}
							className="text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-bold file:text-slate-950 hover:file:bg-cyan-300 disabled:opacity-50"
						/>
					</div>
				</div>

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-black text-white">Comments</h2>
						<span className="text-xs text-slate-400">{comments.length}</span>
					</div>

					<form onSubmit={submitComment} className="mt-4 flex flex-col gap-3 sm:flex-row">
						<input
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder="Write a comment..."
							className="flex-1 rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
						/>
						<button className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300" type="submit">
							Add
						</button>
					</form>

					<div className="mt-4 space-y-3">
						{comments.length === 0 ? <p className="text-sm text-slate-400">No comments yet.</p> : null}
						{comments.map((c) => (
							<div key={c.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<p className="text-xs text-slate-400">{c.userEmail}</p>
									{canEditComment(c) ? (
										<div className="flex items-center gap-2">
											<button
												type="button"
												onClick={() => editComment(c)}
												className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
											>
												Edit
											</button>
											<button
												type="button"
												onClick={() => removeComment(c)}
												className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/20"
											>
												Delete
											</button>
										</div>
									) : null}
								</div>
								<p className="mt-2 whitespace-pre-wrap text-sm text-slate-100">{c.message}</p>
								{c.createdAt ? <p className="mt-2 text-xs text-slate-500">{c.createdAt}</p> : null}
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}

