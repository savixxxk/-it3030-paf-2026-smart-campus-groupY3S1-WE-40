package com.campus.smart.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campus.smart.enums.NotificationCategory;
import com.campus.smart.model.NotificationPreference;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long> {
    
    List<NotificationPreference> findByUserEmail(String userEmail);
    
    Optional<NotificationPreference> findByUserEmailAndCategory(String userEmail, NotificationCategory category);
    
    boolean existsByUserEmailAndCategory(String userEmail, NotificationCategory category);

    // Find all preferences for a category where the user enabled email/notifications
    List<NotificationPreference> findByCategoryAndEnabledTrue(NotificationCategory category);
}
