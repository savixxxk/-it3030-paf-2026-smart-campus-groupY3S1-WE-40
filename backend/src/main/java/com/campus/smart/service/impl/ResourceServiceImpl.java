package com.campus.smart.service.impl;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.smart.dto.ResourceCreateRequest;
import com.campus.smart.dto.ResourceResponse;
import com.campus.smart.dto.ResourceUpdateRequest;
import com.campus.smart.enums.ResourceType;
import com.campus.smart.exception.ResourceNotFoundException;
import com.campus.smart.model.Resource;
import com.campus.smart.repository.ResourceRepository;
import com.campus.smart.repository.spec.ResourceSpecifications;
import com.campus.smart.service.ResourceService;

@Service
public class ResourceServiceImpl implements ResourceService {
	private final ResourceRepository resourceRepository;

	public ResourceServiceImpl(ResourceRepository resourceRepository) {
		this.resourceRepository = resourceRepository;
	}

	@Override
	@Transactional
	public ResourceResponse create(ResourceCreateRequest request) {
		validateAvailabilityWindow(request.getAvailabilityStart(), request.getAvailabilityEnd());

		Resource resource = new Resource();
		apply(resource, request.getName(), request.getDescription(), request.getType(), request.getCapacity(), request.getLocation(),
				request.getAvailabilityStart(), request.getAvailabilityEnd(), request.getStatus());

		Resource saved = resourceRepository.save(resource);
		return toResponse(saved);
	}

	@Override
	public ResourceResponse getById(Long id) {
		return toResponse(resourceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id)));
	}

	@Override
	public List<ResourceResponse> search(ResourceType type, Integer capacity, String location) {
		Specification<Resource> spec = Specification.where(ResourceSpecifications.hasType(type))
				.and(ResourceSpecifications.capacityAtLeast(capacity))
				.and(ResourceSpecifications.locationContains(location));

		return resourceRepository.findAll(spec).stream().map(this::toResponse).toList();
	}

	@Override
	@Transactional
	public ResourceResponse update(Long id, ResourceUpdateRequest request) {
		validateAvailabilityWindow(request.getAvailabilityStart(), request.getAvailabilityEnd());

		Resource resource = resourceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
		apply(resource, request.getName(), request.getDescription(), request.getType(), request.getCapacity(), request.getLocation(),
				request.getAvailabilityStart(), request.getAvailabilityEnd(), request.getStatus());

		Resource saved = resourceRepository.save(resource);
		return toResponse(saved);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		if (!resourceRepository.existsById(id)) {
			throw new ResourceNotFoundException(id);
		}
		resourceRepository.deleteById(id);
	}

	private void validateAvailabilityWindow(java.time.LocalTime start, java.time.LocalTime end) {
		if (start == null || end == null) {
			return;
		}
		if (!start.isBefore(end)) {
			throw new IllegalArgumentException("availabilityStart must be before availabilityEnd");
		}
	}

	private void apply(Resource resource, String name, String description, com.campus.smart.enums.ResourceType type, Integer capacity,
			String location, java.time.LocalTime availabilityStart, java.time.LocalTime availabilityEnd,
			com.campus.smart.enums.ResourceStatus status) {
		resource.setName(name);
		resource.setDescription(description);
		resource.setType(type);
		resource.setCapacity(capacity);
		resource.setLocation(location);
		resource.setAvailabilityStart(availabilityStart);
		resource.setAvailabilityEnd(availabilityEnd);
		resource.setStatus(status);
		resource.setAvailable(status == com.campus.smart.enums.ResourceStatus.ACTIVE);
	}

	private ResourceResponse toResponse(Resource resource) {
		ResourceResponse response = new ResourceResponse();
		response.setId(resource.getId());
		response.setName(resource.getName());
		response.setDescription(resource.getDescription());
		response.setType(resource.getType());
		response.setCapacity(resource.getCapacity());
		response.setLocation(resource.getLocation());
		response.setAvailabilityStart(resource.getAvailabilityStart());
		response.setAvailabilityEnd(resource.getAvailabilityEnd());
		response.setStatus(resource.getStatus());
		return response;
	}
}

