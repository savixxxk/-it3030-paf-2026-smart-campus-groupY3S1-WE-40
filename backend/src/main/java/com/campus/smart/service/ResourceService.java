package com.campus.smart.service;

import com.campus.smart.dto.ResourceCreateRequest;
import com.campus.smart.dto.ResourceResponse;
import com.campus.smart.dto.ResourceUpdateRequest;
import com.campus.smart.enums.ResourceType;

import java.util.List;

public interface ResourceService {
	ResourceResponse create(ResourceCreateRequest request);

	ResourceResponse getById(Long id);

	List<ResourceResponse> search(ResourceType type, Integer capacity, String location);

	ResourceResponse update(Long id, ResourceUpdateRequest request);

	void delete(Long id);
}

