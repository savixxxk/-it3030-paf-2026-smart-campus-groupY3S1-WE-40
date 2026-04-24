# Smart Campus - IT3030 PAF 2026

A comprehensive smart campus management system for educational institutions, built with Spring Boot backend and React + Vite frontend.

## Project Overview

This is a full-stack application designed to streamline campus operations including:
- Resource management (facilities, rooms, equipment)
- Facility bookings
- Ticket management system
- User notifications and preferences
- Student analytics
- Admin dashboard

## Technology Stack

### Backend
- Spring Boot 3.x
- Java 17+
- MySQL 8.0
- Spring Security with OAuth2
- Spring Data JPA

### Frontend
- React 18
- Vite
- TailwindCSS
- Context API for state management

## Project Structure

```
├── backend/          # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/campus/smart/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── model/
│   │   │   │   ├── dto/
│   │   │   │   └── security/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── routes/
│   └── package.json
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Java 17+ (for local development)
- Node.js 16+ (for frontend)
- MySQL 8.0 (optional, can use Docker)

### Quick Start with Docker

```bash
docker-compose up -d
```

### Local Development Setup

#### Backend
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Resources: `/api/resources/*`
- Bookings: `/api/bookings/*`
- Tickets: `/api/tickets/*`
- Notifications: `/api/notifications/*`
- Analytics: `/api/analytics/*`

## Environment Configuration

Copy `.env.example` to `.env` and configure the required variables.

## Contributing

Please follow the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md)

## License

This project is part of IT3030 PAF course at University.
