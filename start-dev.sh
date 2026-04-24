#!/bin/bash

echo ""
echo "========================================"
echo "Dentist App - Development Server Startup"
echo "========================================"
echo ""

echo "Starting Backend Server..."
cd server && node index.js &
BACKEND_PID=$!

echo "Waiting 2 seconds for backend to start..."
sleep 2

echo ""
echo "Starting Frontend Server..."
cd ../client && npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Services Starting:"
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo "Admin:    http://localhost:3000/admin/login"
echo "========================================"
echo ""
echo "Admin Credentials:"
echo "Email: admin@dentist.com"
echo "Password: admin123"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
