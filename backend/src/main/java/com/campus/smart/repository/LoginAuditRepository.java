package com.campus.smart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.smart.model.LoginAudit;

public interface LoginAuditRepository extends JpaRepository<LoginAudit, Long> {
	List<LoginAudit> findTop20ByEmailOrderByCreatedAtDesc(String email);

	List<LoginAudit> findTop20ByOrderByCreatedAtDesc();
}