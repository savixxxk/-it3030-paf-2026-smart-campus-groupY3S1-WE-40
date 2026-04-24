package com.campus.smart.service.impl;

import com.campus.smart.dto.AnalyticsDto;
import com.campus.smart.dto.HourlyBookingDto;
import com.campus.smart.dto.ResourceBookingCountDto;
import com.campus.smart.enums.BookingStatus;
<<<<<<< HEAD
=======
import com.campus.smart.enums.ResourceStatus;
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
import com.campus.smart.model.Booking;
import com.campus.smart.model.Resource;
import com.campus.smart.repository.BookingRepository;
import com.campus.smart.repository.ResourceRepository;
import com.campus.smart.service.AnalyticsService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public AnalyticsServiceImpl(BookingRepository bookingRepository, ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
    }

    @Override
    public AnalyticsDto getAnalytics() {
        AnalyticsDto analytics = new AnalyticsDto();

        // Basic counts
        long totalBookings = bookingRepository.count();
        long approvedBookings = bookingRepository.findByStatus(BookingStatus.APPROVED).size();
        long pendingBookings = bookingRepository.findByStatus(BookingStatus.PENDING).size();
        long totalResources = resourceRepository.count();

        analytics.setTotalBookings(totalBookings);
        analytics.setApprovedBookings(approvedBookings);
        analytics.setPendingBookings(pendingBookings);
        analytics.setTotalResources(totalResources);

        // Top resources by bookings
        List<ResourceBookingCountDto> topResources = getTopResources(5);
        analytics.setTopResources(topResources);

        // Peak hours
        List<HourlyBookingDto> peakHours = getPeakBookingHours();
        analytics.setPeakHours(peakHours);

        // Usage stats
        Map<String, Object> usageStats = calculateUsageStats();
        analytics.setUsageStats(usageStats);

        return analytics;
    }

    private List<ResourceBookingCountDto> getTopResources(int limit) {
        List<Resource> allResources = resourceRepository.findAll();

        return allResources.stream()
                .map(resource -> {
                    long count = bookingRepository.countApprovedBookingsByResource(resource.getId());
                    return new ResourceBookingCountDto(resource.getId(), resource.getName(), count);
                })
                .sorted((a, b) -> Long.compare(b.getBookingCount(), a.getBookingCount()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private List<HourlyBookingDto> getPeakBookingHours() {
        List<Booking> approvedBookings = bookingRepository.findAllApproved();

        Map<Integer, Long> hourlyCount = new HashMap<>();
        for (int i = 0; i < 24; i++) {
            hourlyCount.put(i, 0L);
        }

        for (Booking booking : approvedBookings) {
            int startHour = booking.getStartTime().getHour();
            int endHour = booking.getEndTime().getHour();

            for (int hour = startHour; hour < endHour && hour < 24; hour++) {
                hourlyCount.put(hour, hourlyCount.get(hour) + 1);
            }
        }

        return hourlyCount.entrySet().stream()
                .map(entry -> new HourlyBookingDto(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparingInt(HourlyBookingDto::getHour))
                .collect(Collectors.toList());
    }

    private Map<String, Object> calculateUsageStats() {
        Map<String, Object> stats = new LinkedHashMap<>();

        List<Booking> allBookings = bookingRepository.findAll();
        List<Booking> approvedBookings = bookingRepository.findByStatus(BookingStatus.APPROVED);

        // Month-wise stats for current month
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime monthStart = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime monthEnd = now.withDayOfMonth(now.toLocalDate().lengthOfMonth())
                .withHour(23).withMinute(59).withSecond(59);

        long thisMonthBookings = approvedBookings.stream()
                .filter(b -> !b.getStartTime().isBefore(monthStart) && !b.getStartTime().isAfter(monthEnd))
                .count();

        stats.put("thisMonthBookings", thisMonthBookings);
        stats.put("averageBookingDuration", calculateAverageDuration(approvedBookings));
        stats.put("mostUsedHour", getMostUsedHour(approvedBookings));
        stats.put("utilization", calculateUtilization(approvedBookings));

        return stats;
    }

    private double calculateAverageDuration(List<Booking> bookings) {
        if (bookings.isEmpty()) return 0;

        return bookings.stream()
                .mapToLong(b -> java.time.temporal.ChronoUnit.HOURS.between(b.getStartTime(), b.getEndTime()))
                .average()
                .orElse(0);
    }

    private Integer getMostUsedHour(List<Booking> bookings) {
        if (bookings.isEmpty()) return 0;

        Map<Integer, Long> hourCount = new HashMap<>();
        for (int i = 0; i < 24; i++) {
            hourCount.put(i, 0L);
        }

        for (Booking booking : bookings) {
            int startHour = booking.getStartTime().getHour();
            int endHour = booking.getEndTime().getHour();

            for (int hour = startHour; hour < endHour && hour < 24; hour++) {
                hourCount.put(hour, hourCount.get(hour) + 1);
            }
        }

        return hourCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(0);
    }

    private double calculateUtilization() {
        long totalResources = resourceRepository.count();
        if (totalResources == 0) return 0;

<<<<<<< HEAD
        List<Resource> availableResources = resourceRepository.findByAvailableTrue();
        return (double) availableResources.size() / totalResources * 100;
=======
        List<Resource> activeResources = resourceRepository.findByStatus(ResourceStatus.ACTIVE);
        return (double) activeResources.size() / totalResources * 100;
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
    }

    private double calculateUtilization(List<Booking> bookings) {
        long totalResources = resourceRepository.count();
        if (totalResources == 0) return 0;

        Set<Long> bookedResources = bookings.stream()
                .map(b -> b.getResource().getId())
                .collect(Collectors.toSet());

        return (double) bookedResources.size() / totalResources * 100;
    }
}
