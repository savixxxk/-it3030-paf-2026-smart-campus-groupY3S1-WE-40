package com.campus.smart.dto;

import java.time.LocalTime;

import com.campus.smart.enums.ResourceStatus;
import com.campus.smart.enums.ResourceType;

public class ResourceResponse {
	private Long id;
	private String name;
	private String description;
	private ResourceType type;
	private Integer capacity;
	private String location;
	private LocalTime availabilityStart;
	private LocalTime availabilityEnd;
	private ResourceStatus status;

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

