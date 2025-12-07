@echo off
REM Start a simple static server using Python and open browser to login
cd /d %~dp0
python -m http.server 8000 >nul 2>&1 &
start http://localhost:8000/public/login.html
echo Started static server on http://localhost:8000
pause

