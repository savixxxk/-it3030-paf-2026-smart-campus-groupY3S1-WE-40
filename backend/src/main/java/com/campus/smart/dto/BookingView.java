package com.campus.smart.dto;

import java.time.LocalDateTime;

import com.campus.smart.enums.BookingStatus;

public class BookingView {
	private Long id;
	private String userEmail;
	private String userName;
	private Long resourceId;
	private String resourceName;
	private String resourceLocation;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private BookingStatus status;
	private String purpose;
	private Integer expectedAttendees;
	private String adminReason;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public BookingView() {
	}

	public BookingView(
			Long id,
			String userEmail,
			String userName,
			Long resourceId,
			String resourceName,
			String resourceLocation,
			LocalDateTime startTime,
			LocalDateTime endTime,
			BookingStatus status,
			String purpose,
			Integer expectedAttendees,
			String adminReason,
			LocalDateTime createdAt,
			LocalDateTime updatedAt
	) {
		this.id = id;
		this.userEmail = userEmail;
		this.userName = userName;
		this.resourceId = resourceId;
		this.resourceName = resourceName;
		this.resourceLocation = resourceLocation;
		this.startTime = startTime;
		this.endTime = endTime;
		this.status = status;
		this.purpose = purpose;
		this.expectedAttendees = expectedAttendees;
		this.adminReason = adminReason;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
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

	public String getResourceLocation() {
		return resourceLocation;
	}

	public void setResourceLocation(String resourceLocation) {
		this.resourceLocation = resourceLocation;
	}

	public LocalDateTime getStartTime() {
		return startTime;
	}

	public void setStartTime(LocalDateTime startTime) {
		this.startTime = startTime;
	}

	public LocalDateTime getEndTime() {
		return endTime;
	}

	public void setEndTime(LocalDateTime endTime) {
		this.endTime = endTime;
	}

	public BookingStatus getStatus() {
		return status;
	}

	public void setStatus(BookingStatus status) {
		this.status = status;
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	public Integer getExpectedAttendees() {
		return expectedAttendees;
	}

	public void setExpectedAttendees(Integer expectedAttendees) {
		this.expectedAttendees = expectedAttendees;
	}

	public String getAdminReason() {
		return adminReason;
	}

	public void setAdminReason(String adminReason) {
		this.adminReason = adminReason;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}

