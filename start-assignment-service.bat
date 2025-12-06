@echo off
echo ========================================
echo Starting Java Assignment Service
echo ========================================
echo.
echo Port: 4062
echo Service: File Upload/Download
echo.

cd java\inf451\file_upload-download

echo Starting Maven...
call mvnw.cmd spring-boot:run

pause

