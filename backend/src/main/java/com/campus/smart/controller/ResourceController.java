package com.campus.smart.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campus.smart.dto.ResourceCreateRequest;
import com.campus.smart.dto.ResourceResponse;
import com.campus.smart.dto.ResourceUpdateRequest;
import com.campus.smart.enums.ResourceType;
import com.campus.smart.service.ResourceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {
	private final ResourceService resourceService;

	public ResourceController(ResourceService resourceService) {
		this.resourceService = resourceService;
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResourceResponse> create(@Valid @RequestBody ResourceCreateRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.create(request));
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	public List<ResourceResponse> getAll(
			@RequestParam(required = false) ResourceType type,
			@RequestParam(required = false) Integer capacity,
			@RequestParam(required = false) String location) {
		return resourceService.search(type, capacity, location);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	public ResourceResponse getById(@PathVariable Long id) {
		return resourceService.getById(id);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResourceResponse update(@PathVariable Long id, @Valid @RequestBody ResourceUpdateRequest request) {
		return resourceService.update(id, request);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		resourceService.delete(id);
		return ResponseEntity.noContent().build();
	}
}

