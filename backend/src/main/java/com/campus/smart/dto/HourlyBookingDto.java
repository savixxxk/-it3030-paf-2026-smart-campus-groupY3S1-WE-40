package com.campus.smart.dto;

public class HourlyBookingDto {
    private Integer hour;
    private Long bookingCount;

    public HourlyBookingDto(Integer hour, Long bookingCount) {
        this.hour = hour;
        this.bookingCount = bookingCount;
    }

    public Integer getHour() {
        return hour;
    }

    public void setHour(Integer hour) {
        this.hour = hour;
    }

    public Long getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(Long bookingCount) {
        this.bookingCount = bookingCount;
    }
}
