# Deployment Guide

## Quick Start

### 1. Backend Setup & Start

```bash
cd server

# Install dependencies (if not done)
npm install

# Create .env file
cp .env.example .env

# Start server
npm start
# or
node index.js
```

Server runs on: **http://localhost:5000**

### 2. Frontend Setup & Start

```bash
cd client

# Install dependencies (if not done)
npm install
# or
pnpm install

# Development server
npm run dev
# or
pnpm dev
```

Frontend runs on: **http://localhost:3000**

### 3. Default Admin Credentials

- **Email**: `admin@dentist.com`
- **Password**: `admin123`

⚠️ **Change these immediately in production!**

## Environment Variables

### Backend (.env)
```
JWT_SECRET=your-super-secret-key-change-this-in-production
PORT=5000
```

### Frontend
No .env needed for local development (API_BASE_URL is hardcoded to localhost:5000)

For production, you'll need to:
1. Change `API_BASE_URL` in components to your production server URL
2. Set `JWT_SECRET` to a strong random key
3. Update CORS settings in server/index.js

## Features Implemented

✅ **Frontend**
- Home page with services and testimonials
- Appointment booking form (public)
- Admin dashboard with JWT authentication
- Appointments management (Approve/Reject/Delete)
- Services management (CRUD operations)

✅ **Backend**
- SQLite database with admin, services, and appointments tables
- JWT authentication
- REST API with protected routes
- Appointment scheduling with conflict detection

## API Endpoints

### Public
- `GET /services` - List all services
- `POST /appointments` - Book appointment
- `POST /auth/login` - Admin login

### Protected (requires JWT token)
- `GET /admin/appointments` - List appointments
- `PUT /admin/appointments/:id` - Update appointment status
- `DELETE /admin/appointments/:id` - Delete appointment
- `GET /admin/services` - List services (admin)
- `POST /admin/services` - Create service
- `PUT /admin/services/:id` - Update service
- `DELETE /admin/services/:id` - Delete service

## Testing

1. Open http://localhost:3000
2. Book an appointment on the home page
3. Go to http://localhost:3000/admin/login
4. Login with admin@dentist.com / admin123
5. Manage appointments and services from admin dashboard

## Production Checklist

- [ ] Change default admin password
- [ ] Update JWT_SECRET to strong random value
- [ ] Set up proper database (PostgreSQL recommended)
- [ ] Configure CORS for production domain
- [ ] Add HTTPS/SSL
- [ ] Set up environment variables properly
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Heroku/DigitalOcean/AWS
- [ ] Update API_BASE_URL in frontend components
- [ ] Set up database backups
- [ ] Add logging and monitoring
- [ ] Test all features in production

## Troubleshooting

**Port already in use?**
```bash
# Change PORT in server/.env
PORT=5001
```

**CORS errors?**
- Update CORS settings in server/index.js
- Check that both servers are running

**Database not initializing?**
- Delete database.sqlite and restart server
- Check db.js for any syntax errors

**JWT token expired?**
- Login again to get a new token
- Token expires after 24 hours

## Next Steps

1. Test locally first
2. Deploy backend
3. Update API_BASE_URL in frontend
4. Deploy frontend
5. Monitor logs and test all features
