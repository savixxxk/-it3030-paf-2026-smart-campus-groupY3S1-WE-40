-- Smart Campus Database Initialization Script
-- This script initializes the smart_campus database with required tables and sample data

-- Create database if not exists (usually handled by Docker but kept for manual setup)
-- CREATE DATABASE IF NOT EXISTS smart_campus;
-- USE smart_campus;

-- ===== CORE TABLES =====

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  phone VARCHAR(20),
  role ENUM('ADMIN', 'STUDENT', 'STAFF', 'GUEST') DEFAULT 'STUDENT',
  department VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type ENUM('ROOM', 'EQUIPMENT', 'FACILITY') NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INT,
  description TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  maintenance_start DATETIME NULL,
  maintenance_end DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by BIGINT,
  INDEX idx_type (type),
  INDEX idx_available (is_available),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  resource_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  start_date_time DATETIME NOT NULL,
  end_date_time DATETIME NOT NULL,
  purpose VARCHAR(255),
  status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
  approved_by BIGINT,
  approval_date DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_resource_id (resource_id),
  INDEX idx_status (status),
  INDEX idx_start_date (start_date_time),
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  category VARCHAR(100),
  status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED') DEFAULT 'OPEN',
  created_by BIGINT NOT NULL,
  assigned_to BIGINT,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  closed_at DATETIME NULL,
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_created_by (created_by),
  INDEX idx_assigned_to (assigned_to),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ticket Attachments Table
CREATE TABLE IF NOT EXISTS ticket_attachments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  uploaded_by BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ticket_id (ticket_id),
  INDEX idx_uploaded_by (uploaded_by),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  INDEX idx_ticket_id (ticket_id),
  INDEX idx_user_id (user_id),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('BOOKING', 'TICKET', 'SYSTEM', 'ANNOUNCEMENT') DEFAULT 'SYSTEM',
  related_entity_id BIGINT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE NOT NULL,
  email_notifications BOOLEAN DEFAULT TRUE,
  booking_updates BOOLEAN DEFAULT TRUE,
  ticket_updates BOOLEAN DEFAULT TRUE,
  system_announcements BOOLEAN DEFAULT TRUE,
  maintenance_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== SAMPLE DATA =====

-- Insert admin user
INSERT INTO users (name, email, password, role, department, is_active)
VALUES ('Admin User', 'admin@gmail.com', '$2a$10$mXqOQb8M0sJTUvXFLh1GCuk2t/aD6L1KR7E7yvMkGFf8B/wM5YEPK', 'ADMIN', 'Administration', TRUE);

-- Insert sample students
INSERT INTO users (name, email, password, role, department, is_active)
VALUES 
('John Doe', 'john.doe@student.edu', '$2a$10$mXqOQb8M0sJTUvXFLh1GCuk2t/aD6L1KR7E7yvMkGFf8B/wM5YEPK', 'STUDENT', 'Computer Science', TRUE),
('Jane Smith', 'jane.smith@student.edu', '$2a$10$mXqOQb8M0sJTUvXFLh1GCuk2t/aD6L1KR7E7yvMkGFf8B/wM5YEPK', 'STUDENT', 'Business', TRUE),
('Mike Johnson', 'mike.johnson@student.edu', '$2a$10$mXqOQb8M0sJTUvXFLh1GCuk2t/aD6L1KR7E7yvMkGFf8B/wM5YEPK', 'STUDENT', 'Engineering', TRUE);

-- Insert staff user
INSERT INTO users (name, email, password, role, department, is_active)
VALUES ('Staff Member', 'staff@campus.edu', '$2a$10$mXqOQb8M0sJTUvXFLh1GCuk2t/aD6L1KR7E7yvMkGFf8B/wM5YEPK', 'STAFF', 'Facilities', TRUE);

-- Insert sample resources
INSERT INTO resources (name, type, location, capacity, description, is_available, created_by)
VALUES 
('Conference Room A', 'ROOM', 'Building A, Floor 2', 20, 'Large conference room with AV equipment', TRUE, 1),
('Study Room 101', 'ROOM', 'Building B, Floor 1', 6, 'Quiet study room', TRUE, 1),
('Laboratory 201', 'ROOM', 'Building C, Floor 2', 30, 'Computer lab with 30 workstations', TRUE, 1),
('Projector', 'EQUIPMENT', 'Building A', NULL, 'HD Projector with 3000 lumens', TRUE, 1),
('Library', 'FACILITY', 'Building D', 200, 'Main campus library', TRUE, 1);

-- Create indexes for performance
CREATE INDEX idx_bookings_date_range ON bookings(start_date_time, end_date_time);
CREATE INDEX idx_tickets_category ON tickets(category);
CREATE INDEX idx_notifications_created_and_read ON notifications(created_at, is_read);

-- Add default notification preferences for existing users
INSERT INTO notification_preferences (user_id)
SELECT id FROM users WHERE id NOT IN (SELECT user_id FROM notification_preferences);

-- Display summary
SELECT 'Database initialization completed successfully!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_resources FROM resources;
SELECT COUNT(*) as total_bookings FROM bookings;
SELECT COUNT(*) as total_tickets FROM tickets;
