@echo off
echo ================================
echo Starting SDU Platform
echo ================================
echo.

echo [1/3] Starting Backend Services...
start "Backend Services" cmd /k "docker-compose up"

echo Waiting for services to start (10 seconds)...
timeout /t 10 /nobreak >nul

echo.
echo [2/3] Checking Services Health...
curl -s http://localhost:9090/health || echo Go Backend not ready yet
curl -s http://localhost:4061/actuator/health || echo Attendance Service not ready yet
curl -s http://localhost:4062/actuator/health || echo File Service not ready yet

echo.
echo [3/3] Starting Frontend Server...
cd /d %~dp0web
start "Frontend Server" cmd /k "python -m http.server 8000"

echo.
echo ================================
echo SDU Platform Started!
echo ================================
echo.
echo Frontend: http://localhost:8000/public/login.html
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:8000/public/login.html

