package com.campus.smart.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campus.smart.dto.TicketAssignRequest;
import com.campus.smart.dto.TicketCreateRequest;
import com.campus.smart.dto.TicketRejectRequest;
import com.campus.smart.dto.TicketResolveRequest;
import com.campus.smart.dto.TicketResponse;
import com.campus.smart.dto.TicketStatusUpdateRequest;
import com.campus.smart.enums.TicketCategory;
import com.campus.smart.enums.TicketPriority;
import com.campus.smart.enums.TicketStatus;
import com.campus.smart.service.TicketService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
	private final TicketService ticketService;

	public TicketController(TicketService ticketService) {
		this.ticketService = ticketService;
	}

	@PostMapping
	@PreAuthorize("hasRole('USER')")
	public TicketResponse create(@Valid @RequestBody TicketCreateRequest request, Principal principal) {
		return ticketService.create(principal.getName(), request);
	}

	@GetMapping("/my")
	@PreAuthorize("hasRole('USER')")
	public List<TicketResponse> myTickets(Principal principal) {
		return ticketService.myTickets(principal.getName());
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<TicketResponse> adminTickets(
			@RequestParam(required = false) TicketStatus status,
			@RequestParam(required = false) TicketPriority priority,
			@RequestParam(required = false) TicketCategory category,
			@RequestParam(required = false) Long resourceId) {
		return ticketService.adminSearch(status, priority, category, resourceId);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN','USER')")
	public TicketResponse details(@PathVariable Long id, Authentication authentication) {
		boolean isUserOnly = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USER"))
				&& authentication.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_TECHNICIAN"));
		if (isUserOnly) {
			return ticketService.getByIdForUser(id, authentication.getName());
		}
		return ticketService.getByIdForStaff(id);
	}

	@PutMapping("/{id}/assign")
	@PreAuthorize("hasRole('ADMIN')")
	public TicketResponse assign(@PathVariable Long id, @Valid @RequestBody TicketAssignRequest request) {
		return ticketService.assign(id, request);
	}

	@PutMapping("/{id}/reject")
	@PreAuthorize("hasRole('ADMIN')")
	public TicketResponse reject(@PathVariable Long id, @Valid @RequestBody TicketRejectRequest request) {
		return ticketService.reject(id, request);
	}

	@PutMapping("/{id}/status")
	@PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
	public TicketResponse updateStatus(@PathVariable Long id, @Valid @RequestBody TicketStatusUpdateRequest request) {
		return ticketService.updateStatus(id, request);
	}

	@PutMapping("/{id}/resolve")
	@PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
	public TicketResponse resolve(@PathVariable Long id, @Valid @RequestBody TicketResolveRequest request) {
		return ticketService.resolve(id, request);
	}

	@PutMapping("/{id}/close")
	@PreAuthorize("hasRole('ADMIN')")
	public TicketResponse close(@PathVariable Long id) {
		return ticketService.close(id);
	}
}

