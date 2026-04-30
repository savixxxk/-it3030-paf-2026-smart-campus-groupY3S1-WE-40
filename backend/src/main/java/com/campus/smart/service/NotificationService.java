package com.campus.smart.service;

import java.util.List;
import java.util.Map;

import com.campus.smart.dto.NotificationCreateRequest;
import com.campus.smart.dto.NotificationView;
import com.campus.smart.enums.NotificationCategory;

public interface NotificationService {
	NotificationView createNotification(NotificationCreateRequest request);

	List<NotificationView> getAllNotificationsForAdmin();

	List<NotificationView> getNotificationsForStudent(String email);

	void markAsRead(Long notificationId, String email);

	Map<NotificationCategory, Boolean> getPreferences(String email);

	void updatePreference(String email, NotificationCategory category, Boolean enabled);

	void initializePreferencesForUser(String email);
}