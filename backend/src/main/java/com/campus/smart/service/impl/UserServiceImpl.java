package com.campus.smart.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.campus.smart.dto.UserDTO;
import com.campus.smart.model.User;
import com.campus.smart.repository.UserRepository;
import com.campus.smart.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<UserDTO> findByEmail(String email) {
        return userRepository.findByEmail(email).map(this::toDto);
    }

    private UserDTO toDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}
