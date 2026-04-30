package com.campus.smart.service;

import java.util.List;

import com.campus.smart.dto.BookingAdminDecisionRequest;
import com.campus.smart.dto.BookingCreateRequest;
import com.campus.smart.dto.BookingResponse;
import com.campus.smart.enums.BookingStatus;

public interface BookingService {
	BookingResponse createBooking(String userEmail, BookingCreateRequest request);

	List<BookingResponse> getMyBookings(String userEmail);

	List<BookingResponse> getAllBookings(BookingStatus status, Long resourceId);

	BookingResponse approve(Long bookingId);

	BookingResponse reject(Long bookingId, BookingAdminDecisionRequest request);

	BookingResponse cancel(Long bookingId, String userEmail);
}

