# 🚀 SDU Platform - Deployment Guide

## Complete Deployment Instructions

### 📋 Prerequisites

- **Go**: 1.20 or higher
- **Java**: JDK 17 or higher
- **Maven**: 3.6 or higher
- **PostgreSQL**: 13 or higher (if using database)
- **Modern Web Browser**: Chrome, Firefox, Edge, or Safari

### 🗂️ Project Structure Verification

Ensure your project has the following structure:

```
Pjpro/
├── cmd/
│   └── main.go
├── internal/
│   ├── ws_server/
│   ├── handler/
│   ├── service/
│   └── repository/
├── java/
│   └── inf451/
│       ├── attendance_check-service/
│       └── file_upload-download/
└── web/
    ├── public/
    ├── css/
    └── js/
```

---

## 🔧 Backend Setup

### Step 1: Start PostgreSQL Database

If using Docker:
```bash
docker-compose up -d postgres
```

Or start your local PostgreSQL instance and create databases:
```sql
CREATE DATABASE sdu_platform_auth;
CREATE DATABASE sdu_platform_attendance;
CREATE DATABASE sdu_platform_assignments;
```

### Step 2: Run Database Migrations

```bash
cd C:\Users\DWA\GolandProjects\Pjpro

# Run migrations (if you have migration tool)
migrate -path migrations -database "postgresql://user:password@localhost:5432/sdu_platform_auth?sslmode=disable" up
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=sdu_platform_auth

# JWT
JWT_SECRET=qweqroqwro123e21edwqdl@@
JWT_EXPIRATION=24h

# Server Ports
AUTH_PORT=9090
ATTENDANCE_PORT=4061
ASSIGNMENT_PORT=4062
WS_PORT=8085

# CORS
ALLOWED_ORIGINS=http://localhost:8085
```

### Step 4: Start Go Services

#### Auth & WebSocket Service (Port 9090 & 8085)

```bash
cd C:\Users\DWA\GolandProjects\Pjpro

# Install dependencies
go mod download

# Run the main application
go run cmd/main.go
```

Expected output:
```
[GIN-debug] Listening and serving HTTP on :9090
[GIN-debug] Listening and serving HTTP on :8085
```

### Step 5: Start Java Services

#### Attendance Service (Port 4061)

Terminal 1:
```bash
cd C:\Users\DWA\GolandProjects\Pjpro\java\inf451\attendance_check-service

# Windows
mvnw.cmd clean install
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw clean install
./mvnw spring-boot:run
```

Expected output:
```
Tomcat started on port(s): 4061 (http)
```

#### Assignment Service (Port 4062)

Terminal 2:
```bash
cd C:\Users\DWA\GolandProjects\Pjpro\java\inf451\file_upload-download

# Windows
mvnw.cmd clean install
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw clean install
./mvnw spring-boot:run
```

Expected output:
```
Tomcat started on port(s): 4062 (http)
```

---

## 🌐 Frontend Deployment

The frontend is already configured to be served by the WebSocket server on port 8085.

### Access the Application

Open your browser and navigate to:
```
http://localhost:8085/
```

You will be automatically redirected to:
```
http://localhost:8085/public/login.html
```

---

## ✅ Verification Steps

### 1. Check All Services Are Running

Open multiple terminals and verify each service:

```bash
# Check Auth Service
curl http://localhost:9090/api/test
# Expected: "Test is successful"

# Check WebSocket Service
curl http://localhost:8085/api/test
# Expected: "Test is successful"

# Check Attendance Service
curl http://localhost:4061/actuator/health
# Expected: {"status":"UP"}

# Check Assignment Service
curl http://localhost:4062/actuator/health
# Expected: {"status":"UP"}
```

### 2. Use Test Page

Navigate to:
```
http://localhost:8085/public/test.html
```

This page will automatically check all service statuses and provide testing buttons.

### 3. Test Authentication Flow

1. Go to http://localhost:8085/public/register.html
2. Create a new account:
   - Name: John
   - Surname: Doe
   - Email: john.doe@sdu.edu.kz
   - Password: password123
   - Role: Student
3. Click "Sign Up"
4. Login with your credentials
5. You should be redirected to the dashboard

---

## 🐛 Troubleshooting

### Service Won't Start

**Port Already in Use:**
```bash
# Windows - Find process using port
netstat -ano | findstr :9090
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :9090
kill -9 <PID>
```

### CORS Errors

Update your Java services to allow CORS:

**application.yaml** (in both Java services):
```yaml
spring:
  web:
    cors:
      allowed-origins: "http://localhost:8085"
      allowed-methods: "*"
      allowed-headers: "*"
      allow-credentials: true
```

### Database Connection Failed

1. Verify PostgreSQL is running:
```bash
pg_isready
```

2. Check connection string in configs

3. Verify database exists:
```sql
\l  -- List all databases
```

### WebSocket Connection Failed

1. Check that token is valid:
   - Open browser DevTools (F12)
   - Go to Application → Local Storage
   - Verify `accessToken` exists

2. Check WebSocket server logs for errors

3. Ensure firewall allows port 8085

---

## 🔒 Security Checklist

- [ ] Change JWT secret in production
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable SQL injection protection
- [ ] Use secure WebSocket (wss://) in production

---

## 📊 Production Deployment

### Using Docker

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: sdu_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  auth-service:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "9090:9090"
    environment:
      - DB_HOST=postgres
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres

  ws-service:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8085:8085"
    volumes:
      - ./web:/app/web
    depends_on:
      - postgres

  attendance-service:
    build:
      context: ./java/inf451/attendance_check-service
      dockerfile: Dockerfile
    ports:
      - "4061:4061"
    depends_on:
      - postgres

  assignment-service:
    build:
      context: ./java/inf451/file_upload-download
      dockerfile: Dockerfile
    ports:
      - "4062:4062"
    volumes:
      - uploads:/app/uploads
    depends_on:
      - postgres

volumes:
  postgres_data:
  uploads:
```

Deploy with:
```bash
docker-compose up -d
```

### Nginx Reverse Proxy (Production)

```nginx
server {
    listen 80;
    server_name sdu-platform.com;

    location / {
        proxy_pass http://localhost:8085;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    location /api/auth/ {
        proxy_pass http://localhost:9090/;
    }

    location /api/attendance/ {
        proxy_pass http://localhost:4061/;
    }

    location /api/assignments/ {
        proxy_pass http://localhost:4062/;
    }
}
```

---

## 📈 Monitoring

### Health Check Endpoints

- Auth Service: `http://localhost:9090/api/test`
- Attendance: `http://localhost:4061/actuator/health`
- Assignment: `http://localhost:4062/actuator/health`
- WebSocket: `http://localhost:8085/api/test`

### Logs

- Go services: Console output or use logging library
- Java services: `logs/spring.log` (if configured)

---

## 🎉 Success!

If all services are running, you should see:

1. ✅ Auth service responding on port 9090
2. ✅ Attendance service responding on port 4061
3. ✅ Assignment service responding on port 4062
4. ✅ WebSocket & Frontend service responding on port 8085
5. ✅ Frontend accessible at http://localhost:8085
6. ✅ All features working (login, dashboard, assignments, attendance, chat)

---

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review service logs
3. Use the test page at `/public/test.html`
4. Verify all prerequisites are met
5. Check firewall/antivirus settings

---

## 🎯 Next Steps

After successful deployment:

1. Create test accounts (Student and Teacher)
2. Test all features
3. Configure production settings
4. Set up monitoring
5. Implement backups
6. Configure SSL/TLS
7. Set up CI/CD pipeline

---

**Congratulations! Your SDU Platform is now deployed and running! 🎊**

