package com.campus.smart.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

@Component
public class JwtService {
	private static final String HMAC_ALGORITHM = "HmacSHA256";
	private final ObjectMapper objectMapper = new ObjectMapper();

	@Value("${app.jwt.secret:smart-campus-local-secret-change-me}")
	private String secret;

	@Value("${app.jwt.expiration-minutes:1440}")
	private long expirationMinutes;

	public String generateToken(String email, String role) {
		try {
			Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
			Map<String, Object> payload = new LinkedHashMap<>();
			long issuedAt = System.currentTimeMillis() / 1000L;
			long expiresAt = issuedAt + (expirationMinutes * 60L);
			payload.put("sub", email);
			payload.put("role", role);
			payload.put("iat", issuedAt);
			payload.put("exp", expiresAt);

			String headerPart = base64Url(objectMapper.writeValueAsBytes(header));
			String payloadPart = base64Url(objectMapper.writeValueAsBytes(payload));
			String signature = sign(headerPart + "." + payloadPart);
			return headerPart + "." + payloadPart + "." + signature;
		} catch (Exception exception) {
			throw new IllegalStateException("Failed to generate JWT token", exception);
		}
	}

	public boolean isValid(String token) {
		return getClaims(token) != null;
	}

	public String getEmail(String token) {
		Map<String, Object> claims = getClaims(token);
		return claims == null ? null : (String) claims.get("sub");
	}

	public String getRole(String token) {
		Map<String, Object> claims = getClaims(token);
		return claims == null ? null : (String) claims.get("role");
	}

	private Map<String, Object> getClaims(String token) {
		try {
			String[] parts = token == null ? new String[0] : token.split("\\.");
			if (parts.length != 3) {
				return null;
			}

			String expectedSignature = sign(parts[0] + "." + parts[1]);
			if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
				return null;
			}

			Map<String, Object> claims = objectMapper.readValue(
					Base64.getUrlDecoder().decode(parts[1]),
					new TypeReference<Map<String, Object>>() {}
			);
			Number exp = (Number) claims.get("exp");
			if (exp != null && exp.longValue() < (System.currentTimeMillis() / 1000L)) {
				return null;
			}
			return claims;
		} catch (Exception exception) {
			return null;
		}
	}

	private String sign(String data) throws Exception {
		Mac mac = Mac.getInstance(HMAC_ALGORITHM);
		mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
		return base64Url(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
	}

	private String base64Url(byte[] value) {
		return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
	}
}