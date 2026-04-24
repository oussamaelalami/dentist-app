# Dentist App 🦷

A full-stack appointment booking system for dental clinics with admin dashboard.

## Quick Start (2 Minutes)

### Option 1: Automatic (Windows)
```bash
start-dev.bat
```

### Option 2: Automatic (Mac/Linux)
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Option 3: Manual
```bash
# Terminal 1 - Backend
cd server
npm install
node index.js

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

## Access

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:3000 | Public website |
| Admin Dashboard | http://localhost:3000/admin/login | Admin panel |
| API | http://localhost:5000 | Backend API |

## Default Admin Login

```
Email: admin@dentist.com
Password: admin123
```

⚠️ **Change these credentials immediately in production!**

## Features

- 📅 **Appointment Booking** - Customers can book appointments
- 📊 **Admin Dashboard** - Manage appointments and services
- ✅ **Approve/Reject** - Admin can approve or reject appointments
- 🔐 **JWT Authentication** - Secure admin access
- 🗄️ **SQLite Database** - Built-in data persistence
- 📱 **Responsive Design** - Works on all devices

## Project Structure

```
dentist-app/
├── client/                 # Next.js frontend
│   ├── app/              # Pages and routes
│   ├── components/       # React components
│   ├── lib/              # Utilities (auth, etc)
│   └── public/           # Static files
├── server/               # Node.js backend
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── db.js            # Database setup
│   └── index.js         # Server entry point
└── DEPLOYMENT.md        # Detailed deployment guide
```

## Key Endpoints

### Public API
- `GET /services` - Get all services
- `POST /appointments` - Book appointment
- `POST /auth/login` - Admin login

### Admin API (Protected)
- `GET /admin/appointments` - List appointments
- `PUT /admin/appointments/:id` - Update appointment
- `DELETE /admin/appointments/:id` - Delete appointment
- `GET /admin/services` - List services
- `POST /admin/services` - Create service
- `PUT /admin/services/:id` - Update service
- `DELETE /admin/services/:id` - Delete service

## Tech Stack

### Frontend
- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Production deployment steps
- Environment configuration
- Security checklist
- Troubleshooting guide

## Development

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Start development servers
# Terminal 1
cd server && npm start

# Terminal 2
cd client && npm run dev
```

## Database

Database is automatically initialized on first server start:
- `admins` table - Admin users
- `services` table - Dental services  
- `appointments` table - Booked appointments

Default admin account is created automatically.

## Security Notes

- Change default admin password immediately
- Update JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting for production
- Add input validation and sanitization
- Regular security audits recommended

## License

MIT

## Support

For issues or questions, check:
1. DEPLOYMENT.md for detailed guides
2. JWT_AUTH.md for authentication details
3. Server logs for error messages

---

Happy scheduling! 😊
