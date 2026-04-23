package com.campus.smart.dto;

import com.campus.smart.enums.TicketCategory;
import com.campus.smart.enums.TicketPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TicketCreateRequest {
	@NotNull(message = "resourceId is required")
	private Long resourceId;

	@NotNull(message = "category is required")
	private TicketCategory category;

	@NotNull(message = "priority is required")
	private TicketPriority priority;

	@NotBlank(message = "description is required")
	private String description;

	public Long getResourceId() {
		return resourceId;
	}

	public void setResourceId(Long resourceId) {
		this.resourceId = resourceId;
	}

	public TicketCategory getCategory() {
		return category;
	}

	public void setCategory(TicketCategory category) {
		this.category = category;
	}

	public TicketPriority getPriority() {
		return priority;
	}

	public void setPriority(TicketPriority priority) {
		this.priority = priority;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}

