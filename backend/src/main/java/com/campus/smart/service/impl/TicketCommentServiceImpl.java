package com.campus.smart.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.smart.dto.CommentCreateRequest;
import com.campus.smart.dto.CommentResponse;
import com.campus.smart.dto.CommentUpdateRequest;
import com.campus.smart.enums.NotificationCategory;
import com.campus.smart.exception.CommentNotFoundException;
import com.campus.smart.exception.ForbiddenOperationException;
import com.campus.smart.exception.TicketNotFoundException;
import com.campus.smart.model.Ticket;
import com.campus.smart.model.TicketComment;
import com.campus.smart.model.User;
import com.campus.smart.repository.TicketCommentRepository;
import com.campus.smart.repository.TicketRepository;
import com.campus.smart.repository.UserRepository;
import com.campus.smart.service.NotificationService;
import com.campus.smart.service.TicketCommentService;

@Service
public class TicketCommentServiceImpl implements TicketCommentService {
	private final TicketRepository ticketRepository;
	private final TicketCommentRepository commentRepository;
	private final UserRepository userRepository;
	private final NotificationService notificationService;

	public TicketCommentServiceImpl(
			TicketRepository ticketRepository,
			TicketCommentRepository commentRepository,
			UserRepository userRepository,
			NotificationService notificationService) {
		this.ticketRepository = ticketRepository;
		this.commentRepository = commentRepository;
		this.userRepository = userRepository;
		this.notificationService = notificationService;
	}

	@Override
	@Transactional
	public CommentResponse addComment(Long ticketId, String userEmail, CommentCreateRequest request) {
		Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId));
		User user = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new IllegalArgumentException("User not found for email: " + userEmail));

		TicketComment comment = new TicketComment();
		comment.setTicket(ticket);
		comment.setUser(user);
		comment.setMessage(request.getMessage().trim());
		TicketComment saved = commentRepository.save(comment);

		// Notify ticket owner when someone comments
		String ownerEmail = ticket.getCreatedBy() != null ? ticket.getCreatedBy().getEmail() : null;
		if (ownerEmail != null && !ownerEmail.equalsIgnoreCase(userEmail)) {
			var n = new com.campus.smart.dto.NotificationCreateRequest();
			n.setTitle("New ticket comment");
			n.setMessage("A new comment was added to your ticket #" + ticket.getId());
			n.setCategory(NotificationCategory.MAINTENANCE_ALERTS);
			notificationService.createNotification(n);
		}

		return toResponse(saved);
	}

	@Override
	@Transactional
	public CommentResponse updateComment(Long commentId, String userEmail, boolean isAdmin, CommentUpdateRequest request) {
		TicketComment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));
		String ownerEmail = comment.getUser() != null ? comment.getUser().getEmail() : null;
		if (!isAdmin && (ownerEmail == null || !ownerEmail.equalsIgnoreCase(userEmail))) {
			throw new ForbiddenOperationException("You can only edit your own comments");
		}
		comment.setMessage(request.getMessage().trim());
		return toResponse(commentRepository.save(comment));
	}

	@Override
	@Transactional
	public void deleteComment(Long commentId, String userEmail, boolean isAdmin) {
		TicketComment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));
		String ownerEmail = comment.getUser() != null ? comment.getUser().getEmail() : null;
		if (!isAdmin && (ownerEmail == null || !ownerEmail.equalsIgnoreCase(userEmail))) {
			throw new ForbiddenOperationException("You can only delete your own comments");
		}
		commentRepository.delete(comment);
	}

	@Override
	public List<CommentResponse> listByTicket(Long ticketId) {
		return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream().map(this::toResponse).toList();
	}

	private CommentResponse toResponse(TicketComment comment) {
		CommentResponse response = new CommentResponse();
		response.setId(comment.getId());
		response.setTicketId(comment.getTicket() != null ? comment.getTicket().getId() : null);
		response.setUserEmail(comment.getUser() != null ? comment.getUser().getEmail() : null);
		response.setMessage(comment.getMessage());
		response.setCreatedAt(comment.getCreatedAt());
		return response;
	}
}

