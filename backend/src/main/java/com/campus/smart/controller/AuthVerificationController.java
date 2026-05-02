package com.campus.smart.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campus.smart.dto.UserResponse;
import com.campus.smart.model.User;
import com.campus.smart.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthVerificationController {
	private final UserRepository userRepository;

	public AuthVerificationController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping("/verify")
	public UserResponse verify(Principal principal) {
		if (principal == null) {
			return null;
		}

		String email = principal.getName();
		User user = userRepository.findByEmail(email).orElse(null);

		if (user == null) {
			return null;
		}

		if (user.isBlocked()) {
			return null;
		}

		return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
	}

	@GetMapping("/me")
	public UserResponse getCurrentUser(Principal principal) {
		// Same as verify, just a different endpoint name
		return verify(principal);
	}
}
