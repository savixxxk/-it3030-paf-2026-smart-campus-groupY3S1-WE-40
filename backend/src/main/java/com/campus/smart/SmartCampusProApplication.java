package com.campus.smart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartCampusProApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartCampusProApplication.class, args);
	}
}
