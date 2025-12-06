@echo off
echo ========================================
echo Starting Go Backend + WebSocket Server
echo ========================================
echo.
echo Ports:
echo   - 9090: HTTP API (Auth)
echo   - 8085: WebSocket Server + Frontend
echo   - 50051: gRPC
echo.

echo Starting Go server...
go run cmd\main.go

pause

