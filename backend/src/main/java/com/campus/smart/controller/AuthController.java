package com.campus.smart.controller;

<<<<<<< HEAD
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
=======
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campus.smart.dto.LoginRequest;
import com.campus.smart.dto.UserDTO;
import com.campus.smart.service.AuthService;

<<<<<<< HEAD
=======
import jakarta.servlet.http.HttpServletRequest;
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
<<<<<<< HEAD
	public ResponseEntity<UserDTO> register(@Valid @RequestBody UserDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<UserDTO> login(@Valid @RequestBody LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
=======
	public ResponseEntity<UserDTO> register(@Valid @RequestBody UserDTO request, HttpServletRequest httpRequest) {
		UserDTO user = authService.register(request);
		startSession(user, httpRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(user);
	}

	@PostMapping("/login")
	public ResponseEntity<UserDTO> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
		UserDTO user = authService.login(request);
		startSession(user, httpRequest);
		return ResponseEntity.ok(user);
	}

	private void startSession(UserDTO user, HttpServletRequest request) {
		if (user == null || user.getEmail() == null || user.getRole() == null) {
			return;
		}

		var auth = new UsernamePasswordAuthenticationToken(
				user.getEmail(),
				null,
				List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));

		var context = SecurityContextHolder.createEmptyContext();
		context.setAuthentication(auth);
		SecurityContextHolder.setContext(context);

		request.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
	}
}
