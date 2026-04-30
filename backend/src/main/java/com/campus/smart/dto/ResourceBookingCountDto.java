package com.campus.smart.dto;

public class ResourceBookingCountDto {
    private Long resourceId;
    private String resourceName;
    private Long bookingCount;

    public ResourceBookingCountDto(Long resourceId, String resourceName, Long bookingCount) {
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.bookingCount = bookingCount;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public Long getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(Long bookingCount) {
        this.bookingCount = bookingCount;
    }
}
