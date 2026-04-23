package com.campus.smart.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campus.smart.dto.NotificationCreateRequest;
import com.campus.smart.dto.NotificationView;
import com.campus.smart.service.NotificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

	private final NotificationService notificationService;

	public NotificationController(NotificationService notificationService) {
		this.notificationService = notificationService;
	}

	@GetMapping("/admin")
	public List<NotificationView> getAdminNotifications() {
		return notificationService.getAllNotificationsForAdmin();
	}

	@PostMapping("/admin")
	public ResponseEntity<NotificationView> createNotification(@Valid @RequestBody NotificationCreateRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(request));
	}

	@GetMapping("/student")
	public List<NotificationView> getStudentNotifications(@RequestParam String email) {
		return notificationService.getNotificationsForStudent(email);
	}

	@GetMapping("/student/unread-count")
	public Map<String, Long> unreadCount(@RequestParam String email) {
		return Map.of("count", notificationService.getNotificationsForStudent(email).stream().filter(notification -> !notification.isRead()).count());
	}

	@PostMapping("/{notificationId}/read")
	public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long notificationId, @RequestParam String email) {
		notificationService.markAsRead(notificationId, email);
		return ResponseEntity.ok(Map.of("status", "read"));
	}
}
