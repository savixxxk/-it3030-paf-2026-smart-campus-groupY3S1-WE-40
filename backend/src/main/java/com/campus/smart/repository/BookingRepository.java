package com.campus.smart.repository;

import com.campus.smart.model.Booking;
import com.campus.smart.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserEmail(String email);
    
    List<Booking> findByStatus(BookingStatus status);
    
    List<Booking> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    @Query("""
            SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
            FROM Booking b
            WHERE b.resource.id = :resourceId
              AND b.status = com.campus.smart.enums.BookingStatus.APPROVED
              AND b.startTime < :endTime
              AND b.endTime > :startTime
            """)
    boolean existsApprovedOverlap(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT b FROM Booking b JOIN FETCH b.user u JOIN FETCH b.resource r WHERE u.email = :email ORDER BY b.createdAt DESC")
    List<Booking> findAllForUser(@Param("email") String email);

    @Query("SELECT b FROM Booking b JOIN FETCH b.user u JOIN FETCH b.resource r ORDER BY b.createdAt DESC")
    List<Booking> findAllWithUserAndResource();
    
    @Query("SELECT b FROM Booking b WHERE b.status = 'APPROVED'")
    List<Booking> findAllApproved();
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.resource.id = :resourceId AND b.status = 'APPROVED'")
    long countApprovedBookingsByResource(Long resourceId);
}
