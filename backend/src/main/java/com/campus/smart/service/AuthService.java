package com.campus.smart.service;

import com.campus.smart.dto.LoginRequest;
import com.campus.smart.dto.UserDTO;

public interface AuthService {
	UserDTO register(UserDTO request);

	UserDTO login(LoginRequest request);
}
