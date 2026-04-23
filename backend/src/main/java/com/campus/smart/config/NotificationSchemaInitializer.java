package com.campus.smart.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class NotificationSchemaInitializer implements CommandLineRunner {

	private static final Logger logger = LoggerFactory.getLogger(NotificationSchemaInitializer.class);

	private final JdbcTemplate jdbcTemplate;

	public NotificationSchemaInitializer(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public void run(String... args) {
		widenCategoryColumn("notifications");
		widenCategoryColumn("notification_preferences");
	}

	private void widenCategoryColumn(String tableName) {
		String sql = "ALTER TABLE " + tableName + " MODIFY COLUMN category VARCHAR(64) NOT NULL";
		try {
			jdbcTemplate.execute(sql);
			logger.info("Ensured {}.category supports all notification categories", tableName);
		} catch (Exception exception) {
			logger.debug("Skipping schema adjustment for {}.category: {}", tableName, exception.getMessage());
		}
	}
}
