# KYC Verification Project Setup Guide

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```bash
cp .env.example .env
```

### 4. Update .env with your configuration
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kyc-verification
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

### 5. Make sure MongoDB is running
- Local MongoDB: Ensure MongoDB service is running
- MongoDB Atlas: Update MONGODB_URI with your Atlas connection string

### 6. Start the backend server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd newCrm
```

### 2. Install dependencies (if not already installed)
```bash
npm install
```

### 3. Create .env file (optional)
```bash
cp .env.example .env
```

Update if your backend runs on a different port:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the frontend
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Testing the API

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

## Project Structure

```
newReactUi/
├── backend/
│   ├── Controllers/
│   │   └── Auth.controller.js    # Authentication logic
│   ├── Modals/
│   │   └── Auth.Modal.js         # User MongoDB schema
│   ├── Routers/
│   │   └── Auth.route.js         # Authentication routes
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT authentication
│   │   └── validator.middleware.js # Input validation
│   ├── server.js                  # Express app
│   └── package.json
│
└── newCrm/                        # Frontend React app
    ├── src/
    │   ├── Action/auth/           # Redux auth actions
    │   ├── Components/            # React components
    │   ├── utils/
    │   │   └── api.js             # API utility functions
    │   └── App.jsx
    └── package.json
```

## Features

### Backend
- ✅ User Registration
- ✅ User Login with JWT
- ✅ Protected Routes
- ✅ Password Hashing (bcrypt)
- ✅ Input Validation
- ✅ Error Handling
- ✅ MongoDB Integration

### Frontend
- ✅ Login Page
- ✅ Dashboard
- ✅ Redux State Management
- ✅ JWT Token Storage
- ✅ Protected Routes
- ✅ API Integration

## Next Steps

1. Start MongoDB (local or Atlas)
2. Start backend server: `cd backend && npm run dev`
3. Start frontend: `cd newCrm && npm run dev`
4. Register a user via API or create a registration page
5. Login with the registered credentials

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify MONGODB_URI in .env file
- For Atlas, check network access settings

### CORS Error
- Ensure backend CORS is enabled (already configured)
- Check frontend API URL matches backend port

### JWT Token Error
- Verify JWT_SECRET in backend .env
- Check token expiration settings

