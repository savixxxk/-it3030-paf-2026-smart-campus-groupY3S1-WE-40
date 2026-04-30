package com.campus.smart.service.impl;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.smart.dto.CommentResponse;
import com.campus.smart.dto.TicketAssignRequest;
import com.campus.smart.dto.TicketCreateRequest;
import com.campus.smart.dto.TicketRejectRequest;
import com.campus.smart.dto.TicketResolveRequest;
import com.campus.smart.dto.TicketResponse;
import com.campus.smart.dto.TicketStatusUpdateRequest;
import com.campus.smart.enums.NotificationCategory;
import com.campus.smart.enums.TicketCategory;
import com.campus.smart.enums.TicketPriority;
import com.campus.smart.enums.TicketStatus;
import com.campus.smart.exception.ForbiddenOperationException;
import com.campus.smart.exception.InvalidStatusTransitionException;
import com.campus.smart.exception.ResourceNotFoundException;
import com.campus.smart.exception.TicketNotFoundException;
import com.campus.smart.model.Resource;
import com.campus.smart.model.Ticket;
import com.campus.smart.model.User;
import com.campus.smart.repository.ResourceRepository;
import com.campus.smart.repository.TicketAttachmentRepository;
import com.campus.smart.repository.TicketCommentRepository;
import com.campus.smart.repository.TicketRepository;
import com.campus.smart.repository.UserRepository;
import com.campus.smart.repository.spec.TicketSpecifications;
import com.campus.smart.service.NotificationService;
import com.campus.smart.service.TicketService;

@Service
public class TicketServiceImpl implements TicketService {
	private final TicketRepository ticketRepository;
	private final ResourceRepository resourceRepository;
	private final UserRepository userRepository;
	private final TicketAttachmentRepository attachmentRepository;
	private final TicketCommentRepository commentRepository;
	private final NotificationService notificationService;

	public TicketServiceImpl(
			TicketRepository ticketRepository,
			ResourceRepository resourceRepository,
			UserRepository userRepository,
			TicketAttachmentRepository attachmentRepository,
			TicketCommentRepository commentRepository,
			NotificationService notificationService) {
		this.ticketRepository = ticketRepository;
		this.resourceRepository = resourceRepository;
		this.userRepository = userRepository;
		this.attachmentRepository = attachmentRepository;
		this.commentRepository = commentRepository;
		this.notificationService = notificationService;
	}

	@Override
	@Transactional
	public TicketResponse create(String userEmail, TicketCreateRequest request) {
		User user = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new IllegalArgumentException("User not found for email: " + userEmail));

		Resource resource = resourceRepository.findById(request.getResourceId())
				.orElseThrow(() -> new ResourceNotFoundException(request.getResourceId()));

		Ticket ticket = new Ticket();
		ticket.setCreatedBy(user);
		ticket.setResource(resource);
		ticket.setCategory(request.getCategory());
		ticket.setPriority(request.getPriority());
		ticket.setDescription(request.getDescription().trim());
		ticket.setStatus(TicketStatus.OPEN);
		Ticket saved = ticketRepository.save(ticket);

		notifyUser(userEmail, "Ticket created", "Your ticket #" + saved.getId() + " has been created.");

		return toResponse(saved);
	}

	@Override
	public List<TicketResponse> myTickets(String userEmail) {
		return ticketRepository.findByCreatedByEmailOrderByCreatedAtDesc(userEmail).stream()
				.map(this::toResponse)
				.toList();
	}

	@Override
	public List<TicketResponse> adminSearch(TicketStatus status, TicketPriority priority, TicketCategory category, Long resourceId) {
		Specification<Ticket> spec = Specification.where(TicketSpecifications.hasStatus(status))
				.and(TicketSpecifications.hasPriority(priority))
				.and(TicketSpecifications.hasCategory(category))
				.and(TicketSpecifications.hasResourceId(resourceId));
		return ticketRepository.findAll(spec).stream().map(this::toResponse).toList();
	}

	@Override
	public TicketResponse getByIdForUser(Long ticketId, String userEmail) {
		Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId));
		String owner = ticket.getCreatedBy() != null ? ticket.getCreatedBy().getEmail() : null;
		if (owner == null || !owner.equalsIgnoreCase(userEmail)) {
			throw new ForbiddenOperationException("You can only view your own tickets");
		}
		return toResponse(ticket);
	}

	@Override
	public TicketResponse getByIdForStaff(Long ticketId) {
		return toResponse(ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId)));
	}

	@Override
	@Transactional
	public TicketResponse assign(Long ticketId, TicketAssignRequest request) {
		Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId));
		User technician = userRepository.findByEmail(request.getTechnicianEmail())
				.orElseThrow(() -> new IllegalArgumentException("Technician not found"));

		ticket.setAssignedTechnician(technician);
		if (ticket.getStatus() == TicketStatus.OPEN) {
			ticket.setStatus(TicketStatus.IN_PROGRESS);
		}
		Ticket saved = ticketRepository.save(ticket);

		String ownerEmail = saved.getCreatedBy() != null ? saved.getCreatedBy().getEmail() : null;
		notifyUser(ownerEmail, "Ticket assigned", "Your ticket #" + saved.getId() + " was assigned to a technician.");

		return toResponse(saved);
	}

	@Override
	@Transactional
	public TicketResponse reject(Long ticketId, TicketRejectRequest request) {
		Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId));
		ensureTransition(ticket.getStatus(), TicketStatus.REJECTED);
		ticket.setStatus(TicketStatus.REJECTED);
		ticket.setRejectReason(request.getReason().trim());
		Ticket saved = ticketRepository.save(ticket);

		String ownerEmail = saved.getCreatedBy() != null ? saved.getCreatedBy().getEmail() : null;
		notifyUser(ownerEmail, "Ticket rejected", "Your ticket #" + saved.getId() + " was rejected. Reason: " + request.getReason());

		return toResponse(saved);
	}

	@Override
	@Transactional
	public TicketResponse updateStatus(Long ticketId, TicketStatusUpdateRequest request) {
		Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId));
		ensureTransition(ticket.getStatus(), request.getStatus());
		ticket.setStatus(request.getStatus());
		Ticket saved = ticketRepository.save(ticket);

		String ownerEmail = saved.getCreatedBy() != null ? saved.getCreatedBy().getEmail() : null;
		notifyUser(ownerEmail, "Ticket status updated", "Ticket #" + saved.getId() + " is now " + saved.getStatus());

		return toResponse(saved);
	}

	@Override
	@Transactional
	public TicketResponse resolve(Long ticketId, TicketResolveRequest request) {
		Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId));
		ensureTransition(ticket.getStatus(), TicketStatus.RESOLVED);
		ticket.setStatus(TicketStatus.RESOLVED);
		ticket.setResolutionNotes(request.getResolutionNotes().trim());
		Ticket saved = ticketRepository.save(ticket);

		String ownerEmail = saved.getCreatedBy() != null ? saved.getCreatedBy().getEmail() : null;
		notifyUser(ownerEmail, "Ticket resolved", "Your ticket #" + saved.getId() + " was resolved.");

		return toResponse(saved);
	}

	@Override
	@Transactional
	public TicketResponse close(Long ticketId) {
		Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId));
		ensureTransition(ticket.getStatus(), TicketStatus.CLOSED);
		ticket.setStatus(TicketStatus.CLOSED);
		Ticket saved = ticketRepository.save(ticket);

		String ownerEmail = saved.getCreatedBy() != null ? saved.getCreatedBy().getEmail() : null;
		notifyUser(ownerEmail, "Ticket closed", "Your ticket #" + saved.getId() + " was closed.");

		return toResponse(saved);
	}

	private void ensureTransition(TicketStatus from, TicketStatus to) {
		if (from == null || to == null) {
			throw new InvalidStatusTransitionException("Invalid status transition");
		}
		if (from == TicketStatus.CLOSED) {
			throw new InvalidStatusTransitionException("CLOSED tickets cannot be changed");
		}
		if (from == TicketStatus.REJECTED) {
			throw new InvalidStatusTransitionException("REJECTED tickets cannot be changed");
		}
		switch (to) {
			case IN_PROGRESS -> {
				if (from != TicketStatus.OPEN && from != TicketStatus.IN_PROGRESS) {
					throw new InvalidStatusTransitionException("Only OPEN tickets can be moved to IN_PROGRESS");
				}
			}
			case RESOLVED -> {
				if (from != TicketStatus.IN_PROGRESS) {
					throw new InvalidStatusTransitionException("Only IN_PROGRESS tickets can be resolved");
				}
			}
			case CLOSED -> {
				if (from != TicketStatus.RESOLVED) {
					throw new InvalidStatusTransitionException("Only RESOLVED tickets can be closed");
				}
			}
			case REJECTED -> {
				if (from != TicketStatus.OPEN) {
					throw new InvalidStatusTransitionException("Only OPEN tickets can be rejected");
				}
			}
			case OPEN -> throw new InvalidStatusTransitionException("Cannot transition back to OPEN");
		}
	}

	private TicketResponse toResponse(Ticket ticket) {
		TicketResponse response = new TicketResponse();
		response.setId(ticket.getId());
		response.setResourceId(ticket.getResource() != null ? ticket.getResource().getId() : null);
		response.setResourceName(ticket.getResource() != null ? ticket.getResource().getName() : null);
		response.setCreatedByEmail(ticket.getCreatedBy() != null ? ticket.getCreatedBy().getEmail() : null);
		response.setCategory(ticket.getCategory());
		response.setPriority(ticket.getPriority());
		response.setStatus(ticket.getStatus());
		response.setDescription(ticket.getDescription());
		response.setAssignedTechnicianEmail(ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getEmail() : null);
		response.setResolutionNotes(ticket.getResolutionNotes());
		response.setRejectReason(ticket.getRejectReason());
		response.setCreatedAt(ticket.getCreatedAt());
		response.setUpdatedAt(ticket.getUpdatedAt());

		response.setAttachments(attachmentRepository.findByTicketId(ticket.getId()).stream().map(a -> a.getFilePath()).toList());
		response.setComments(commentRepository.findByTicketIdOrderByCreatedAtAsc(ticket.getId()).stream()
				.map(c -> {
					CommentResponse cr = new CommentResponse();
					cr.setId(c.getId());
					cr.setTicketId(ticket.getId());
					cr.setUserEmail(c.getUser() != null ? c.getUser().getEmail() : null);
					cr.setMessage(c.getMessage());
					cr.setCreatedAt(c.getCreatedAt());
					return cr;
				}).toList());

		return response;
	}

	private void notifyUser(String email, String title, String message) {
		if (email == null || email.isBlank()) return;
		var n = new com.campus.smart.dto.NotificationCreateRequest();
		n.setTitle(title);
		n.setMessage(message);
		n.setCategory(NotificationCategory.MAINTENANCE_ALERTS);
		notificationService.createNotification(n);
	}
}

