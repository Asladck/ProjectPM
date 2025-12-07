# PowerShell script to clean up duplicate folders
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Cleaning up duplicate folders" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\DWA\GolandProjects\Pjpro"
Set-Location $projectRoot

# Remove css folder from root
if (Test-Path "css") {
    Remove-Item -Path "css" -Recurse -Force
    Write-Host "✓ Removed css/" -ForegroundColor Green
} else {
    Write-Host "- css/ not found" -ForegroundColor Yellow
}

# Remove js folder from root
if (Test-Path "js") {
    Remove-Item -Path "js" -Recurse -Force
    Write-Host "✓ Removed js/" -ForegroundColor Green
} else {
    Write-Host "- js/ not found" -ForegroundColor Yellow
}

# Remove public folder from root (if exists)
if (Test-Path "public") {
    Remove-Item -Path "public" -Recurse -Force
    Write-Host "✓ Removed public/" -ForegroundColor Green
} else {
    Write-Host "- public/ not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "All frontend files are now in web/ folder:" -ForegroundColor White
Write-Host "- web/css/" -ForegroundColor White
Write-Host "- web/js/" -ForegroundColor White
Write-Host "- web/public/" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

