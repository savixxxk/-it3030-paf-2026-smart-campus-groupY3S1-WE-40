package com.campus.smart.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.campus.smart.dto.LoginRequest;
import com.campus.smart.dto.UserDTO;
import com.campus.smart.model.Role;
import com.campus.smart.model.User;
import com.campus.smart.repository.UserRepository;
import com.campus.smart.service.AuthService;
import com.campus.smart.service.LoginAuditService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginAuditService loginAuditService;

    @Value("${app.admin.name:admin}")
    private String adminName;

    @Value("${app.admin.email:admin@gmail.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@1}")
    private String adminPassword;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, LoginAuditService loginAuditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginAuditService = loginAuditService;
    }

    @Override
    public UserDTO register(UserDTO request) {
        if (adminEmail.equalsIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("This email is reserved for admin login");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);
        return toDto(savedUser);
    }

    @Override
    public UserDTO login(LoginRequest request) {
        if (adminEmail.equalsIgnoreCase(request.getEmail()) && adminPassword.equals(request.getPassword())) {
            UserDTO admin = new UserDTO();
            admin.setFullName(adminName);
            admin.setEmail(adminEmail);
            admin.setRole(Role.ADMIN);
            loginAuditService.recordSuccess(adminEmail, adminName, Role.ADMIN, "PASSWORD");
            return admin;
        }

        if (adminEmail.equalsIgnoreCase(request.getEmail())) {
            loginAuditService.recordFailure(adminEmail, adminName, "PASSWORD", "INVALID_ADMIN_CREDENTIALS");
            throw new IllegalArgumentException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    loginAuditService.recordFailure(request.getEmail(), null, "PASSWORD", "USER_NOT_FOUND");
                    return new IllegalArgumentException("Invalid email or password");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            loginAuditService.recordFailure(user.getEmail(), user.getName(), "PASSWORD", "BAD_PASSWORD");
            throw new IllegalArgumentException("Invalid email or password");
        }

        loginAuditService.recordSuccess(user.getEmail(), user.getName(), user.getRole(), "PASSWORD");

        return toDto(user);
    }

    private UserDTO toDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}
