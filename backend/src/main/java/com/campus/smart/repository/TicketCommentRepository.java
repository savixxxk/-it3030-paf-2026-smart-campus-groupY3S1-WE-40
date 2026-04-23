package com.campus.smart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.smart.model.TicketComment;

public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {
	List<TicketComment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}

