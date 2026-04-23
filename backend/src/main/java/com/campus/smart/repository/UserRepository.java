package com.campus.smart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.smart.model.Role;
import com.campus.smart.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	boolean existsByEmailAndRole(String email, Role role);
}
