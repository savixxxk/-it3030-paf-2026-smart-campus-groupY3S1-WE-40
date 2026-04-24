package com.campus.smart.exception;

public class InvalidStatusTransitionException extends RuntimeException {
	public InvalidStatusTransitionException(String message) {
		super(message);
	}
}

