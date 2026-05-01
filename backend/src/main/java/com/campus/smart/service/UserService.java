package com.campus.smart.service;

import java.util.Optional;
import java.util.List;

import com.campus.smart.dto.UserDTO;

public interface UserService {
	Optional<UserDTO> findByEmail(String email);

	List<UserDTO> findAllUsers();
}
