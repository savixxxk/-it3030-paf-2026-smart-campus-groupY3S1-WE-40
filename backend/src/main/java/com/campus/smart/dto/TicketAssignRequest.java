package com.campus.smart.dto;

import jakarta.validation.constraints.NotBlank;

public class TicketAssignRequest {
	@NotBlank(message = "technicianEmail is required")
	private String technicianEmail;

	public String getTechnicianEmail() {
		return technicianEmail;
	}

	public void setTechnicianEmail(String technicianEmail) {
		this.technicianEmail = technicianEmail;
	}
}

