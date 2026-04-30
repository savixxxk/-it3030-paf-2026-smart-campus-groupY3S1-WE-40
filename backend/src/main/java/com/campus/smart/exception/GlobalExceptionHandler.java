package com.campus.smart.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<Map<String, String>> handleDataIntegrity(DataIntegrityViolationException ex) {
		return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Conflict", "error", ex.getMostSpecificCause().getMessage()));
	}

	@ExceptionHandler(BookingNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleBookingNotFound(BookingNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(BookingConflictException.class)
	public ResponseEntity<Map<String, String>> handleBookingConflict(BookingConflictException ex) {
		return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(ForbiddenOperationException.class)
	public ResponseEntity<Map<String, String>> handleForbiddenOperation(ForbiddenOperationException ex) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(TicketNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleTicketNotFound(TicketNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(CommentNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleCommentNotFound(CommentNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(InvalidStatusTransitionException.class)
	public ResponseEntity<Map<String, String>> handleInvalidTransition(InvalidStatusTransitionException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(AttachmentLimitException.class)
	public ResponseEntity<Map<String, String>> handleAttachmentLimit(AttachmentLimitException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
	}

	@ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleAuthenticationMissing(AuthenticationCredentialsNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden"));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of("message", "Something went wrong", "error", ex.getMessage()));
	}
}
