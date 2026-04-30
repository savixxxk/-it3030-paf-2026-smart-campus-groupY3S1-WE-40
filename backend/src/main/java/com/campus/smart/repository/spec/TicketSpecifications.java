package com.campus.smart.repository.spec;

import org.springframework.data.jpa.domain.Specification;

import com.campus.smart.enums.TicketCategory;
import com.campus.smart.enums.TicketPriority;
import com.campus.smart.enums.TicketStatus;
import com.campus.smart.model.Ticket;

public final class TicketSpecifications {
	private TicketSpecifications() {
	}

	public static Specification<Ticket> hasStatus(TicketStatus status) {
		return (root, query, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
	}

	public static Specification<Ticket> hasPriority(TicketPriority priority) {
		return (root, query, cb) -> priority == null ? cb.conjunction() : cb.equal(root.get("priority"), priority);
	}

	public static Specification<Ticket> hasCategory(TicketCategory category) {
		return (root, query, cb) -> category == null ? cb.conjunction() : cb.equal(root.get("category"), category);
	}

	public static Specification<Ticket> hasResourceId(Long resourceId) {
		return (root, query, cb) -> resourceId == null ? cb.conjunction() : cb.equal(root.get("resource").get("id"), resourceId);
	}
}

