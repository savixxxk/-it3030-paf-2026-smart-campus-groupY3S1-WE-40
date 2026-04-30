package com.campus.smart.dto;

import jakarta.validation.constraints.NotBlank;

public class BookingAdminDecisionRequest {
	@NotBlank(message = "reason is required")
	private String reason;

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}
}

