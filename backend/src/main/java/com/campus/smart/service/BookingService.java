package com.campus.smart.service;

import java.time.LocalDateTime;
import java.util.List;

import com.campus.smart.dto.BookingCreateRequest;
import com.campus.smart.dto.BookingDecisionRequest;
import com.campus.smart.dto.BookingView;
import com.campus.smart.enums.BookingStatus;

public interface BookingService {
	BookingView createBookingRequest(BookingCreateRequest request);

	List<BookingView> getMyBookings(String email);

	List<BookingView> getAllBookings(BookingStatus status, Long resourceId, LocalDateTime from, LocalDateTime to);

	BookingView approveBooking(Long bookingId, BookingDecisionRequest request);

	BookingView rejectBooking(Long bookingId, BookingDecisionRequest request);

	BookingView cancelBooking(Long bookingId, String email);
}

