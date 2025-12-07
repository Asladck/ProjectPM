@echo off
echo ================================
echo Starting Frontend Server
echo ================================
echo.

cd /d %~dp0web

echo Starting HTTP server on port 8000...
echo.
echo Frontend will be available at:
echo http://localhost:8000/public/login.html
echo.
echo Press Ctrl+C to stop the server
echo.

python -m http.server 8000

