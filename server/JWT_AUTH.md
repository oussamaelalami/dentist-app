# JWT Authentication Setup

## Overview
This application implements JWT (JSON Web Token) authentication for admin users. The system includes:
- Admin login endpoint
- Protected admin routes
- Token-based authentication

## Default Credentials
For development, a default admin account is created:
- **Email**: `admin@dentist.com`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials in production!

## Environment Setup
1. Copy `.env.example` to `.env`
2. Update the `JWT_SECRET` with a secure key for production

```bash
cp .env.example .env
```

## API Endpoints

### Public Endpoints
- `GET /services` - Get all services (no authentication required)
- `POST /auth/login` - Admin login

### Authentication Endpoint
```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@dentist.com",
  "password": "admin123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "email": "admin@dentist.com",
    "name": "Admin User"
  }
}
```

### Protected Admin Routes
All admin routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

#### Appointments Management
- `GET /admin/appointments` - Get all appointments
- `PUT /admin/appointments/:id` - Update appointment status
- `DELETE /admin/appointments/:id` - Delete appointment

#### Services Management (Admin)
- `GET /admin/services` - Get all services
- `POST /admin/services` - Create service
- `PUT /admin/services/:id` - Update service
- `DELETE /admin/services/:id` - Delete service

#### Admin Profile
- `GET /auth/profile` - Get admin profile (requires token)

## How to Use

### 1. Login and Get Token
```javascript
const response = await fetch('http://localhost:5000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@dentist.com',
    password: 'admin123'
  })
});

const { token } = await response.json();
```

### 2. Use Token for Protected Routes
```javascript
const response = await fetch('http://localhost:5000/admin/appointments', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const appointments = await response.json();
```

## Token Expiration
- Tokens expire after **24 hours**
- Users must login again to get a new token

## Security Considerations
1. Always use HTTPS in production
2. Change the default admin password immediately
3. Use a strong `JWT_SECRET` (minimum 32 characters)
4. Never expose the JWT_SECRET in client-side code
5. Implement token refresh mechanism for long sessions
6. Consider adding role-based access control (RBAC)

## Frontend Integration
When implementing the admin dashboard in React/Next.js:

1. Store the token in a secure location (HttpOnly cookie recommended)
2. Include the token in all admin requests
3. Handle 401 responses by redirecting to login
4. Implement token refresh before expiration

Example implementation:
```typescript
const fetchWithAuth = async (url: string, options = {}) => {
  const token = localStorage.getItem('adminToken');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};
```
