package com.campus.smart.dto;

import java.time.LocalDateTime;
import com.campus.smart.enums.NotificationCategory;
import com.campus.smart.enums.NotificationPriority;

public class NotificationView {
	private Long id;
	private String title;
	private String message;
	private NotificationCategory category;
	private NotificationPriority priority;
	private LocalDateTime createdAt;
	private boolean read;

	public NotificationView() {
	}

	public NotificationView(Long id, String title, String message, NotificationCategory category, NotificationPriority priority, LocalDateTime createdAt, boolean read) {
		this.id = id;
		this.title = title;
		this.message = message;
		this.category = category;
		this.priority = priority;
		this.createdAt = createdAt;
		this.read = read;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public NotificationCategory getCategory() {
		return category;
	}

	public void setCategory(NotificationCategory category) {
		this.category = category;
	}

	public NotificationPriority getPriority() {
		return priority;
	}

	public void setPriority(NotificationPriority priority) {
		this.priority = priority;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public boolean isRead() {
		return read;
	}

	public void setRead(boolean read) {
		this.read = read;
	}
}