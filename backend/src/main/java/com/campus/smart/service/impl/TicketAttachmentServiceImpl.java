package com.campus.smart.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.campus.smart.exception.AttachmentLimitException;
import com.campus.smart.exception.ForbiddenOperationException;
import com.campus.smart.exception.TicketNotFoundException;
import com.campus.smart.model.Ticket;
import com.campus.smart.model.TicketAttachment;
import com.campus.smart.repository.TicketAttachmentRepository;
import com.campus.smart.repository.TicketRepository;
import com.campus.smart.service.TicketAttachmentService;

@Service
public class TicketAttachmentServiceImpl implements TicketAttachmentService {
	private static final long MAX_FILE_BYTES = 5L * 1024 * 1024;
	private static final List<String> ALLOWED_TYPES = List.of("image/png", "image/jpeg", "image/webp");

	private final TicketRepository ticketRepository;
	private final TicketAttachmentRepository attachmentRepository;

	public TicketAttachmentServiceImpl(TicketRepository ticketRepository, TicketAttachmentRepository attachmentRepository) {
		this.ticketRepository = ticketRepository;
		this.attachmentRepository = attachmentRepository;
	}

	@Override
	@Transactional
	public List<String> upload(Long ticketId, String userEmail, List<MultipartFile> files) {
		if (files == null || files.isEmpty()) {
			return List.of();
		}

		Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId));
		String ownerEmail = ticket.getCreatedBy() != null ? ticket.getCreatedBy().getEmail() : null;
		if (ownerEmail == null || !ownerEmail.equalsIgnoreCase(userEmail)) {
			throw new ForbiddenOperationException("You can only upload attachments to your own tickets");
		}

		long existing = attachmentRepository.countByTicketId(ticketId);
		if (existing + files.size() > 3) {
			throw new AttachmentLimitException("Max 3 images per ticket");
		}

		Path baseDir = Paths.get("uploads", "tickets", String.valueOf(ticketId));
		try {
			Files.createDirectories(baseDir);
		} catch (IOException e) {
			throw new RuntimeException("Failed to create upload directory");
		}

		List<String> savedPaths = new ArrayList<>();
		for (MultipartFile file : files) {
			if (file == null || file.isEmpty()) continue;
			if (file.getSize() > MAX_FILE_BYTES) {
				throw new IllegalArgumentException("File too large. Max 5MB");
			}
			String type = file.getContentType();
			if (type == null || !ALLOWED_TYPES.contains(type)) {
				throw new IllegalArgumentException("Invalid file type: " + type);
			}

			String ext = type.equals("image/png") ? ".png" : type.equals("image/webp") ? ".webp" : ".jpg";
			String filename = UUID.randomUUID() + ext;
			Path target = baseDir.resolve(filename);
			try {
				Files.write(target, file.getBytes());
			} catch (IOException e) {
				throw new RuntimeException("Failed to save file");
			}

			TicketAttachment attachment = new TicketAttachment();
			attachment.setTicket(ticket);
			attachment.setFilePath(target.toString());
			attachmentRepository.save(attachment);
			savedPaths.add(attachment.getFilePath());
		}

		return savedPaths;
	}
}

