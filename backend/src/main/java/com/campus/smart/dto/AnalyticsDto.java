package com.campus.smart.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsDto {
    private Long totalBookings;
    private Long approvedBookings;
    private Long pendingBookings;
    private Long openTickets;
    private Long totalResources;
    private List<ResourceBookingCountDto> topResources;
    private List<HourlyBookingDto> peakHours;
    private Map<String, Object> usageStats;

    public Long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public Long getApprovedBookings() {
        return approvedBookings;
    }

    public void setApprovedBookings(Long approvedBookings) {
        this.approvedBookings = approvedBookings;
    }

    public Long getPendingBookings() {
        return pendingBookings;
    }

    public void setPendingBookings(Long pendingBookings) {
        this.pendingBookings = pendingBookings;
    }

    public Long getOpenTickets() {
        return openTickets;
    }

    public void setOpenTickets(Long openTickets) {
        this.openTickets = openTickets;
    }

    public Long getTotalResources() {
        return totalResources;
    }

    public void setTotalResources(Long totalResources) {
        this.totalResources = totalResources;
    }

    public List<ResourceBookingCountDto> getTopResources() {
        return topResources;
    }

    public void setTopResources(List<ResourceBookingCountDto> topResources) {
        this.topResources = topResources;
    }

    public List<HourlyBookingDto> getPeakHours() {
        return peakHours;
    }

    public void setPeakHours(List<HourlyBookingDto> peakHours) {
        this.peakHours = peakHours;
    }

    public Map<String, Object> getUsageStats() {
        return usageStats;
    }

    public void setUsageStats(Map<String, Object> usageStats) {
        this.usageStats = usageStats;
    }
}
