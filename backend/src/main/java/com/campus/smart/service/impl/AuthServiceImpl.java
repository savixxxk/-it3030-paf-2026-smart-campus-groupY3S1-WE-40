package com.campus.smart.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.campus.smart.dto.LoginRequest;
import com.campus.smart.dto.LoginAuditView;
import com.campus.smart.dto.UserDTO;
import com.campus.smart.model.Role;
import com.campus.smart.model.User;
import com.campus.smart.repository.UserRepository;
import com.campus.smart.service.AuthService;
import com.campus.smart.service.LoginAuditService;
import com.campus.smart.security.JwtService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginAuditService loginAuditService;
    private final JwtService jwtService;

    @Value("${app.admin.name:admin}")
    private String adminName;

    @Value("${app.admin.email:admin@gmail.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@1}")
    private String adminPassword;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, LoginAuditService loginAuditService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginAuditService = loginAuditService;
        this.jwtService = jwtService;
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
        return toDto(savedUser, jwtService.generateToken(savedUser.getEmail(), savedUser.getRole().name()));
    }

    @Override
    public UserDTO login(LoginRequest request) {
        if (adminEmail.equalsIgnoreCase(request.getEmail()) && adminPassword.equals(request.getPassword())) {
            String token = jwtService.generateToken(adminEmail, Role.ADMIN.name());
            UserDTO admin = new UserDTO();
            admin.setFullName(adminName);
            admin.setEmail(adminEmail);
            admin.setRole(Role.ADMIN);
            admin.setToken(token);
            admin.setLastLoginAt(LocalDateTime.now());
            admin.setLoginCount(0);
            admin.setActive(true);
            admin.setDoNotDisturb(false);
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

        user.setLastLoginAt(LocalDateTime.now());
        user.setLoginCount(user.getLoginCount() + 1);
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        loginAuditService.recordSuccess(user.getEmail(), user.getName(), user.getRole(), "PASSWORD");

        return toDto(user, token);
    }

    @Override
    public List<LoginAuditView> getLoginHistory(String email) {
        return loginAuditService.getHistory(email);
    }

    private UserDTO toDto(User user, String token) {
        UserDTO dto = new UserDTO();
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setToken(token);
        dto.setLastLoginAt(user.getLastLoginAt());
        dto.setLoginCount(user.getLoginCount());
        dto.setActive(user.isActive());
        dto.setDoNotDisturb(user.isDoNotDisturb());
        return dto;
    }
}
