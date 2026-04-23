package com.campus.smart.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.smart.dto.BookingCreateRequest;
import com.campus.smart.dto.BookingDecisionRequest;
import com.campus.smart.dto.BookingView;
import com.campus.smart.enums.BookingStatus;
import com.campus.smart.model.Booking;
import com.campus.smart.model.Resource;
import com.campus.smart.model.Role;
import com.campus.smart.model.User;
import com.campus.smart.repository.BookingRepository;
import com.campus.smart.repository.ResourceRepository;
import com.campus.smart.repository.UserRepository;
import com.campus.smart.service.BookingService;
import com.campus.smart.service.NotificationService;
import com.campus.smart.dto.NotificationCreateRequest;
import com.campus.smart.enums.NotificationCategory;

@Service
public class BookingServiceImpl implements BookingService {

	private final BookingRepository bookingRepository;
	private final UserRepository userRepository;
	private final ResourceRepository resourceRepository;
	private final NotificationService notificationService;

	public BookingServiceImpl(
			BookingRepository bookingRepository,
			UserRepository userRepository,
			ResourceRepository resourceRepository,
			NotificationService notificationService
	) {
		this.bookingRepository = bookingRepository;
		this.userRepository = userRepository;
		this.resourceRepository = resourceRepository;
		this.notificationService = notificationService;
	}

	@Override
	@Transactional
	public BookingView createBookingRequest(BookingCreateRequest request) {
		LocalDateTime start = request.getStartTime();
		LocalDateTime end = request.getEndTime();
		validateTimeRange(start, end);

		User user = userRepository.findByEmail(request.getUserEmail())
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		Resource resource = resourceRepository.findById(request.getResourceId())
				.orElseThrow(() -> new IllegalArgumentException("Resource not found"));

		if (Boolean.FALSE.equals(resource.getAvailable())) {
			throw new IllegalArgumentException("Resource is not available");
		}

		if (bookingRepository.existsApprovedOverlap(resource.getId(), start, end)) {
			throw new IllegalArgumentException("Booking conflict: resource already booked for this time range");
		}

		Booking booking = new Booking();
		booking.setUser(user);
		booking.setResource(resource);
		booking.setStartTime(start);
		booking.setEndTime(end);
		booking.setPurpose(trimToNull(request.getPurpose()));
		booking.setExpectedAttendees(request.getExpectedAttendees());
		booking.setStatus(BookingStatus.PENDING);

		return toView(bookingRepository.save(booking));
	}

	@Override
	@Transactional(readOnly = true)
	public List<BookingView> getMyBookings(String email) {
		return bookingRepository.findAllForUser(email).stream()
				.map(this::toView)
				.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<BookingView> getAllBookings(BookingStatus status, Long resourceId, LocalDateTime from, LocalDateTime to) {
		return bookingRepository.findAllWithUserAndResource().stream()
				.filter(booking -> status == null || booking.getStatus() == status)
				.filter(booking -> resourceId == null || Objects.equals(booking.getResource().getId(), resourceId))
				.filter(booking -> from == null || !booking.getStartTime().isBefore(from))
				.filter(booking -> to == null || !booking.getEndTime().isAfter(to))
				.map(this::toView)
				.toList();
	}

	@Override
	@Transactional
	public BookingView approveBooking(Long bookingId, BookingDecisionRequest request) {
		requireAdmin(request.getAdminEmail());

		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new IllegalArgumentException("Booking not found"));

		if (booking.getStatus() != BookingStatus.PENDING) {
			throw new IllegalArgumentException("Only PENDING bookings can be approved");
		}

		// Re-check conflicts on approval
		if (bookingRepository.existsApprovedOverlap(
				booking.getResource().getId(),
				booking.getStartTime(),
				booking.getEndTime()
		)) {
			throw new IllegalArgumentException("Cannot approve: booking conflicts with an approved booking");
		}

		booking.setStatus(BookingStatus.APPROVED);
		booking.setAdminReason(trimToNull(request.getReason()));
		Booking saved = bookingRepository.save(booking);
		notifyBookingUpdate(saved, "Booking Approved", "Your booking request has been approved.");
		return toView(saved);
	}

	@Override
	@Transactional
	public BookingView rejectBooking(Long bookingId, BookingDecisionRequest request) {
		requireAdmin(request.getAdminEmail());

		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new IllegalArgumentException("Booking not found"));

		if (booking.getStatus() != BookingStatus.PENDING) {
			throw new IllegalArgumentException("Only PENDING bookings can be rejected");
		}

		String reason = trimToNull(request.getReason());
		if (reason == null) {
			throw new IllegalArgumentException("Rejection reason is required");
		}

		booking.setStatus(BookingStatus.REJECTED);
		booking.setAdminReason(reason);
		Booking saved = bookingRepository.save(booking);
		notifyBookingUpdate(saved, "Booking Rejected", "Your booking request was rejected. Reason: " + reason);
		return toView(saved);
	}

	@Override
	@Transactional
	public BookingView cancelBooking(Long bookingId, String email) {
		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new IllegalArgumentException("Booking not found"));

		if (booking.getUser() == null || booking.getUser().getEmail() == null || !booking.getUser().getEmail().equalsIgnoreCase(email)) {
			throw new IllegalArgumentException("You can only cancel your own bookings");
		}

		if (booking.getStatus() != BookingStatus.APPROVED) {
			throw new IllegalArgumentException("Only APPROVED bookings can be cancelled");
		}

		booking.setStatus(BookingStatus.CANCELLED);
		Booking saved = bookingRepository.save(booking);
		notifyBookingUpdate(saved, "Booking Cancelled", "Your booking has been cancelled.");
		return toView(saved);
	}

	private void validateTimeRange(LocalDateTime start, LocalDateTime end) {
		if (start == null || end == null) {
			throw new IllegalArgumentException("Start time and end time are required");
		}
		if (!start.isBefore(end)) {
			throw new IllegalArgumentException("Start time must be before end time");
		}
	}

	private void requireAdmin(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("Admin user not found"));
		if (user.getRole() != Role.ADMIN) {
			throw new IllegalArgumentException("Only ADMIN users can perform this action");
		}
	}

	private BookingView toView(Booking booking) {
		String userEmail = booking.getUser() != null ? booking.getUser().getEmail() : null;
		String userName = booking.getUser() != null ? booking.getUser().getName() : null;
		Long resourceId = booking.getResource() != null ? booking.getResource().getId() : null;
		String resourceName = booking.getResource() != null ? booking.getResource().getName() : null;
		String resourceLocation = booking.getResource() != null ? booking.getResource().getLocation() : null;

		return new BookingView(
				booking.getId(),
				userEmail,
				userName,
				resourceId,
				resourceName,
				resourceLocation,
				booking.getStartTime(),
				booking.getEndTime(),
				booking.getStatus(),
				booking.getPurpose(),
				booking.getExpectedAttendees(),
				booking.getAdminReason(),
				booking.getCreatedAt(),
				booking.getUpdatedAt()
		);
	}

	private void notifyBookingUpdate(Booking booking, String title, String message) {
		if (booking.getUser() == null || booking.getUser().getEmail() == null) {
			return;
		}
		NotificationCreateRequest request = new NotificationCreateRequest();
		request.setTitle(title);
		request.setMessage(message);
		request.setCategory(NotificationCategory.BOOKING_UPDATES);
		request.setTargetEmail(booking.getUser().getEmail());
		notificationService.createNotification(request);
	}

	private String trimToNull(String value) {
		if (value == null) return null;
		String trimmed = value.trim();
		return trimmed.isEmpty() ? null : trimmed;
	}
}

