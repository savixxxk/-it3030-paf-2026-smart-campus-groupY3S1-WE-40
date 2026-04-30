package com.campus.smart.exception;

public class CommentNotFoundException extends RuntimeException {
	public CommentNotFoundException(Long id) {
		super("Comment not found: " + id);
	}
}

