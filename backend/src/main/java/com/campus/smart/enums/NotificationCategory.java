package com.campus.smart.enums;

public enum NotificationCategory {
    BOOKING("Booking"),
    TICKETS("Tickets"),
    ACADEMIC_NOTICES("Academic Notices"),
    MAINTENANCE_ALERTS("Maintenance Alerts");

    private final String displayName;

    NotificationCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
