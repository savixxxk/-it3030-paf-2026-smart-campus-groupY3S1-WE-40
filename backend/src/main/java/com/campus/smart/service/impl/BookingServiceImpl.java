package com.campus.smart.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.smart.dto.BookingAdminDecisionRequest;
import com.campus.smart.dto.BookingCreateRequest;
import com.campus.smart.dto.BookingResponse;
import com.campus.smart.dto.NotificationCreateRequest;
import com.campus.smart.enums.BookingStatus;
import com.campus.smart.enums.NotificationCategory;
import com.campus.smart.enums.ResourceStatus;
import com.campus.smart.exception.BookingConflictException;
import com.campus.smart.exception.BookingNotFoundException;
import com.campus.smart.exception.ForbiddenOperationException;
import com.campus.smart.exception.ResourceNotFoundException;
import com.campus.smart.model.Booking;
import com.campus.smart.model.Resource;
import com.campus.smart.model.User;
import com.campus.smart.repository.BookingRepository;
import com.campus.smart.repository.ResourceRepository;
import com.campus.smart.repository.UserRepository;
import com.campus.smart.service.BookingService;
import com.campus.smart.service.NotificationService;

@Service
public class BookingServiceImpl implements BookingService {
	private final BookingRepository bookingRepository;
	private final ResourceRepository resourceRepository;
	private final UserRepository userRepository;
	private final NotificationService notificationService;

	public BookingServiceImpl(
			BookingRepository bookingRepository,
			ResourceRepository resourceRepository,
			UserRepository userRepository,
			NotificationService notificationService) {
		this.bookingRepository = bookingRepository;
		this.resourceRepository = resourceRepository;
		this.userRepository = userRepository;
		this.notificationService = notificationService;
	}

	@Override
	@Transactional
	public BookingResponse createBooking(String userEmail, BookingCreateRequest request) {
		User user = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new IllegalArgumentException("User not found for email: " + userEmail));

		Resource resource = resourceRepository.findById(request.getResourceId())
				.orElseThrow(() -> new ResourceNotFoundException(request.getResourceId()));

		validateResource(resource);
		validateTimeRange(request.getStartTime(), request.getEndTime());
		validateWithinAvailability(resource, request.getStartTime(), request.getEndTime());
		validateAttendees(resource, request.getAttendees());

		LocalDateTime start = LocalDateTime.of(request.getDate(), request.getStartTime());
		LocalDateTime end = LocalDateTime.of(request.getDate(), request.getEndTime());

		if (bookingRepository.existsApprovedOverlap(resource.getId(), start, end)) {
			throw new BookingConflictException("Requested slot conflicts with an approved booking");
		}

		Booking booking = new Booking();
		booking.setUser(user);
		booking.setResource(resource);
		booking.setStartTime(start);
		booking.setEndTime(end);
		booking.setPurpose(request.getPurpose());
		booking.setExpectedAttendees(request.getAttendees());
		booking.setStatus(BookingStatus.PENDING);

		Booking saved = bookingRepository.save(booking);
		return toResponse(saved);
	}

	@Override
	public List<BookingResponse> getMyBookings(String userEmail) {
		return bookingRepository.findByUserEmail(userEmail).stream()
				.sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
				.map(this::toResponse)
				.toList();
	}

	@Override
	public List<BookingResponse> getAllBookings(BookingStatus status, Long resourceId) {
		List<Booking> bookings;
		if (status != null && resourceId != null) {
			bookings = bookingRepository.findByResourceIdAndStatus(resourceId, status);
		} else if (status != null) {
			bookings = bookingRepository.findByStatus(status);
		} else if (resourceId != null) {
			bookings = bookingRepository.findByResourceId(resourceId);
		} else {
			bookings = bookingRepository.findAll();
		}

		return bookings.stream()
				.sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
				.map(this::toResponse)
				.toList();
	}

	@Override
	@Transactional
	public BookingResponse approve(Long bookingId) {
		Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new BookingNotFoundException(bookingId));
		if (booking.getStatus() != BookingStatus.PENDING) {
			throw new IllegalArgumentException("Only PENDING bookings can be approved");
		}

		Resource resource = booking.getResource();
		validateResource(resource);

		LocalDateTime start = booking.getStartTime();
		LocalDateTime end = booking.getEndTime();
		validateTimeRange(start.toLocalTime(), end.toLocalTime());
		validateWithinAvailability(resource, start.toLocalTime(), end.toLocalTime());
		validateAttendees(resource, booking.getExpectedAttendees());

		if (bookingRepository.existsApprovedOverlap(resource.getId(), start, end)) {
			throw new BookingConflictException("Cannot approve: slot conflicts with another approved booking");
		}

		booking.setStatus(BookingStatus.APPROVED);
		booking.setAdminResponseReason(null);
		Booking saved = bookingRepository.save(booking);

		notifyUser(saved.getUser().getEmail(), "Booking approved",
				"Your booking for " + saved.getResource().getName() + " was approved.",
				NotificationCategory.EVENTS_ACTIVITIES);

		return toResponse(saved);
	}

	@Override
	@Transactional
	public BookingResponse reject(Long bookingId, BookingAdminDecisionRequest request) {
		Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new BookingNotFoundException(bookingId));
		if (booking.getStatus() != BookingStatus.PENDING) {
			throw new IllegalArgumentException("Only PENDING bookings can be rejected");
		}

		booking.setStatus(BookingStatus.REJECTED);
		booking.setAdminResponseReason(request.getReason());
		Booking saved = bookingRepository.save(booking);

		notifyUser(saved.getUser().getEmail(), "Booking rejected",
				"Your booking for " + saved.getResource().getName() + " was rejected. Reason: " + request.getReason(),
				NotificationCategory.EVENTS_ACTIVITIES);

		return toResponse(saved);
	}

	@Override
	@Transactional
	public BookingResponse cancel(Long bookingId, String userEmail) {
		Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new BookingNotFoundException(bookingId));

		String ownerEmail = booking.getUser() != null ? booking.getUser().getEmail() : null;
		if (ownerEmail == null || !ownerEmail.equalsIgnoreCase(userEmail)) {
			throw new ForbiddenOperationException("You can only cancel your own bookings");
		}

		if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.APPROVED) {
			throw new IllegalArgumentException("Only PENDING or APPROVED bookings can be cancelled");
		}

		booking.setStatus(BookingStatus.CANCELLED);
		Booking saved = bookingRepository.save(booking);

		notifyUser(saved.getUser().getEmail(), "Booking cancelled",
				"Your booking for " + saved.getResource().getName() + " was cancelled.",
				NotificationCategory.EVENTS_ACTIVITIES);

		return toResponse(saved);
	}

	private void validateTimeRange(LocalTime start, LocalTime end) {
		if (start == null || end == null || !start.isBefore(end)) {
			throw new IllegalArgumentException("startTime must be before endTime");
		}
	}

	private void validateResource(Resource resource) {
		if (resource.getStatus() != ResourceStatus.ACTIVE) {
			throw new IllegalArgumentException("Resource is not ACTIVE");
		}
	}

	private void validateWithinAvailability(Resource resource, LocalTime start, LocalTime end) {
		LocalTime windowStart = resource.getAvailabilityStart();
		LocalTime windowEnd = resource.getAvailabilityEnd();
		if (windowStart != null && start.isBefore(windowStart)) {
			throw new IllegalArgumentException("Booking startTime is before resource availabilityStart");
		}
		if (windowEnd != null && end.isAfter(windowEnd)) {
			throw new IllegalArgumentException("Booking endTime is after resource availabilityEnd");
		}
	}

	private void validateAttendees(Resource resource, Integer attendees) {
		if (attendees == null) return;
		if (resource.getCapacity() != null && attendees > resource.getCapacity()) {
			throw new IllegalArgumentException("attendees exceeds resource capacity");
		}
	}

	private BookingResponse toResponse(Booking booking) {
		BookingResponse response = new BookingResponse();
		response.setId(booking.getId());
		response.setUserEmail(booking.getUser() != null ? booking.getUser().getEmail() : null);
		response.setResourceId(booking.getResource() != null ? booking.getResource().getId() : null);
		response.setResourceName(booking.getResource() != null ? booking.getResource().getName() : null);
		response.setPurpose(booking.getPurpose());
		response.setAttendees(booking.getExpectedAttendees());
		response.setStatus(booking.getStatus());
		response.setAdminResponseReason(booking.getAdminResponseReason());

		LocalDateTime start = booking.getStartTime();
		LocalDateTime end = booking.getEndTime();
		if (start != null) {
			response.setDate(start.toLocalDate());
			response.setStartTime(start.toLocalTime());
		}
		if (end != null) {
			response.setEndTime(end.toLocalTime());
		}

		response.setCreatedAt(booking.getCreatedAt());
		response.setUpdatedAt(booking.getUpdatedAt());
		return response;
	}

	private void notifyUser(String email, String title, String message, NotificationCategory category) {
		if (email == null || email.isBlank()) return;
		NotificationCreateRequest request = new NotificationCreateRequest();
		request.setTitle(title);
		request.setMessage(message);
		request.setCategory(category);
		notificationService.createNotification(request);
	}
}

