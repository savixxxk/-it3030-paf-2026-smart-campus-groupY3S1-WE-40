package com.campus.smart.dto;

import jakarta.validation.constraints.NotBlank;

public class CommentCreateRequest {
	@NotBlank(message = "message is required")
	private String message;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}

