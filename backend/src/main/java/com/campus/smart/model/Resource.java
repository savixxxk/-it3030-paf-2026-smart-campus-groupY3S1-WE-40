package com.campus.smart.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
<<<<<<< HEAD
=======
import java.time.LocalTime;

import com.campus.smart.enums.ResourceStatus;
import com.campus.smart.enums.ResourceType;
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 500)
    private String description;

<<<<<<< HEAD
=======
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type = ResourceType.LECTURE_HALL;

>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Integer capacity = 0;

    @Column(nullable = false)
<<<<<<< HEAD
=======
    private LocalTime availabilityStart = LocalTime.of(8, 0);

    @Column(nullable = false)
    private LocalTime availabilityEnd = LocalTime.of(18, 0);

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status = ResourceStatus.ACTIVE;

    @Column(nullable = false)
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
    private Boolean available = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

<<<<<<< HEAD
=======
    public ResourceType getType() {
        return type;
    }

    public void setType(ResourceType type) {
        this.type = type;
    }

>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

<<<<<<< HEAD
=======
    public LocalTime getAvailabilityStart() {
        return availabilityStart;
    }

    public void setAvailabilityStart(LocalTime availabilityStart) {
        this.availabilityStart = availabilityStart;
    }

    public LocalTime getAvailabilityEnd() {
        return availabilityEnd;
    }

    public void setAvailabilityEnd(LocalTime availabilityEnd) {
        this.availabilityEnd = availabilityEnd;
    }

    public ResourceStatus getStatus() {
        return status;
    }

    public void setStatus(ResourceStatus status) {
        this.status = status;
    }

>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
