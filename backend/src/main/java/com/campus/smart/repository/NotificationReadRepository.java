package com.campus.smart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.smart.model.NotificationRead;

public interface NotificationReadRepository extends JpaRepository<NotificationRead, Long> {
	boolean existsByNotificationIdAndUserEmail(Long notificationId, String userEmail);

	List<NotificationRead> findAllByUserEmail(String userEmail);
}