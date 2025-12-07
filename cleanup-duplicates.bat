@echo off
echo ================================
echo Cleaning up duplicate folders
echo ================================
echo.

cd /d C:\Users\DWA\GolandProjects\Pjpro

echo Removing duplicate CSS folder from root...
if exist css\ (
    rmdir /s /q css
    echo ✓ Removed css/
) else (
    echo - css/ not found
)

echo.
echo Removing duplicate JS folder from root...
if exist js\ (
    rmdir /s /q js
    echo ✓ Removed js/
) else (
    echo - js/ not found
)

echo.
echo Removing duplicate public folder from root (if exists)...
if exist public\ (
    rmdir /s /q public
    echo ✓ Removed public/
) else (
    echo - public/ not found
)

echo.
echo ================================
echo Cleanup complete!
echo ================================
echo.
echo All frontend files are now in web/ folder:
echo - web/css/
echo - web/js/
echo - web/public/
echo.
pause

