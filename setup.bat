@echo off
REM Quick Start Guide - Dentist App

echo.
echo ========================================
echo Dentist App - Setup & Installation
echo ========================================
echo.

REM Check if Node is installed
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed!
    echo Please download and install from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo OK: Node.js found
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd server
call npm install >nul 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo OK: Backend dependencies installed
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd client
call npm install >nul 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo OK: Frontend dependencies installed
cd ..

echo.
echo ========================================
echo SUCCESS! Everything is ready!
echo ========================================
echo.
echo To start the application, run:
echo.
echo   start-dev.bat
echo.
echo Or manually start:
echo   Terminal 1: cd server ^&^& npm start
echo   Terminal 2: cd client ^&^& npm run dev
echo.
echo Then visit:
echo   Website:    http://localhost:3000
echo   Admin:      http://localhost:3000/admin/login
echo.
echo Admin Login:
echo   Email: admin@dentist.com
echo   Password: admin123
echo.
echo ========================================
echo.
pause
