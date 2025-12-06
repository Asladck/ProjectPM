@echo off
echo ========================================
echo Starting Java Attendance Service
echo ========================================
echo.
echo Port: 4061
echo Service: Attendance Check
echo.

cd java\inf451\attendance_check-service

echo Starting Maven...
call mvnw.cmd spring-boot:run

pause

