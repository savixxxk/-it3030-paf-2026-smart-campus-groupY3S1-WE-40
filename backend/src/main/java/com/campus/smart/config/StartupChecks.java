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

    @Value("${spring.security.oauth2.client.registration.google.client-secret:}")
    private String googleClientSecret;

    @Value("${server.port:8081}")
    private String serverPort;

    @Override
    public void run(ApplicationArguments args) {
        boolean clientIdMissing = googleClientId == null || googleClientId.isBlank() || googleClientId.contains("placeholder");
        boolean clientSecretMissing = googleClientSecret == null || googleClientSecret.isBlank() || googleClientSecret.contains("placeholder");

        if (clientIdMissing || clientSecretMissing) {
            logger.warn("Google OAuth is not fully configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET before starting the app.");
            logger.warn("Google Cloud Console redirect URI should include: http://localhost:{}/login/oauth2/code/google", serverPort);
        } else {
            String masked = googleClientId.length() > 8 ? googleClientId.substring(0, 8) + "..." : googleClientId;
            logger.info("Google OAuth Client ID present: {}", masked);
        }
    }
}
