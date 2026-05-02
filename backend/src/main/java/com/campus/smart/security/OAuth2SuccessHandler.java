package com.campus.smart.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
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

	@Value("${app.oauth2.frontend-success-url:http://localhost:5176/}")
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

		if (user.isBlocked()) {
			loginAuditService.recordFailure(user.getEmail(), user.getName(), "GOOGLE", "ACCOUNT_BLOCKED");
			new DefaultRedirectStrategy().sendRedirect(request, response,
					frontendSuccessUrl + "?oauth=error&message=" + URLEncoder.encode("user blocked", StandardCharsets.UTF_8));
			return;
		}

		var authorities = java.util.List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
		var emailAuthentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);
		var context = SecurityContextHolder.createEmptyContext();
		context.setAuthentication(emailAuthentication);
		SecurityContextHolder.setContext(context);
		request.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

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
			String resolved = resolveAttributeValue(value);
			if (resolved != null && !resolved.isBlank()) return resolved;
		}
		// Handle common nested attribute shapes (e.g., "emails": [{"value":"..."}])
		Object emails = attributes.get("emails");
		String resolved = resolveAttributeValue(emails);
		if (resolved != null && !resolved.isBlank()) return resolved;
		return null;
	}

	private String resolveAttributeValue(Object value) {
		if (value == null) return null;
		if (value instanceof String s) return s;
		if (value instanceof Map m) {
			Object v = m.get("value");
			if (v != null) return v.toString();
			v = m.get("email");
			if (v != null) return v.toString();
		}
		if (value instanceof java.util.List l && !l.isEmpty()) {
			Object first = l.get(0);
			if (first instanceof Map fm) {
				Object v = fm.get("value");
				if (v != null) return v.toString();
				v = fm.get("email");
				if (v != null) return v.toString();
			} else if (first != null) {
				return first.toString();
			}
		}
		return null;
	}
}