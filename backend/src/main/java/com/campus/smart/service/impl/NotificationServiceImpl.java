package com.campus.smart.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.campus.smart.dto.NotificationCreateRequest;
import com.campus.smart.dto.NotificationView;
import com.campus.smart.enums.NotificationCategory;
import com.campus.smart.model.Notification;
import com.campus.smart.model.NotificationRead;
import com.campus.smart.model.NotificationPreference;
import com.campus.smart.model.Role;
import com.campus.smart.model.User;
import com.campus.smart.repository.NotificationReadRepository;
import com.campus.smart.repository.NotificationRepository;
import com.campus.smart.repository.NotificationPreferenceRepository;
import com.campus.smart.repository.UserRepository;
import com.campus.smart.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

	private final NotificationRepository notificationRepository;
	private final NotificationReadRepository notificationReadRepository;
	private final NotificationPreferenceRepository notificationPreferenceRepository;
	private final UserRepository userRepository;

	public NotificationServiceImpl(
			NotificationRepository notificationRepository,
			NotificationReadRepository notificationReadRepository,
			NotificationPreferenceRepository notificationPreferenceRepository,
			UserRepository userRepository
	) {
		this.notificationRepository = notificationRepository;
		this.notificationReadRepository = notificationReadRepository;
		this.notificationPreferenceRepository = notificationPreferenceRepository;
		this.userRepository = userRepository;
	}

	@Override
	public NotificationView createNotification(NotificationCreateRequest request) {
		Notification notification = new Notification();
		notification.setTitle(request.getTitle().trim());
		notification.setMessage(request.getMessage().trim());
		notification.setCategory(request.getCategory());
		notification.setTargetEmail(request.getTargetEmail());

		Notification saved = notificationRepository.save(notification);
		return toView(saved, false);
	}

	@Override
	public List<NotificationView> getAllNotificationsForAdmin() {
		return notificationRepository.findAllByOrderByCreatedAtDesc().stream()
				.map(notification -> toView(notification, false))
				.toList();
	}

	@Override
	public List<NotificationView> getNotificationsForStudent(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		if (user.getRole() == Role.ADMIN) {
			throw new IllegalArgumentException("Notifications page is for students only");
		}

		// Ensure user has preferences initialized
		initializePreferencesForUser(email);

		List<Notification> notifications = notificationRepository.findAllByOrderByCreatedAtDesc();
		
		// Get user's preference map
		Map<NotificationCategory, Boolean> preferences = getPreferences(email);

		// Filter notifications based on user preferences
		Set<Long> readIds = notificationReadRepository.findAllByUserEmail(email).stream()
				.map(read -> read.getNotification().getId())
				.collect(Collectors.toSet());

		return notifications.stream()
				.filter(notification -> notification.getTargetEmail() == null
						|| notification.getTargetEmail().equalsIgnoreCase(email))
				.filter(notification -> preferences.getOrDefault(notification.getCategory(), true))
				.map(notification -> toView(notification, readIds.contains(notification.getId())))
				.toList();
	}

	@Override
	public void markAsRead(Long notificationId, String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		if (user.getRole() == Role.ADMIN) {
			throw new IllegalArgumentException("Admin users do not have student notification state");
		}

		Notification notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new IllegalArgumentException("Notification not found"));

		if (notificationReadRepository.existsByNotificationIdAndUserEmail(notificationId, email)) {
			return;
		}

		NotificationRead read = new NotificationRead();
		read.setNotification(notification);
		read.setUser(user);
		notificationReadRepository.save(read);
	}

	@Override
	public Map<NotificationCategory, Boolean> getPreferences(String email) {
		List<NotificationPreference> preferences = notificationPreferenceRepository.findByUserEmail(email);
		
		Map<NotificationCategory, Boolean> preferenceMap = preferences.stream()
				.collect(Collectors.toMap(
						NotificationPreference::getCategory,
						NotificationPreference::getEnabled
				));

		// Ensure all categories are present with default values (true) if missing
		for (NotificationCategory category : NotificationCategory.values()) {
			preferenceMap.putIfAbsent(category, true);
		}

		return preferenceMap;
	}

	@Override
	public void updatePreference(String email, NotificationCategory category, Boolean enabled) {
		userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		NotificationPreference preference = notificationPreferenceRepository
				.findByUserEmailAndCategory(email, category)
				.orElseGet(() -> new NotificationPreference(email, category, true));

		preference.setEnabled(enabled);
		notificationPreferenceRepository.save(preference);
	}

	@Override
	public void initializePreferencesForUser(String email) {
		for (NotificationCategory category : NotificationCategory.values()) {
			if (!notificationPreferenceRepository.existsByUserEmailAndCategory(email, category)) {
				NotificationPreference pref = new NotificationPreference(email, category, true);
				notificationPreferenceRepository.save(pref);
			}
		}
	}

	private NotificationView toView(Notification notification, boolean isRead) {
		return new NotificationView(
				notification.getId(),
				notification.getTitle(),
				notification.getMessage(),
				notification.getCategory(),
				notification.getCreatedAt(),
				isRead
		);
	}
}