package com.campus.smart.repository.spec;

import com.campus.smart.enums.ResourceType;
import com.campus.smart.model.Resource;
import org.springframework.data.jpa.domain.Specification;

public final class ResourceSpecifications {
	private ResourceSpecifications() {
	}

	public static Specification<Resource> hasType(ResourceType type) {
		return (root, query, cb) -> type == null ? cb.conjunction() : cb.equal(root.get("type"), type);
	}

	public static Specification<Resource> capacityAtLeast(Integer capacity) {
		return (root, query, cb) -> capacity == null ? cb.conjunction() : cb.greaterThanOrEqualTo(root.get("capacity"), capacity);
	}

	public static Specification<Resource> locationContains(String location) {
		return (root, query, cb) -> {
			if (location == null || location.isBlank()) {
				return cb.conjunction();
			}
			return cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%");
		};
	}
}

