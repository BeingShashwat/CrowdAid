@echo off
echo.
echo ========================================
echo   Starting CrowdAid Platform
echo ========================================
echo.

cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File ".\start-crowdaid.ps1"

pause

