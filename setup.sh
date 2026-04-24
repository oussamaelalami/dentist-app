#!/bin/bash
# Quick Start Guide - Dentist App

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   Dentist App - Quick Start Guide     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js is installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "════════════════════════════════════════"
echo "Ready to start! Run one of these:"
echo "════════════════════════════════════════"
echo ""
echo "Option 1: Use the startup script"
echo "  ./start-dev.sh"
echo ""
echo "Option 2: Start servers manually"
echo "  Terminal 1: cd server && npm start"
echo "  Terminal 2: cd client && npm run dev"
echo ""
echo "════════════════════════════════════════"
echo "Then visit:"
echo "  http://localhost:3000              (Website)"
echo "  http://localhost:3000/admin/login  (Admin Panel)"
echo ""
echo "Admin Credentials:"
echo "  Email: admin@dentist.com"
echo "  Password: admin123"
echo "════════════════════════════════════════"
echo ""
