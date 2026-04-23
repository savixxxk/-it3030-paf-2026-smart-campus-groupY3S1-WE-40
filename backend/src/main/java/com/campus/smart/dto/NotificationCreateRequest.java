package com.campus.smart.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.campus.smart.enums.NotificationCategory;
import com.campus.smart.enums.NotificationPriority;

public class NotificationCreateRequest {

	@NotBlank(message = "Title is required")
	private String title;

	@NotBlank(message = "Message is required")
	private String message;

	@NotNull(message = "Category is required")
	private NotificationCategory category;

	@NotNull(message = "Priority is required")
	private NotificationPriority priority;

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
}