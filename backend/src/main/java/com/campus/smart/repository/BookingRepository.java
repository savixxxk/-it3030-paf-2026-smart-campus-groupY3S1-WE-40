package com.campus.smart.repository;

import com.campus.smart.model.Booking;
import com.campus.smart.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserEmail(String email);
    
    List<Booking> findByStatus(BookingStatus status);
    
    List<Booking> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT b FROM Booking b WHERE b.status = 'APPROVED'")
    List<Booking> findAllApproved();
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.resource.id = :resourceId AND b.status = 'APPROVED'")
    long countApprovedBookingsByResource(Long resourceId);
}
