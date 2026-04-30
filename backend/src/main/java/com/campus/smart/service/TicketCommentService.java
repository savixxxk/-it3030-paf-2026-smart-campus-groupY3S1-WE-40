package com.campus.smart.service;

import java.util.List;

import com.campus.smart.dto.CommentCreateRequest;
import com.campus.smart.dto.CommentResponse;
import com.campus.smart.dto.CommentUpdateRequest;

public interface TicketCommentService {
	CommentResponse addComment(Long ticketId, String userEmail, CommentCreateRequest request);

	CommentResponse updateComment(Long commentId, String userEmail, boolean isAdmin, CommentUpdateRequest request);

	void deleteComment(Long commentId, String userEmail, boolean isAdmin);

	List<CommentResponse> listByTicket(Long ticketId);
}

