package com.campus.smart.dto;

import java.time.LocalTime;

import com.campus.smart.enums.ResourceStatus;
import com.campus.smart.enums.ResourceType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ResourceCreateRequest {
	@NotBlank(message = "Name is required")
	private String name;

	private String description;

	@NotNull(message = "Type is required")
	private ResourceType type;

	@Positive(message = "Capacity must be positive")
	private Integer capacity;

	@NotBlank(message = "Location is required")
	private String location;

	@NotNull(message = "availabilityStart is required")
	private LocalTime availabilityStart;

	@NotNull(message = "availabilityEnd is required")
	private LocalTime availabilityEnd;

	@NotNull(message = "Status is required")
	private ResourceStatus status;

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

	public ResourceType getType() {
		return type;
	}

	public void setType(ResourceType type) {
		this.type = type;
	}

	public Integer getCapacity() {
		return capacity;
	}

	public void setCapacity(Integer capacity) {
		this.capacity = capacity;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

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
}

