# 🚀 Quick Start Guide - SDU Platform

## 🐳 Docker Compose (Recommended)

### Start All Services
```bash
docker-compose up --build
```

This will start:
- **PostgreSQL** (5432) - Main database
- **MongoDB** (27017) - File storage
- **Go Backend + WebSocket** (9090, 8085, 50051)
- **Java Attendance Service** (4061)
- **Java File Upload Service** (4062)

### Access the Application
```
http://localhost:8085/
```

### Stop All Services
```bash
docker-compose down
```

---

## 💻 Manual Setup (Development)

### Step-by-Step Setup

### 1️⃣ Start Backend Services

#### Go Auth Service (Port 9090)
```bash
cd C:\Users\DWA\GolandProjects\Pjpro
go run cmd/main.go
```

#### Java Attendance Service (Port 4061)
```bash
cd C:\Users\DWA\GolandProjects\Pjpro\java\inf451\attendance_check-service
mvnw spring-boot:run
```
Or on Windows:
```cmd
cd C:\Users\DWA\GolandProjects\Pjpro\java\inf451\attendance_check-service
mvnw.cmd spring-boot:run
```

#### Java Assignment Service (Port 4062)
```bash
cd C:\Users\DWA\GolandProjects\Pjpro\java\inf451\file_upload-download
mvnw spring-boot:run
```
Or on Windows:
```cmd
cd C:\Users\DWA\GolandProjects\Pjpro\java\inf451\file_upload-download
mvnw.cmd spring-boot:run
```

### 2️⃣ Verify Services Are Running

Open browser and check:
- Auth Service: http://localhost:9090/api/test
- Attendance Service: http://localhost:4061/actuator/health
- Assignment Service: http://localhost:4062/actuator/health
- WebSocket Server: http://localhost:8085/

### 3️⃣ Access the Application

Open your browser and go to:
```
http://localhost:8085/
```

You will be redirected to the login page.

### 4️⃣ Create an Account

1. Click "Sign Up" link
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@sdu.edu.kz`
   - Password: `password123`
   - Role: `Student` or `Teacher`
3. Click "Sign Up"
4. You'll be redirected to login page

### 5️⃣ Login

1. Enter your email and password
2. Select your role
3. Click "Sign In"
4. You'll be redirected to the dashboard

### 6️⃣ Explore Features

**Dashboard**: Overview of your assignments, attendance, and stats

**Assignments**:
- View all assignments
- Filter by status
- Submit assignments (upload files)
- Teachers can create new assignments

**Attendance**:
- Select a course
- Select a session
- View attendance records
- Mark your attendance

**Chat**:
- Real-time messaging
- See online users
- Send and receive messages instantly

## 🔧 Troubleshooting

### Problem: "Failed to connect to backend"
**Solution**: Make sure all backend services are running
```bash
# Check if services are listening
netstat -an | findstr "9090 4061 4062 8085"
```

### Problem: "WebSocket connection failed"
**Solution**: 
1. Make sure you're logged in
2. Check that port 8085 is not blocked by firewall
3. Verify token is valid in localStorage (F12 → Application → Local Storage)

### Problem: "CORS error in browser console"
**Solution**: Backend services need to allow CORS from localhost:8085

### Problem: "Page styles not loading"
**Solution**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check that `/css` and `/js` folders exist in `web/` directory

### Problem: "Cannot upload assignment"
**Solution**: 
- Check file size (max 10MB)
- Use supported formats: PDF, DOC, DOCX
- Ensure assignment service is running on port 4062

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

## 🎯 Test Accounts

You can create test accounts with different roles:

**Student Account:**
- Email: student@sdu.edu.kz
- Password: student123
- Role: Student

**Teacher Account:**
- Email: teacher@sdu.edu.kz
- Password: teacher123
- Role: Teacher

## 📊 Default Data

The application comes with sample data:
- 4 sample courses
- Multiple assignment examples
- Sample attendance sessions

## 🔐 Security Notes

- Tokens are stored in localStorage
- Auto-refresh mechanism for expired tokens
- Secure WebSocket connections
- HTML escaping to prevent XSS

## 🆘 Need Help?

If you encounter any issues:
1. Check browser console (F12) for errors
2. Verify all services are running
3. Check network tab for failed requests
4. Ensure proper CORS configuration

## 🎉 Enjoy SDU Platform!

You're all set! Start exploring the features and enjoy the modern educational platform.

