package com.campus.smart.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupChecks implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(StartupChecks.class);

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Override
    public void run(ApplicationArguments args) {
        if (googleClientId == null || googleClientId.isBlank() || googleClientId.contains("placeholder")) {
            logger.warn("Google OAuth Client ID is not configured or uses a placeholder. Set GOOGLE_CLIENT_ID environment variable before starting the app.");
        } else {
            String masked = googleClientId.length() > 8 ? googleClientId.substring(0, 8) + "..." : googleClientId;
            logger.info("Google OAuth Client ID present: {}", masked);
        }
    }
}
