package com.campus.smart.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campus.smart.dto.BookingCreateRequest;
import com.campus.smart.dto.BookingDecisionRequest;
import com.campus.smart.dto.BookingView;
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
	public BookingView create(@Valid @RequestBody BookingCreateRequest request) {
		return bookingService.createBookingRequest(request);
	}

	@GetMapping("/my")
	public List<BookingView> myBookings(@RequestParam String email) {
		return bookingService.getMyBookings(email);
	}

	@GetMapping
	public List<BookingView> allBookings(
			@RequestParam(required = false) BookingStatus status,
			@RequestParam(required = false) Long resourceId,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
	) {
		return bookingService.getAllBookings(status, resourceId, from, to);
	}

	@PutMapping("/{bookingId}/approve")
	public BookingView approve(@PathVariable Long bookingId, @Valid @RequestBody BookingDecisionRequest request) {
		return bookingService.approveBooking(bookingId, request);
	}

	@PutMapping("/{bookingId}/reject")
	public BookingView reject(@PathVariable Long bookingId, @Valid @RequestBody BookingDecisionRequest request) {
		return bookingService.rejectBooking(bookingId, request);
	}

	@PutMapping("/{bookingId}/cancel")
	public BookingView cancel(@PathVariable Long bookingId, @RequestParam String email) {
		return bookingService.cancelBooking(bookingId, email);
	}
}

