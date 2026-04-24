package com.campus.smart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.smart.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	List<Notification> findAllByOrderByCreatedAtDesc();

	boolean existsBySourceKey(String sourceKey);
}