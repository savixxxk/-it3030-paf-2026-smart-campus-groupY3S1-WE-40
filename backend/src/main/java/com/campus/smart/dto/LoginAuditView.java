package com.campus.smart.dto;

import java.time.LocalDateTime;

public class LoginAuditView {
	private Long id;
	private String email;
	private String name;
	private String loginMethod;
	private String role;
	private boolean successful;
	private String failureReason;
	private LocalDateTime createdAt;

	public LoginAuditView() {
	}

	public LoginAuditView(Long id, String email, String name, String loginMethod, String role, boolean successful, String failureReason, LocalDateTime createdAt) {
		this.id = id;
		this.email = email;
		this.name = name;
		this.loginMethod = loginMethod;
		this.role = role;
		this.successful = successful;
		this.failureReason = failureReason;
		this.createdAt = createdAt;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getLoginMethod() { return loginMethod; }
	public void setLoginMethod(String loginMethod) { this.loginMethod = loginMethod; }
	public String getRole() { return role; }
	public void setRole(String role) { this.role = role; }
	public boolean isSuccessful() { return successful; }
	public void setSuccessful(boolean successful) { this.successful = successful; }
	public String getFailureReason() { return failureReason; }
	public void setFailureReason(String failureReason) { this.failureReason = failureReason; }
	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}