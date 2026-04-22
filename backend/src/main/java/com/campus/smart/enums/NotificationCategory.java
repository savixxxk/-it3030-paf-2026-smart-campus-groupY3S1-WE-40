package com.campus.smart.enums;

public enum NotificationCategory {
    ACADEMIC_NOTICES("Academic Notices"),
    EVENTS_ACTIVITIES("Events & Activities"),
    MAINTENANCE_ALERTS("Maintenance Alerts");

    private final String displayName;

    NotificationCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
