package com.campus.smart.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campus.smart.model.Resource;
import com.campus.smart.repository.ResourceRepository;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

	private final ResourceRepository resourceRepository;

	public ResourceController(ResourceRepository resourceRepository) {
		this.resourceRepository = resourceRepository;
	}

	@GetMapping
	public List<Resource> getAll(@RequestParam(required = false) String query) {
		if (query == null || query.isBlank()) {
			return resourceRepository.findAll();
		}
		return resourceRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(query, query);
	}

	@GetMapping("/available")
	public List<Resource> getAvailable() {
		return resourceRepository.findByAvailableTrue();
	}
}

