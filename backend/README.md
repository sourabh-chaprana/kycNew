# KYC Verification Backend API

Backend API for KYC Verification Dashboard built with Node.js, Express, and MongoDB.

## Features

- User Registration
- User Login with JWT Authentication
- Protected Routes
- Role-based Authorization (Agent/Admin)
- Password Hashing with bcrypt
- Input Validation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kyc-verification
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
```

4. Make sure MongoDB is running on your system or use MongoDB Atlas.

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "agent" // optional, defaults to "agent"
}
```

#### Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Private

### Health Check
- **GET** `/api/health`

## Project Structure

```
backend/
├── Controllers/
│   └── Auth.controller.js    # Authentication logic
├── Modals/
│   └── Auth.Modal.js         # User MongoDB schema
├── Routers/
│   └── Auth.route.js         # Authentication routes
├── middleware/
│   ├── auth.middleware.js     # JWT authentication middleware
│   └── validator.middleware.js # Input validation
├── server.js                  # Express app setup
├── package.json
└── .env.example
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // for validation errors
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- CORS enabled
- Environment variables for sensitive data

