package com.campus.smart.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.smart.dto.NotificationCreateRequest;
import com.campus.smart.enums.BookingStatus;
import com.campus.smart.enums.NotificationCategory;
import com.campus.smart.enums.NotificationPriority;
import com.campus.smart.enums.TicketStatus;
import com.campus.smart.model.Booking;
import com.campus.smart.model.Ticket;
import com.campus.smart.repository.BookingRepository;
import com.campus.smart.repository.NotificationRepository;
import com.campus.smart.repository.TicketRepository;
import com.campus.smart.service.NotificationService;

@Service
public class NotificationSchedulerService {

	private final BookingRepository bookingRepository;
	private final TicketRepository ticketRepository;
	private final NotificationRepository notificationRepository;
	private final NotificationService notificationService;

	public NotificationSchedulerService(
			BookingRepository bookingRepository,
			TicketRepository ticketRepository,
			NotificationRepository notificationRepository,
			NotificationService notificationService) {
		this.bookingRepository = bookingRepository;
		this.ticketRepository = ticketRepository;
		this.notificationRepository = notificationRepository;
		this.notificationService = notificationService;
	}

	@Scheduled(fixedDelay = 300000)
	@Transactional
	public void publishReminders() {
		publishBookingReminders();
		publishTicketFollowUps();
	}

	private void publishBookingReminders() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime windowStart = now.plusMinutes(28);
		LocalDateTime windowEnd = now.plusMinutes(32);

		List<Booking> upcomingBookings = bookingRepository.findByStatusAndStartTimeBetween(BookingStatus.APPROVED, windowStart, windowEnd);
		for (Booking booking : upcomingBookings) {
			if (booking.getUser() == null || booking.getUser().getEmail() == null) {
				continue;
			}

			String sourceKey = "booking-reminder-" + booking.getId();
			if (notificationRepository.existsBySourceKey(sourceKey)) {
				continue;
			}

			NotificationCreateRequest request = new NotificationCreateRequest();
			request.setTitle("Booking reminder");
			request.setMessage("Your lab booking starts in 30 minutes for " + booking.getResource().getName() + ".");
			request.setCategory(NotificationCategory.REMINDERS);
			request.setPriority(NotificationPriority.HIGH);
			notificationService.createNotification(request, sourceKey);
		}
	}

	private void publishTicketFollowUps() {
		LocalDateTime threshold = LocalDateTime.now().minusDays(3);
		List<Ticket> staleTickets = ticketRepository.findByStatusAndCreatedAtLessThanEqual(TicketStatus.OPEN, threshold);
		for (Ticket ticket : staleTickets) {
			if (ticket.getCreatedBy() == null || ticket.getCreatedBy().getEmail() == null) {
				continue;
			}

			String sourceKey = "ticket-follow-up-" + ticket.getId();
			if (notificationRepository.existsBySourceKey(sourceKey)) {
				continue;
			}

			NotificationCreateRequest request = new NotificationCreateRequest();
			request.setTitle("Ticket follow-up");
			request.setMessage("Your issue is still OPEN for 3 days. Ticket #" + ticket.getId() + " needs attention.");
			request.setCategory(NotificationCategory.REMINDERS);
			request.setPriority(NotificationPriority.MEDIUM);
			notificationService.createNotification(request, sourceKey);
		}
	}
}