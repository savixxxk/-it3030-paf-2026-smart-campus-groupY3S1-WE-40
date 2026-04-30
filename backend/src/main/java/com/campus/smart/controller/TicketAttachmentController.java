package com.campus.smart.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.campus.smart.service.TicketAttachmentService;

@RestController
@RequestMapping("/api/tickets")
public class TicketAttachmentController {
	private final TicketAttachmentService attachmentService;

	public TicketAttachmentController(TicketAttachmentService attachmentService) {
		this.attachmentService = attachmentService;
	}

	@PostMapping("/{ticketId}/attachments")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<List<String>> upload(
			@PathVariable Long ticketId,
			@RequestPart("files") List<MultipartFile> files,
			Principal principal) {
		return ResponseEntity.status(HttpStatus.CREATED).body(attachmentService.upload(ticketId, principal.getName(), files));
	}
}

