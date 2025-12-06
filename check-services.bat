@echo off
echo ========================================
echo Checking SDU Platform Services
echo ========================================
echo.

echo Checking ports...
echo.

netstat -ano | findstr ":9090" >nul
if %errorlevel% equ 0 (
    echo [OK] Port 9090 - Go Auth Service is running
) else (
    echo [X] Port 9090 - Go Auth Service is NOT running
)

netstat -ano | findstr ":8085" >nul
if %errorlevel% equ 0 (
    echo [OK] Port 8085 - WebSocket Server is running
) else (
    echo [X] Port 8085 - WebSocket Server is NOT running
)

netstat -ano | findstr ":4061" >nul
if %errorlevel% equ 0 (
    echo [OK] Port 4061 - Java Attendance Service is running
) else (
    echo [X] Port 4061 - Java Attendance Service is NOT running
)

netstat -ano | findstr ":4062" >nul
if %errorlevel% equ 0 (
    echo [OK] Port 4062 - Java Assignment Service is running
) else (
    echo [X] Port 4062 - Java Assignment Service is NOT running
)

echo.
echo ========================================
echo.

curl -s http://localhost:9090/api/test >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Go Backend is responding
) else (
    echo [X] Go Backend is not responding
)

curl -s http://localhost:8085/api/test >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] WebSocket Server is responding
) else (
    echo [X] WebSocket Server is not responding
)

echo.
echo ========================================
echo Check complete!
echo ========================================
pause

