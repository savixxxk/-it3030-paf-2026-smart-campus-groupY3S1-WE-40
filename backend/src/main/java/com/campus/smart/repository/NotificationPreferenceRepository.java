package com.campus.smart.repository;

import com.campus.smart.model.NotificationPreference;
import com.campus.smart.enums.NotificationCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long> {
    
    List<NotificationPreference> findByUserEmail(String userEmail);
    
    Optional<NotificationPreference> findByUserEmailAndCategory(String userEmail, NotificationCategory category);
    
    boolean existsByUserEmailAndCategory(String userEmail, NotificationCategory category);
}
