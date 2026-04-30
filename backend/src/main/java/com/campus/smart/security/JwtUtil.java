package com.campus.smart.security;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class JwtUtil {

	private JwtUtil() {
	}

	public static String generateToken(String email) {
		String payload = email + ":" + System.currentTimeMillis();
		return Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
	}
}
