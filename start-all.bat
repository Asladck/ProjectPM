@echo off
color 0A
echo ========================================
echo    SDU Platform - Starting All Services
echo ========================================
echo.

echo [1/3] Starting Java Assignment Service (port 4062)...
start "Assignment Service - Port 4062" cmd /k "start-assignment-service.bat"
timeout /t 5 /nobreak >nul

echo [2/3] Starting Java Attendance Service (port 4061)...
start "Attendance Service - Port 4061" cmd /k "start-attendance-service.bat"
timeout /t 5 /nobreak >nul

echo [3/3] Starting Go Backend (ports 9090, 8085, 50051)...
start "Go Backend - Ports 9090, 8085, 50051" cmd /k "start-go-backend.bat"
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo    All Services Started Successfully!
echo ========================================
echo.
echo Services are running:
echo   [OK] Java Assignment Service:  http://localhost:4062
echo   [OK] Java Attendance Service:  http://localhost:4061
echo   [OK] Go Auth API:              http://localhost:9090
echo   [OK] WebSocket + Frontend:     http://localhost:8085
echo   [OK] gRPC Server:              localhost:50051
echo.
echo ========================================
echo.

echo Waiting for services to initialize...
timeout /t 10 /nobreak >nul

echo Opening application in browser...
start http://localhost:8085

echo.
echo ========================================
echo Services are running in separate windows
echo Close this window to keep services running
echo ========================================
echo.
pause

