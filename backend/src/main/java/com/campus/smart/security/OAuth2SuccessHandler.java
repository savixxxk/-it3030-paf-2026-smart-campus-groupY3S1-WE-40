package com.campus.smart.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.campus.smart.model.Role;
import com.campus.smart.model.User;
import com.campus.smart.repository.UserRepository;
import com.campus.smart.service.LoginAuditService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

	private final UserRepository userRepository;
	private final LoginAuditService loginAuditService;

	@Value("${app.oauth2.frontend-success-url:http://localhost:5173/login}")
	private String frontendSuccessUrl;

	public OAuth2SuccessHandler(UserRepository userRepository, LoginAuditService loginAuditService) {
		this.userRepository = userRepository;
		this.loginAuditService = loginAuditService;
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		if (!(authentication instanceof OAuth2AuthenticationToken oauth2AuthenticationToken)) {
			new DefaultRedirectStrategy().sendRedirect(request, response, frontendSuccessUrl + "?oauth=error");
			return;
		}

		OAuth2User oauth2User = oauth2AuthenticationToken.getPrincipal();
		Map<String, Object> attributes = oauth2User.getAttributes();
		String email = resolveValue(attributes, "email", "Email");
		String name = resolveValue(attributes, "name", "given_name");

		if (email == null || email.isBlank()) {
			loginAuditService.recordFailure("unknown", name, "GOOGLE", "MISSING_EMAIL");
			new DefaultRedirectStrategy().sendRedirect(request, response, frontendSuccessUrl + "?oauth=error");
			return;
		}

		User user = userRepository.findByEmail(email).orElseGet(() -> {
			User newUser = new User();
			newUser.setName(name != null && !name.isBlank() ? name : email);
			newUser.setEmail(email);
			newUser.setRole(Role.USER);
			return userRepository.save(newUser);
		});

		if (name != null && !name.isBlank() && !name.equals(user.getName())) {
			user.setName(name);
			if (user.getRole() == null) {
				user.setRole(Role.USER);
			}
			userRepository.save(user);
		}

		loginAuditService.recordSuccess(user.getEmail(), user.getName(), user.getRole(), "GOOGLE");

		String redirectUrl = frontendSuccessUrl
				+ "?oauth=success"
				+ "&name=" + URLEncoder.encode(user.getName(), StandardCharsets.UTF_8)
				+ "&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8)
				+ "&role=" + URLEncoder.encode(user.getRole().name(), StandardCharsets.UTF_8);

		new DefaultRedirectStrategy().sendRedirect(request, response, redirectUrl);
	}

	private String resolveValue(Map<String, Object> attributes, String... keys) {
		for (String key : keys) {
			Object value = attributes.get(key);
			if (value != null && !value.toString().isBlank()) {
				return value.toString();
			}
		}
		return null;
	}
}