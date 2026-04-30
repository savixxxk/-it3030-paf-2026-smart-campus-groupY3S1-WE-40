package com.campus.smart.dto;

import jakarta.validation.constraints.NotBlank;

public class TicketResolveRequest {
	@NotBlank(message = "resolutionNotes is required")
	private String resolutionNotes;

	public String getResolutionNotes() {
		return resolutionNotes;
	}

	public void setResolutionNotes(String resolutionNotes) {
		this.resolutionNotes = resolutionNotes;
	}
}

