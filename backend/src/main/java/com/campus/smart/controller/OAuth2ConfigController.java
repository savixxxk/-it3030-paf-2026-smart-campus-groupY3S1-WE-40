package com.campus.smart.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class OAuth2ConfigController {

	@Value("${spring.security.oauth2.client.registration.google.client-id:}")
	private String googleClientId;

	@Value("${spring.security.oauth2.client.registration.google.client-secret:}")
	private String googleClientSecret;

	@GetMapping("/oauth2/google/config")
	public ResponseEntity<Map<String, Object>> googleOAuthConfig() {
		boolean clientIdConfigured = googleClientId != null && !googleClientId.isBlank() && !googleClientId.contains("placeholder");
		boolean clientSecretConfigured = googleClientSecret != null && !googleClientSecret.isBlank() && !googleClientSecret.contains("placeholder");
		boolean enabled = clientIdConfigured && clientSecretConfigured;

		return ResponseEntity.ok(Map.of(
			"enabled", enabled,
			"clientIdConfigured", clientIdConfigured,
			"clientSecretConfigured", clientSecretConfigured
		));
	}
}