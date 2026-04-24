# Smart Campus API Documentation

## Base URL
```
http://localhost:8081/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Auth Endpoints

### User Login
- **POST** `/auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** JWT token and user details

### User Signup
- **POST** `/auth/signup`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "STUDENT"
  }
  ```

### OAuth2 Google Login
- **GET** `/auth/oauth2/google`
- Redirects to Google login

### Logout
- **POST** `/auth/logout`
- Invalidates JWT token

---

## User Endpoints

### Get User Profile
- **GET** `/users/me`
- **Response:** Current user details

### Get All Users (Admin)
- **GET** `/users`
- **Query Parameters:**
  - `page`: Page number (default: 0)
  - `size`: Page size (default: 20)
  - `role`: Filter by role (ADMIN, STUDENT, STAFF)

### Update User Profile
- **PUT** `/users/{id}`
- **Request Body:**
  ```json
  {
    "name": "Updated Name",
    "email": "newemail@example.com"
  }
  ```

### Delete User (Admin)
- **DELETE** `/users/{id}`

---

## Resource Endpoints

### Get All Resources
- **GET** `/resources`
- **Query Parameters:**
  - `type`: Resource type (ROOM, EQUIPMENT, FACILITY)
  - `available`: Filter by availability (true/false)
  - `page`: Pagination

### Get Resource Details
- **GET** `/resources/{id}`

### Create Resource (Admin)
- **POST** `/resources`
- **Request Body:**
  ```json
  {
    "name": "Conference Room A",
    "type": "ROOM",
    "location": "Building A, Floor 2",
    "capacity": 20,
    "description": "Large conference room"
  }
  ```

### Update Resource (Admin)
- **PUT** `/resources/{id}`

### Delete Resource (Admin)
- **DELETE** `/resources/{id}`

---

## Booking Endpoints

### Get All Bookings
- **GET** `/bookings`
- **Query Parameters:**
  - `startDate`: Filter by start date
  - `endDate`: Filter by end date
  - `status`: PENDING, CONFIRMED, CANCELLED
  - `page`: Pagination

### Get User's Bookings
- **GET** `/bookings/my-bookings`

### Get Booking Details
- **GET** `/bookings/{id}`

### Create Booking
- **POST** `/bookings`
- **Request Body:**
  ```json
  {
    "resourceId": 1,
    "startDateTime": "2026-05-01T10:00:00",
    "endDateTime": "2026-05-01T12:00:00",
    "purpose": "Team meeting"
  }
  ```

### Cancel Booking
- **PUT** `/bookings/{id}/cancel`

### Approve Booking (Admin)
- **PUT** `/bookings/{id}/approve`

---

## Ticket Endpoints

### Get All Tickets
- **GET** `/tickets`
- **Query Parameters:**
  - `status`: OPEN, IN_PROGRESS, CLOSED
  - `priority`: LOW, MEDIUM, HIGH
  - `category`: Category filter

### Get User's Tickets
- **GET** `/tickets/my-tickets`

### Create Ticket
- **POST** `/tickets`
- **Request Body:**
  ```json
  {
    "title": "Classroom light not working",
    "description": "Light in room 101 is not working",
    "priority": "HIGH",
    "category": "MAINTENANCE"
  }
  ```

### Update Ticket
- **PUT** `/tickets/{id}`

### Close Ticket
- **PUT** `/tickets/{id}/close`

### Add Attachment to Ticket
- **POST** `/tickets/{id}/attachments`
- **Content-Type:** multipart/form-data

---

## Notification Endpoints

### Get All Notifications
- **GET** `/notifications`
- **Query Parameters:**
  - `read`: Filter by read status

### Get Notification Count (Unread)
- **GET** `/notifications/count`

### Mark Notification as Read
- **PUT** `/notifications/{id}/read`

### Mark All Notifications as Read
- **PUT** `/notifications/read-all`

### Delete Notification
- **DELETE** `/notifications/{id}`

---

## Notification Preference Endpoints

### Get Notification Preferences
- **GET** `/notification-preferences/me`

### Update Notification Preferences
- **PUT** `/notification-preferences`
- **Request Body:**
  ```json
  {
    "emailNotifications": true,
    "bookingUpdates": true,
    "ticketUpdates": true,
    "systemAnnouncements": true
  }
  ```

---

## Analytics Endpoints

### Get Dashboard Analytics
- **GET** `/analytics/dashboard`
- **Response:** Overall statistics

### Get Booking Analytics
- **GET** `/analytics/bookings`
- **Query Parameters:**
  - `startDate`: Start date
  - `endDate`: End date

### Get Ticket Analytics
- **GET** `/analytics/tickets`
- **Query Parameters:**
  - `startDate`: Start date
  - `endDate`: End date

### Get User Analytics (Admin)
- **GET** `/analytics/users`

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Description of what went wrong",
  "timestamp": "2026-04-24T10:30:00Z"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication token is missing or invalid"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- Rate limit: 1000 requests per hour per user
- Headers:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Versioning

Current API Version: v1

Future versions will use `/api/v2`, `/api/v3`, etc.

---

## Testing API with cURL

```bash
# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"Admin@1"}'

# Get resources
curl -X GET http://localhost:8081/api/resources \
  -H "Authorization: Bearer <token>"

# Create booking
curl -X POST http://localhost:8081/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"resourceId":1,"startDateTime":"2026-05-01T10:00:00","endDateTime":"2026-05-01T12:00:00","purpose":"Meeting"}'
```
