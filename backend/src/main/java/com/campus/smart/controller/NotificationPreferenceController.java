package com.campus.smart.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campus.smart.dto.PreferenceUpdateRequest;
import com.campus.smart.enums.NotificationCategory;
import com.campus.smart.service.NotificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/preferences")
public class NotificationPreferenceController {

	private final NotificationService notificationService;

	public NotificationPreferenceController(NotificationService notificationService) {
		this.notificationService = notificationService;
	}

	@GetMapping("/notifications")
	public Map<NotificationCategory, Boolean> getPreferences(@RequestParam String email) {
		return notificationService.getPreferences(email);
	}

	@PutMapping("/notifications")
	public ResponseEntity<Map<String, String>> updatePreference(
			@RequestParam String email,
			@Valid @RequestBody PreferenceUpdateRequest request) {
		notificationService.updatePreference(email, request.getCategory(), request.getEnabled());
		return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", "updated"));
	}
}
