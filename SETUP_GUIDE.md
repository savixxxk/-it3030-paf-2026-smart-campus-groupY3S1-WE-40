# Smart Campus - Setup Guide

Complete guide for setting up the Smart Campus project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Git** (v2.0+) - [Download](https://git-scm.com/)
- **Docker Desktop** (v20.10+) - [Download](https://www.docker.com/products/docker-desktop)
- **Docker Compose** (v1.29+) - Included with Docker Desktop

### Optional (for local development without Docker)
- **Java 17+** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.8+** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm 8+** - Included with Node.js
- **MySQL 8.0** - [Download](https://www.mysql.com/downloads/mysql/)

## Quick Start with Docker (Recommended)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd smart-campus-project
```

### Step 2: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings (optional for initial setup)
```

### Step 3: Build and Start Services
```bash
# Build and start all services (frontend, backend, database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Step 4: Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8081
- **MySQL Database**: localhost:3306

## Local Development Setup

### Backend Setup

#### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0

#### Installation Steps

1. **Install Dependencies**
   ```bash
   cd backend
   ./mvnw clean install
   ```

2. **Configure Application**
   ```bash
   # Copy the environment template
   cp src/main/resources/application.properties src/main/resources/application-local.properties
   
   # Edit application-local.properties with your database credentials
   ```

3. **Start the Backend**
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
   ```

4. **Verify Backend**
   - Visit http://localhost:8081/api/health
   - Should return: `{"status":"UP"}`

#### Database Setup (without Docker)

1. **Create Database**
   ```bash
   mysql -u root -p
   ```

2. **Run in MySQL Shell**
   ```sql
   CREATE DATABASE smart_campus;
   CREATE USER 'campus_user'@'localhost' IDENTIFIED BY 'campus_pass';
   GRANT ALL PRIVILEGES ON smart_campus.* TO 'campus_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Import Initial Data**
   ```bash
   mysql -u campus_user -p smart_campus < scripts/init.sql
   ```

### Frontend Setup

#### Prerequisites
- Node.js 16+
- npm 8+

#### Installation Steps

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Create .env file
   echo "VITE_API_BASE_URL=http://localhost:8081/api" > .env
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Frontend**
   - Visit http://localhost:5173
   - Should display the login page

## Testing the Application

### Login Credentials

**Default Admin Account:**
- Email: `admin@gmail.com`
- Password: `Admin@1`

**Sample Student Accounts:**
```
john.doe@student.edu / Admin@1
jane.smith@student.edu / Admin@1
mike.johnson@student.edu / Admin@1
```

### First Time Setup Test

1. Open http://localhost:5173
2. Click "Login"
3. Enter admin credentials
4. Should see the dashboard
5. Navigate to "Resources" to see available facilities
6. Try creating a booking for a resource

## Troubleshooting

### Docker Issues

**Docker daemon not running**
```bash
# Restart Docker Desktop or run:
sudo systemctl start docker  # Linux
```

**Port already in use**
```bash
# Check which process is using port 8081
lsof -i :8081  # macOS/Linux
netstat -ano | findstr :8081  # Windows

# Change port in docker-compose.yml
# Change "8081:8081" to "8082:8081"
```

**Database connection error**
```bash
# Check container logs
docker-compose logs mysql

# Restart database service
docker-compose restart mysql
```

### Backend Issues

**Maven build fails**
```bash
# Clear Maven cache
./mvnw clean -U install

# Verify Java version
java -version  # Should be 17+
```

**Database connection refused**
```bash
# Verify MySQL is running
sudo systemctl status mysql  # Linux
brew services list  # macOS

# Check connection details in application.properties
```

### Frontend Issues

**npm install fails**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Port 5173 already in use**
```bash
# Run on different port
npm run dev -- --port 3000
```

## Development Workflow

### Backend Development
```bash
cd backend

# Run tests
./mvnw test

# Run specific test
./mvnw test -Dtest=UserControllerTest

# Build JAR
./mvnw package

# Generate documentation
./mvnw javadoc:javadoc
```

### Frontend Development
```bash
cd frontend

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment

### Docker Deployment

1. **Build Images**
   ```bash
   docker-compose build --no-cache
   ```

2. **Deploy**
   ```bash
   docker-compose up -d
   ```

3. **Scale Services** (if needed)
   ```bash
   docker-compose up -d --scale backend=3
   ```

### Production Checklist

- [ ] Set strong admin password
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for production domain
- [ ] Set up backup strategy
- [ ] Configure logging and monitoring
- [ ] Review security settings
- [ ] Set up CI/CD pipeline

## Useful Commands

### Docker
```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View logs
docker-compose logs [service_name]

# Execute command in container
docker-compose exec backend sh

# Stop services
docker-compose stop

# Remove services
docker-compose down -v

# Rebuild services
docker-compose up --build
```

### Git
```bash
# Clone with specific branch
git clone -b branch-name <url>

# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git commit -m "type: description"

# Push to remote
git push origin feature/feature-name

# Create pull request on GitHub
```

### Database
```bash
# Access MySQL
mysql -u campus_user -p smart_campus

# Export database
mysqldump -u campus_user -p smart_campus > backup.sql

# Import database
mysql -u campus_user -p smart_campus < backup.sql

# Create database backup
mysqldump -u campus_user -p --all-databases > backup_all.sql
```

## Getting Help

- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Check project README for overview
- Open an issue on GitHub for bugs/features

## Next Steps

After setup, you can:
1. Create a new feature branch
2. Make your changes
3. Test thoroughly
4. Commit with meaningful messages
5. Push and create a pull request

Happy coding! 🚀
