# Smart Campus Operations Hub

## Introduction

The Smart Campus Operations Hub is a full-stack web application developed as part of the IT3030 Programming Applications and Frameworks assignment for Semester 1, 2026. The system is designed to modernize and streamline university day-to-day operations through a single unified web platform.

The platform addresses two key operational domains of a modern university campus:

• **Facility and Asset Management** – enabling the booking and management of rooms, laboratories, meeting spaces, and shared equipment such as projectors and cameras.

• **Maintenance and Incident Ticketing** – allowing users to report faults, track repair progress, and manage technician assignments through a structured ticketing workflow.

The system is built using a Spring Boot REST API backend and a React-based client web application frontend, following RESTful architectural principles, role-based access control, and OAuth 2.0 authentication. The application supports clearly defined workflows and strong auditability across all operations.

---

## API Functions by Team Member

### Member 1: Facilities Catalogue + Resource Management Endpoints

**ResourceController** – Manages the university resource catalog and facility operations.

| Function | Endpoint | Method | Access | Description |
|----------|----------|--------|--------|-------------|
| **Create Resource** | `/api/resources` | POST | ADMIN | Create a new facility or equipment resource with details (name, type, capacity, location) |
| **List All Resources** | `/api/resources` | GET | ADMIN, USER | Retrieve all available resources with optional filtering by type, capacity, or location |
| **Get Resource Details** | `/api/resources/{id}` | GET | ADMIN, USER | Fetch detailed information about a specific resource |
| **Update Resource** | `/api/resources/{id}` | PUT | ADMIN | Modify resource information (capacity, location, availability) |
| **Delete Resource** | `/api/resources/{id}` | DELETE | ADMIN | Remove a resource from the system |

**Key Business Logic:**
- Resource types: Classrooms, Meeting Rooms, Laboratories, Equipment (projectors, cameras, etc.)
- Search and filter by type, capacity, and location
- Admin-only creation and modification to maintain data integrity

---

### Member 2: Booking Workflow + Conflict Checking

**BookingController** – Manages resource bookings with intelligent conflict detection.

| Function | Endpoint | Method | Access | Description |
|----------|----------|--------|--------|-------------|
| **Create Booking** | `/api/bookings` | POST | USER | Submit a booking request for a resource (includes automatic conflict checking) |
| **Get My Bookings** | `/api/bookings/my` | GET | USER | Retrieve all bookings made by the authenticated user |
| **Get All Bookings** | `/api/bookings` | GET | ADMIN | Admin view of all bookings with filtering by status or resource |
| **Approve Booking** | `/api/bookings/{id}/approve` | PUT | ADMIN | Admin approves a pending booking request |
| **Reject Booking** | `/api/bookings/{id}/reject` | PUT | ADMIN | Admin rejects a booking request with optional reason |
| **Cancel Booking** | `/api/bookings/{id}/cancel` | PUT | USER | User cancels their own booking |

**Key Business Logic:**
- **Conflict Detection:** Prevents double-booking by checking time overlaps
- **Booking Workflow:** PENDING → APPROVED/REJECTED → ACTIVE → COMPLETED/CANCELLED
- **Status Filtering:** Track bookings by status (pending, approved, active, completed, cancelled)
- **User Authorization:** Users can only cancel their own bookings; admins have full control

---

### Member 3: Incident Tickets + Attachments + Technician Updates

**TicketController** – Central hub for incident reporting and technician workflow management.

| Function | Endpoint | Method | Access | Description |
|----------|----------|--------|--------|-------------|
| **Create Ticket** | `/api/tickets` | POST | USER | Submit a maintenance or fault report with description, priority, and category |
| **Get My Tickets** | `/api/tickets/my` | GET | USER | View all tickets created by the authenticated user |
| **Get All Tickets** | `/api/tickets` | GET | ADMIN | Admin search for all tickets with filtering by status, priority, or category |
| **Get Ticket Details** | `/api/tickets/{id}` | GET | ADMIN, TECHNICIAN, USER | Retrieve full ticket information (role-based access) |
| **Assign Ticket** | `/api/tickets/{id}/assign` | PUT | ADMIN | Assign a ticket to a specific technician |
| **Reject Ticket** | `/api/tickets/{id}/reject` | PUT | ADMIN | Reject a ticket with reason (returns to user) |
| **Update Status** | `/api/tickets/{id}/status` | PUT | ADMIN, TECHNICIAN | Change ticket status (IN_PROGRESS, PENDING_APPROVAL, etc.) |
| **Resolve Ticket** | `/api/tickets/{id}/resolve` | PUT | ADMIN, TECHNICIAN | Mark ticket as resolved with solution notes |
| **Close Ticket** | `/api/tickets/{id}/close` | PUT | ADMIN | Finalize and archive a resolved ticket |

**TicketAttachmentController** – File upload for evidence and documentation.

| Function | Endpoint | Method | Access | Description |
|----------|----------|--------|--------|-------------|
| **Upload Attachments** | `/api/tickets/{ticketId}/attachments` | POST | USER | Upload multiple files (images, documents) to a ticket for evidence |

**CommentController** – Discussion and communication within tickets.

| Function | Endpoint | Method | Access | Description |
|----------|----------|--------|--------|-------------|
| **Add Comment** | `/api/tickets/{ticketId}/comments` | POST | USER, ADMIN, TECHNICIAN | Add communication/updates to a ticket |
| **Update Comment** | `/api/comments/{commentId}` | PUT | USER, ADMIN | Edit a previously submitted comment |
| **Delete Comment** | `/api/comments/{commentId}` | DELETE | USER, ADMIN | Remove a comment from a ticket |

**Key Business Logic:**
- **Ticket Categories:** Building Issues, Equipment Failure, Safety Hazard, Cleaning, etc.
- **Priority Levels:** LOW, MEDIUM, HIGH, CRITICAL
- **Ticket Workflow:** OPEN → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED
- **Technician Assignment:** Admin assigns tickets to appropriate technicians
- **File Attachments:** Support for photos/evidence to assist with repairs
- **Role-Based Access:** Users only see their own tickets; staff see all tickets
- **Comment Tracking:** Full conversation history for audit trail

---

### Member 4: Notifications + Role Management + OAuth Integration

**AuthController** – User authentication and session management with OAuth 2.0 support.

| Function | Endpoint | Method | Access | Description |
|----------|----------|--------|--------|-------------|
| **Register User** | `/api/auth/register` | POST | PUBLIC | Create a new user account with email and password |
| **Login User** | `/api/auth/login` | POST | PUBLIC | Authenticate user and establish secure session |

**NotificationController** – System-wide notification management.

| Function | Endpoint | Method | Access | Description |
|----------|----------|--------|--------|-------------|
| **Get Admin Notifications** | `/api/notifications/admin` | GET | PUBLIC | Retrieve all system notifications (admin view) |
| **Create Notification** | `/api/notifications/admin` | POST | PUBLIC | Admin creates and broadcasts a system notification |
| **Get Student Notifications** | `/api/notifications/student` | GET | PUBLIC | Retrieve notifications for a specific student |
| **Mark As Read** | `/api/notifications/{id}/read` | POST | PUBLIC | Mark a notification as read for the user |

**NotificationPreferenceController** – User notification customization.

| Function | Endpoint | Method | Access | Description |
|----------|----------|--------|--------|-------------|
| **Get Preferences** | `/api/preferences/notifications` | GET | PUBLIC | Retrieve user's notification category preferences |
| **Update Preference** | `/api/preferences/notifications` | PUT | PUBLIC | Enable/disable notifications for specific categories |

**UserController** – User management and system health.

| Function | Endpoint | Method | Access | Description |
|----------|----------|--------|--------|-------------|
| **Get User by Email** | `/api/users/by-email` | GET | PUBLIC | Fetch user details using email address |
| **Health Check** | `/api/users/health` | GET | PUBLIC | System health status endpoint |

**Key Business Logic:**
- **User Roles:** USER (students), ADMIN (staff), TECHNICIAN (maintenance staff)
- **OAuth 2.0 Integration:** Session management with secure tokens
- **Role-Based Access Control:** Different endpoints available based on user role
- **Notification Categories:** Bookings, Tickets, Maintenance, Administrative
- **User Preferences:** Control which notification types to receive
- **Session Management:** Secure HTTP session storage with Spring Security

---

## Technology Stack

**Backend:** Spring Boot 3.x, Spring Security, JPA/Hibernate, MySQL  
**Frontend:** React 18, Vite, Tailwind CSS, Context API  
**Authentication:** OAuth 2.0, Session-based Security  
**API Design:** RESTful with JSON request/response bodies

---

**SMTP / Email notifications**

To enable email notifications, configure SMTP settings in `backend/src/main/resources/application.properties` or via environment variables:

- `MAIL_HOST` – SMTP server host (default: localhost)
- `MAIL_PORT` – SMTP server port (default: 1025 for local testing with tools like MailHog)
- `MAIL_USERNAME` / `MAIL_PASSWORD` – Credentials if required
- `MAIL_SMTP_AUTH` – true/false
- `MAIL_STARTTLS` – true/false

When a new notification is created, the backend will send an email to users who have the respective notification category enabled in their preferences.

---

**Frontend: Enabling Google OAuth locally**

To enable the Google sign-in button during local development:

1. Copy `frontend/.env.example` to `frontend/.env.local` (or `frontend/.env`) and set:

	- `VITE_ENABLE_GOOGLE_OAUTH=true`
	- `VITE_API_BASE_URL` to your backend (default: `http://localhost:8081`)

2. Ensure the backend has real Google client credentials set (environment variables `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`) and that the Google Cloud Console OAuth client includes the redirect URI:

	`http://localhost:8081/login/oauth2/code/google`

3. Restart the frontend dev server (`npm run dev` or `yarn dev`) so Vite picks up the new env variables.

If you still see the message "Google sign-in is disabled in local development...", double-check that `VITE_ENABLE_GOOGLE_OAUTH` is exactly `true` (string) in your env file and that you restarted the dev server.