package com.campus.smart.service;

import java.util.List;

import com.campus.smart.dto.BookingResponse;

public interface BookingPdfReportService {

	/**
	 * Builds a PDF document summarizing the given bookings (e.g. current user's list).
	 */
	byte[] buildMyBookingsReport(List<BookingResponse> bookings, String userEmail);
}
