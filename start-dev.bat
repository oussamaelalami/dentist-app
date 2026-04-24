@echo off
echo.
echo ========================================
echo Dentist App - Development Server Startup
echo ========================================
echo.
echo Starting Backend Server...
start cmd /k "cd server && node index.js"

echo Waiting 2 seconds for backend to start...
timeout /t 2 /nobreak

echo.
echo Starting Frontend Server...
start cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo Services Starting:
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin:    http://localhost:3000/admin/login
echo ========================================
echo.
echo Admin Credentials:
echo Email: admin@dentist.com
echo Password: admin123
echo.
pause
