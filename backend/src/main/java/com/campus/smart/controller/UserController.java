package com.campus.smart.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campus.smart.dto.UserDTO;
import com.campus.smart.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/by-email")
	public ResponseEntity<UserDTO> getByEmail(@RequestParam String email) {
		return userService.findByEmail(email)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping("/admin")
	@PreAuthorize("hasRole('ADMIN')")
	public List<UserDTO> getAllUsers() {
		return userService.findAllUsers();
	}

	@PostMapping("/{id}/block")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> blockUser(@PathVariable Long id) {
		boolean ok = userService.blockUser(id);
		return ok ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
	}

	@PostMapping("/{id}/unblock")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> unblockUser(@PathVariable Long id) {
		boolean ok = userService.unblockUser(id);
		return ok ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
	}

	@GetMapping("/health")
	public Map<String, String> health() {
		return Map.of("status", "ok");
	}
}
