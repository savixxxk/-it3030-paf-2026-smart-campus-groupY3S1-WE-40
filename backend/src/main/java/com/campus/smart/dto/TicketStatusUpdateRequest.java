package com.campus.smart.dto;

import com.campus.smart.enums.TicketStatus;

import jakarta.validation.constraints.NotNull;

public class TicketStatusUpdateRequest {
	@NotNull(message = "status is required")
	private TicketStatus status;

	public TicketStatus getStatus() {
		return status;
	}

	public void setStatus(TicketStatus status) {
		this.status = status;
	}
}

