package com.campus.smart.service;

import com.campus.smart.model.Role;

public interface LoginAuditService {
	void recordSuccess(String email, String name, Role role, String loginMethod);

	void recordFailure(String email, String name, String loginMethod, String reason);
}