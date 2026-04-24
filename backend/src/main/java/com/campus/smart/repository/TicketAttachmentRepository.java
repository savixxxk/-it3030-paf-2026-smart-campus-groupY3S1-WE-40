package com.campus.smart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.smart.model.TicketAttachment;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {
	List<TicketAttachment> findByTicketId(Long ticketId);

	long countByTicketId(Long ticketId);
}

