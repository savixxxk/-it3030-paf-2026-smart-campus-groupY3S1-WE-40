package com.campus.smart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.smart.model.LoginAudit;

public interface LoginAuditRepository extends JpaRepository<LoginAudit, Long> {
}