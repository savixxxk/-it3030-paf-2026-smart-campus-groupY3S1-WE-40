package com.campus.smart.service;

import java.util.List;

import com.campus.smart.model.Role;
import com.campus.smart.dto.LoginAuditView;

public interface LoginAuditService {
	void recordSuccess(String email, String name, Role role, String loginMethod);

	void recordFailure(String email, String name, String loginMethod, String reason);

	List<LoginAuditView> getHistory(String email);
}