package com.campus.smart.security;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.stereotype.Component;

import com.campus.smart.model.Role;
import com.campus.smart.model.User;
import com.campus.smart.repository.UserRepository;

@Component
public class OAuth2AuthoritiesMapper implements GrantedAuthoritiesMapper {
	private final UserRepository userRepository;

	public OAuth2AuthoritiesMapper(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public Collection<? extends GrantedAuthority> mapAuthorities(Collection<? extends GrantedAuthority> authorities) {
		Set<GrantedAuthority> mapped = new HashSet<>(authorities);

		String email = extractEmail(authorities);
		if (email == null || email.isBlank()) {
			return mapped;
		}

		Role role = userRepository.findByEmail(email)
				.map(User::getRole)
				.orElse(Role.USER);

		mapped.add(new SimpleGrantedAuthority("ROLE_" + role.name()));
		return mapped;
	}

	private String extractEmail(Collection<? extends GrantedAuthority> authorities) {
		for (GrantedAuthority authority : authorities) {
			if (authority instanceof OidcUserAuthority oidc) {
				Map<String, Object> attrs = oidc.getUserInfo().getClaims();
				Object email = attrs.get("email");
				if (email != null) return email.toString();
				// handle nested shapes
				Object emails = attrs.get("emails");
				String resolved = resolveAttributeValue(emails);
				if (resolved != null) return resolved;
			}
			if (authority instanceof OAuth2UserAuthority oauth2) {
				Object email = oauth2.getAttributes().get("email");
				if (email != null) return email.toString();
				Object emails = oauth2.getAttributes().get("emails");
				String resolved = resolveAttributeValue(emails);
				if (resolved != null) return resolved;
			}
		}
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

