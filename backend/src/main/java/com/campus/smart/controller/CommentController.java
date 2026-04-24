package com.campus.smart.controller;

import java.security.Principal;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
<<<<<<< HEAD
//import org.springframework.web.bind.annotation.RequestMapping;
=======
import org.springframework.web.bind.annotation.RequestMapping;
>>>>>>> 9a15d9d30cc76ce1ec4fdad9b9da2618f67001cd
import org.springframework.web.bind.annotation.RestController;

import com.campus.smart.dto.CommentCreateRequest;
import com.campus.smart.dto.CommentResponse;
import com.campus.smart.dto.CommentUpdateRequest;
import com.campus.smart.service.TicketCommentService;

import jakarta.validation.Valid;

@RestController
public class CommentController {
	private final TicketCommentService commentService;

	public CommentController(TicketCommentService commentService) {
		this.commentService = commentService;
	}

	@PostMapping("/api/tickets/{ticketId}/comments")
	@PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
	public CommentResponse add(@PathVariable Long ticketId, @Valid @RequestBody CommentCreateRequest request, Principal principal) {
		return commentService.addComment(ticketId, principal.getName(), request);
	}

	@PutMapping("/api/comments/{commentId}")
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	public CommentResponse update(
			@PathVariable Long commentId,
			@Valid @RequestBody CommentUpdateRequest request,
			Authentication authentication) {
		boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
		return commentService.updateComment(commentId, authentication.getName(), isAdmin, request);
	}

	@DeleteMapping("/api/comments/{commentId}")
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	public void delete(@PathVariable Long commentId, Authentication authentication) {
		boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
		commentService.deleteComment(commentId, authentication.getName(), isAdmin);
	}
}

