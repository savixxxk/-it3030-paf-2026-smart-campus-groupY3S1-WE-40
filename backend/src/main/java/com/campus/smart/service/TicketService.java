package com.campus.smart.service;

import java.util.List;

import com.campus.smart.dto.TicketAssignRequest;
import com.campus.smart.dto.TicketCreateRequest;
import com.campus.smart.dto.TicketRejectRequest;
import com.campus.smart.dto.TicketResolveRequest;
import com.campus.smart.dto.TicketResponse;
import com.campus.smart.dto.TicketStatusUpdateRequest;
import com.campus.smart.enums.TicketCategory;
import com.campus.smart.enums.TicketPriority;
import com.campus.smart.enums.TicketStatus;

public interface TicketService {
	TicketResponse create(String userEmail, TicketCreateRequest request);

	List<TicketResponse> myTickets(String userEmail);

	List<TicketResponse> adminSearch(TicketStatus status, TicketPriority priority, TicketCategory category, Long resourceId);

	TicketResponse getByIdForUser(Long ticketId, String userEmail);

	TicketResponse getByIdForStaff(Long ticketId);

	TicketResponse assign(Long ticketId, TicketAssignRequest request);

	TicketResponse reject(Long ticketId, TicketRejectRequest request);

	TicketResponse updateStatus(Long ticketId, TicketStatusUpdateRequest request);

	TicketResponse resolve(Long ticketId, TicketResolveRequest request);

	TicketResponse close(Long ticketId);
}

