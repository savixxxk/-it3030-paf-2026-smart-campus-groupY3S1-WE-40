package com.campus.smart.exception;

public class InvalidLoginCredentialsException extends RuntimeException {

	public InvalidLoginCredentialsException(String message) {
		super(message);
	}
}