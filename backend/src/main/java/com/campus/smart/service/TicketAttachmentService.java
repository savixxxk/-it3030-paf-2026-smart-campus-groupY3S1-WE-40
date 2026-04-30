package com.campus.smart.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface TicketAttachmentService {
	List<String> upload(Long ticketId, String userEmail, List<MultipartFile> files);
}

