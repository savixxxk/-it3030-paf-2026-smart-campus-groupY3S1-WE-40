package com.campus.smart.service;

import java.util.List;

import com.campus.smart.dto.LoginRequest;
import com.campus.smart.dto.LoginAuditView;
import com.campus.smart.dto.UserDTO;

public interface AuthService {
	UserDTO register(UserDTO request);

	UserDTO login(LoginRequest request);

	List<LoginAuditView> getLoginHistory(String email);
}
