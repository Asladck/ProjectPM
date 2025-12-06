# SDU Platform - Complete Web Application

Modern, responsive educational platform built with pure HTML, CSS, and JavaScript (no frameworks).

## 🎨 Features

- **Modern UI/UX**: Glassmorphism design, smooth animations, gradient backgrounds
- **Authentication**: JWT-based login/register system
- **Dashboard**: Overview of assignments, attendance, and courses
- **Assignments**: Create, view, and submit assignments with file upload
- **Attendance**: Mark and track attendance for courses and sessions
- **Real-time Chat**: WebSocket-based live messaging
- **Responsive Design**: Works on mobile, tablet, and desktop
- **No Dependencies**: Pure vanilla JavaScript - no frameworks needed

## 📁 Project Structure

```
web/
├── public/               # HTML pages
│   ├── login.html       # Login page
│   ├── register.html    # Registration page
│   ├── index.html       # Dashboard
│   ├── assignments.html # Assignments page
│   ├── attendance.html  # Attendance tracking
│   └── chat.html        # Real-time chat
├── css/                 # Stylesheets
│   ├── main.css         # Main styles
│   └── animations.css   # Animations & page-specific styles
└── js/                  # JavaScript
    ├── api.js           # API service & backend integration
    ├── auth.js          # Authentication logic
    ├── dashboard.js     # Dashboard functionality
    ├── assignments.js   # Assignments management
    ├── attendance.js    # Attendance tracking
    └── chat.js          # WebSocket chat client
```

## 🚀 Backend Services

### 1. Go Auth Service (Port 9090)
```
POST /auth/sign-up
POST /auth/sign-in
POST /auth/refresh
```

### 2. Java Attendance Service (Port 4061)
```
GET  /attendance/getCourse/{id}
GET  /attendance/session/{sessionId}
POST /attendance
```

### 3. Java Assignment Service (Port 4062)
```
GET  /uploadAssignment/getAll
POST /uploadAssignment/create
POST /submit/assignment
```

### 4. Go WebSocket Service (Port 8085)
```
WS /ws?token={access_token}
```

## 🛠️ Setup & Installation

### Prerequisites
- Go 1.20+
- Java 17+
- All backend services running on their respective ports

### Start Backend Services

1. **Start Go Auth Service** (Port 9090)
```bash
cd cmd
go run main.go
```

2. **Start Java Attendance Service** (Port 4061)
```bash
cd java/inf451/attendance_check-service
mvn spring-boot:run
```

3. **Start Java Assignment Service** (Port 4062)
```bash
cd java/inf451/file_upload-download
mvn spring-boot:run
```

4. **Start Go WebSocket Server** (Port 8085)
```bash
# The WebSocket server should be started by your main application
# It serves the web frontend and handles WebSocket connections
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:8085/
```

This will redirect you to the login page. From there you can:
1. Register a new account (Student or Teacher)
2. Login with your credentials
3. Access the dashboard and all features

## 🎯 Usage Guide

### Authentication

1. **Register**: Create an account with name, surname, email, password, and role (Student/Teacher)
2. **Login**: Use your email and password to sign in
3. **Auto Refresh**: Tokens are automatically refreshed when they expire

### Dashboard

- View statistics: assignments count, attendance rate, messages, courses
- Quick access to recent assignments
- Quick action buttons for common tasks

### Assignments

**For Students:**
- View all assignments
- Filter by status (All, Pending, Submitted, Late)
- Submit assignments with file upload (PDF, DOC, DOCX)

**For Teachers:**
- Create new assignments
- Set due dates
- Assign to specific students

### Attendance

1. Select a course from the dropdown
2. Select a session
3. View attendance records
4. Mark your attendance (Present, Late, Absent)

### Chat

- Real-time messaging with WebSocket
- See who's online
- Messages are delivered instantly
- Auto-scroll to latest messages
- Character counter (max 500 chars)

## 🎨 Design Features

### Glassmorphism
- Frosted glass effect with backdrop-filter
- Semi-transparent backgrounds
- Soft shadows and borders

### Animations
- Fade in / slide in animations
- Staggered list animations
- Smooth transitions
- Loading states
- Pulse effects for status indicators

### Responsive
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly buttons
- Hamburger menu (if implemented)

## 🔐 Security

- JWT tokens stored in localStorage
- Authorization header on all protected requests
- Automatic token refresh
- Secure WebSocket connections
- XSS prevention with HTML escaping

## 🐛 Troubleshooting

### WebSocket Connection Fails
- Ensure the WebSocket server is running on port 8085
- Check that you're logged in and have a valid token
- Check browser console for errors

### API Calls Fail
- Verify all backend services are running
- Check CORS settings if accessing from different origin
- Verify token is valid (check localStorage)

### Styles Not Loading
- Clear browser cache
- Check file paths in HTML
- Ensure web server is serving static files correctly

## 📝 API Integration Examples

### Login
```javascript
await api.signIn(email, password, role);
```

### Get Assignments
```javascript
const assignments = await api.getAllAssignments();
```

### Submit Assignment
```javascript
await api.submitAssignment(studentId, assignmentId, file);
```

### Mark Attendance
```javascript
await api.markAttendance(studentId, sessionId, 'PRESENT');
```

### WebSocket Chat
```javascript
const ws = api.createWebSocket();
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    displayMessage(message);
};
ws.send(JSON.stringify({ text: 'Hello!' }));
```

## 🌟 Future Enhancements

- [ ] Profile page
- [ ] Notifications system
- [ ] File preview for assignments
- [ ] Grade management
- [ ] Calendar view
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Mobile app version

## 📄 License

This project is part of SDU Platform educational system.

## 👥 Contributors

Built with ❤️ for SDU Platform

