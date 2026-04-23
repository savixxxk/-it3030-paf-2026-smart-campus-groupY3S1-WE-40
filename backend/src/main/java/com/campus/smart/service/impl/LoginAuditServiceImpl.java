package com.campus.smart.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.campus.smart.dto.LoginAuditView;
import com.campus.smart.model.LoginAudit;
import com.campus.smart.model.Role;
import com.campus.smart.repository.LoginAuditRepository;
import com.campus.smart.service.LoginAuditService;

@Service
public class LoginAuditServiceImpl implements LoginAuditService {
	private final LoginAuditRepository loginAuditRepository;

	public LoginAuditServiceImpl(LoginAuditRepository loginAuditRepository) {
		this.loginAuditRepository = loginAuditRepository;
	}

	@Override
	public void recordSuccess(String email, String name, Role role, String loginMethod) {
		LoginAudit audit = new LoginAudit();
		audit.setEmail(email);
		audit.setName(name);
		audit.setRole(role == null ? Role.USER : role);
		audit.setLoginMethod(loginMethod);
		audit.setSuccessful(true);
		audit.setFailureReason(null);
		loginAuditRepository.save(audit);
	}

	@Override
	public void recordFailure(String email, String name, String loginMethod, String reason) {
		LoginAudit audit = new LoginAudit();
		audit.setEmail(email == null || email.isBlank() ? "unknown" : email);
		audit.setName(name);
		audit.setRole(Role.USER);
		audit.setLoginMethod(loginMethod);
		audit.setSuccessful(false);
		audit.setFailureReason(reason);
		loginAuditRepository.save(audit);
	}

	@Override
	public List<LoginAuditView> getHistory(String email) {
		return loginAuditRepository.findTop20ByEmailOrderByCreatedAtDesc(email).stream()
				.map(audit -> new LoginAuditView(
						audit.getId(),
						audit.getEmail(),
						audit.getName(),
						audit.getLoginMethod(),
						audit.getRole().name(),
						audit.isSuccessful(),
						audit.getFailureReason(),
						audit.getCreatedAt()))
				.toList();
	}
}