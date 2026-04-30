package com.campus.smart.dto;

import jakarta.validation.constraints.NotNull;
import com.campus.smart.enums.NotificationCategory;

public class PreferenceUpdateRequest {

	@NotNull(message = "Category is required")
	private NotificationCategory category;

	@NotNull(message = "Enabled status is required")
	private Boolean enabled;

	public NotificationCategory getCategory() {
		return category;
	}

	public void setCategory(NotificationCategory category) {
		this.category = category;
	}

	public Boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}
}
