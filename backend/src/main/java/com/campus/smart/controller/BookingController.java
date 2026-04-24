package com.campus.smart.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campus.smart.dto.BookingAdminDecisionRequest;
import com.campus.smart.dto.BookingCreateRequest;
import com.campus.smart.dto.BookingResponse;
import com.campus.smart.enums.BookingStatus;
import com.campus.smart.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
	private final BookingService bookingService;

	public BookingController(BookingService bookingService) {
		this.bookingService = bookingService;
	}

	@PostMapping
	@PreAuthorize("hasRole('USER')")
	public BookingResponse create(@Valid @RequestBody BookingCreateRequest request, Principal principal) {
		return bookingService.createBooking(principal.getName(), request);
	}

	@GetMapping("/my")
	@PreAuthorize("hasRole('USER')")
	public List<BookingResponse> myBookings(Principal principal) {
		return bookingService.getMyBookings(principal.getName());
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<BookingResponse> allBookings(
			@RequestParam(required = false) BookingStatus status,
			@RequestParam(required = false) Long resourceId) {
		return bookingService.getAllBookings(status, resourceId);
	}

	@PutMapping("/{id}/approve")
	@PreAuthorize("hasRole('ADMIN')")
	public BookingResponse approve(@PathVariable Long id) {
		return bookingService.approve(id);
	}

	@PutMapping("/{id}/reject")
	@PreAuthorize("hasRole('ADMIN')")
	public BookingResponse reject(@PathVariable Long id, @Valid @RequestBody BookingAdminDecisionRequest request) {
		return bookingService.reject(id, request);
	}

	@PutMapping("/{id}/cancel")
	@PreAuthorize("hasRole('USER')")
	public BookingResponse cancel(@PathVariable Long id, Principal principal) {
		return bookingService.cancel(id, principal.getName());
	}
}

