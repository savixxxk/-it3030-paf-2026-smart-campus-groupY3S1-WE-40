package com.campus.smart.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.campus.smart.enums.BookingStatus;
import com.campus.smart.enums.NotificationCategory;
import com.campus.smart.enums.NotificationPriority;
import com.campus.smart.enums.ResourceStatus;
import com.campus.smart.enums.ResourceType;
import com.campus.smart.enums.TicketCategory;
import com.campus.smart.enums.TicketPriority;
import com.campus.smart.enums.TicketStatus;
import com.campus.smart.model.Booking;
import com.campus.smart.model.Notification;
import com.campus.smart.model.Resource;
import com.campus.smart.model.Role;
import com.campus.smart.model.Ticket;
import com.campus.smart.model.User;
import com.campus.smart.repository.BookingRepository;
import com.campus.smart.repository.NotificationRepository;
import com.campus.smart.repository.ResourceRepository;
import com.campus.smart.repository.TicketRepository;
import com.campus.smart.repository.UserRepository;

@Component
public class DevDataSeeder implements ApplicationRunner {

	private final ResourceRepository resourceRepository;
	private final NotificationRepository notificationRepository;
	private final BookingRepository bookingRepository;
	private final TicketRepository ticketRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Value("${app.seed.enabled:true}")
	private boolean seedEnabled;

	public DevDataSeeder(
			ResourceRepository resourceRepository,
			NotificationRepository notificationRepository,
			BookingRepository bookingRepository,
			TicketRepository ticketRepository,
			UserRepository userRepository,
			PasswordEncoder passwordEncoder) {
		this.resourceRepository = resourceRepository;
		this.notificationRepository = notificationRepository;
		this.bookingRepository = bookingRepository;
		this.ticketRepository = ticketRepository;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(ApplicationArguments args) {
		if (!seedEnabled) {
			return;
		}

		User student = ensureStudentUser();
		Resource hall = ensureResources();
		ensureNotifications();
		ensureBookings(student, hall);
		ensureTicket(student, hall);
	}

	private User ensureStudentUser() {
		User existing = userRepository.findByEmail("student1@campus.local").orElse(null);
		if (existing != null) {
			return existing;
		}

		User user = new User();
		user.setName("Student One");
		user.setEmail("student1@campus.local");
		user.setPassword(passwordEncoder.encode("Student@123"));
		user.setRole(Role.USER);
		return userRepository.save(user);
	}

	private Resource ensureResources() {
		Resource hall = resourceRepository.findByName("Main Lecture Hall A").orElse(null);
		if (hall == null) {
			hall = buildResource(
					"Main Lecture Hall A",
					"Large lecture hall with projector and AV support",
					ResourceType.LECTURE_HALL,
					120,
					"Block A - Floor 1",
					LocalTime.of(8, 0),
					LocalTime.of(20, 0),
					ResourceStatus.ACTIVE
			);
			hall = resourceRepository.save(Objects.requireNonNull(hall));
		}

		Resource innovationLab = resourceRepository.findByName("Innovation Lab 2").orElse(null);
		if (innovationLab == null) {
			innovationLab = buildResource(
					"Innovation Lab 2",
					"Computing lab for workshops and practical sessions",
					ResourceType.LAB,
					40,
					"Tech Wing - Floor 2",
					LocalTime.of(9, 0),
					LocalTime.of(18, 30),
					ResourceStatus.ACTIVE
			);
			resourceRepository.save(Objects.requireNonNull(innovationLab));
		}

		Resource seminarRoom = resourceRepository.findByName("Seminar Room C").orElse(null);
		if (seminarRoom == null) {
			seminarRoom = buildResource(
					"Seminar Room C",
					"Medium room for student clubs and mentoring sessions",
					ResourceType.MEETING_ROOM,
					24,
					"Admin Block - Floor 3",
					LocalTime.of(9, 0),
					LocalTime.of(17, 0),
					ResourceStatus.ACTIVE
			);
			resourceRepository.save(Objects.requireNonNull(seminarRoom));
		}

		return hall;
	}

	private void ensureNotifications() {
		if (notificationRepository.count() > 0) {
			return;
		}

		Notification firstNotification = buildNotification(
				"Mid-Semester Exam Timetable",
				"The exam timetable for all departments is now published on the portal.",
				NotificationCategory.ACADEMIC_NOTICES,
				NotificationPriority.HIGH,
				"seed:exam-timetable"
		);
		notificationRepository.save(Objects.requireNonNull(firstNotification));

		Notification secondNotification = buildNotification(
				"Innovation Fest Registration",
				"Team registrations are open until Friday 5 PM for Innovation Fest.",
				NotificationCategory.EVENTS_ACTIVITIES,
				NotificationPriority.MEDIUM,
				"seed:innovation-fest"
		);
		notificationRepository.save(Objects.requireNonNull(secondNotification));
	}

	private void ensureBookings(User student, Resource hall) {
		if (bookingRepository.count() > 0 || hall == null) {
			return;
		}

		LocalDate tomorrow = LocalDate.now().plusDays(1);
		LocalDate dayAfter = LocalDate.now().plusDays(2);

		Booking approvedBooking = new Booking();
		approvedBooking.setUser(student);
		approvedBooking.setResource(hall);
		approvedBooking.setPurpose("Department orientation session");
		approvedBooking.setExpectedAttendees(90);
		approvedBooking.setStartTime(LocalDateTime.of(tomorrow, LocalTime.of(10, 0)));
		approvedBooking.setEndTime(LocalDateTime.of(tomorrow, LocalTime.of(12, 0)));
		approvedBooking.setStatus(BookingStatus.APPROVED);
		bookingRepository.save(approvedBooking);

		Booking pendingBooking = new Booking();
		pendingBooking.setUser(student);
		pendingBooking.setResource(hall);
		pendingBooking.setPurpose("Student club weekly meetup");
		pendingBooking.setExpectedAttendees(60);
		pendingBooking.setStartTime(LocalDateTime.of(dayAfter, LocalTime.of(14, 0)));
		pendingBooking.setEndTime(LocalDateTime.of(dayAfter, LocalTime.of(16, 0)));
		pendingBooking.setStatus(BookingStatus.PENDING);
		bookingRepository.save(pendingBooking);
	}

	private void ensureTicket(User student, Resource hall) {
		if (ticketRepository.count() > 0 || hall == null) {
			return;
		}

		Ticket ticket = new Ticket();
		ticket.setCreatedBy(student);
		ticket.setResource(hall);
		ticket.setCategory(TicketCategory.HARDWARE);
		ticket.setPriority(TicketPriority.MEDIUM);
		ticket.setStatus(TicketStatus.OPEN);
		ticket.setDescription("Projector in Main Lecture Hall A flickers intermittently.");
		ticketRepository.save(ticket);
	}

	private Resource buildResource(
			String name,
			String description,
			ResourceType type,
			int capacity,
			String location,
			LocalTime availabilityStart,
			LocalTime availabilityEnd,
			ResourceStatus status) {
		Resource resource = new Resource();
		resource.setName(name);
		resource.setDescription(description);
		resource.setType(type);
		resource.setCapacity(capacity);
		resource.setLocation(location);
		resource.setAvailabilityStart(availabilityStart);
		resource.setAvailabilityEnd(availabilityEnd);
		resource.setStatus(status);
		resource.setAvailable(status == ResourceStatus.ACTIVE);
		return resource;
	}

	private Notification buildNotification(
			String title,
			String message,
			NotificationCategory category,
			NotificationPriority priority,
			String sourceKey) {
		Notification notification = new Notification();
		notification.setTitle(title);
		notification.setMessage(message);
		notification.setCategory(category);
		notification.setPriority(priority);
		notification.setSourceKey(sourceKey);
		return notification;
	}
}
