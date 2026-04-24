package com.campus.smart.enums;

public enum NotificationPriority {
	HIGH("High"),
	MEDIUM("Medium"),
	LOW("Low");

	private final String displayName;

	NotificationPriority(String displayName) {
		this.displayName = displayName;
	}

	public String getDisplayName() {
		return displayName;
	}
}