package com.campus.smart.service.impl;

import java.util.Optional;
import java.util.List;

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

    @Override
    public List<UserDTO> findAllUsers() {
        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public boolean blockUser(Long id) {
        return userRepository.findById(id).map(user -> {
            user.setBlocked(true);
            userRepository.save(user);
            return true;
        }).orElse(false);
    }

    @Override
    public boolean unblockUser(Long id) {
        return userRepository.findById(id).map(user -> {
            user.setBlocked(false);
            userRepository.save(user);
            return true;
        }).orElse(false);
    }

    private UserDTO toDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setBlocked(user.isBlocked());
        return dto;
    }
}
