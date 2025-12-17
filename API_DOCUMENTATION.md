# Ad Posting Microservices - API Documentation

## 🚀 Quick Access

**Swagger API Dashboard:** http://localhost:8080/api

This interactive dashboard allows you to:
- View all available endpoints
- Test APIs directly from your browser
- See request/response schemas
- Authenticate and test protected routes

---

## 📋 Available Services

### 1. Auth Service (Port 8080)
**Base URL:** `http://localhost:8080`

#### Endpoints:

##### POST `/auth/register/user`
Register a new user account
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "gender": "male",  // optional
  "skills": ["javascript", "nodejs"]  // optional
}
```

##### POST `/auth/register/company`
Register a new company account
```json
{
  "name": "Tech Company",
  "email": "company@example.com",
  "password": "securePassword123",
  "description": "A tech company"
}
```

##### POST `/auth/login/user`
User login
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

##### POST `/auth/login/company`
Company login
```json
{
  "email": "company@example.com",
  "password": "securePassword123"
}
```

##### GET `/auth/me`
Get current authenticated user/company details
- Requires: Bearer token in Authorization header

---

### 2. Jobs Service
**Note:** Currently running on same port as Auth (microservice architecture)

#### Endpoints:

##### POST `/jobs`
Create a new job posting (Company only)
- Requires: Company authentication

##### GET `/jobs`
Get all job postings for a company
- Requires: Company authentication

##### GET `/jobs/:id`
Get a specific job posting by ID
- Requires: User or Company authentication

##### POST `/jobs/:id/applications`
Apply for a job (User only)
- Requires: User authentication

##### GET `/jobs/:id/applications`
Get all applications for a job (Company only)
- Requires: Company authentication

##### GET `/jobs/:jobPostId/applications/:applicationId`
Get a specific application
- Requires: Company authentication

##### PATCH `/jobs/:jobPostId/applications/:applicationId/status`
Update application status
- Requires: Company authentication
- Query param: `status` (pending, accepted, rejected)

---

### 3. Chat Service

#### Endpoints:

##### POST `/chat/new`
Create a new chat (Company only)
- Requires: Company authentication

##### GET `/chat/list`
Get list of chats
- Requires: User or Company authentication

---

### 4. Messages Service

#### Endpoints:

##### POST `/messages`
Send a new message
- Requires: User or Company authentication

##### GET `/messages?id={chatId}`
Get all messages in a chat
- Requires: User or Company authentication
- Query param: `id` (chat ID)

---

### 5. Payments Service
Microservice only (no HTTP endpoints, uses RabbitMQ messaging)

### 6. Notifications Service
Microservice only (no HTTP endpoints, uses RabbitMQ messaging)

---

## 🔑 Authentication

Most endpoints require authentication. After logging in, you'll receive a JWT token.

Include this token in subsequent requests:
```
Authorization: Bearer <your-token>
```

---

## 🧪 Testing the APIs

### Option 1: Swagger Dashboard (Recommended)
Visit: http://localhost:8080/api

### Option 2: Using curl

**Register a user:**
```bash
curl -X POST http://localhost:8080/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get current user (with token):**
```bash
curl -X GET http://localhost:8080/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 3: Using PowerShell

**Register:**
```powershell
$body = @{
    firstName = "John"
    lastName = "Doe"
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/auth/register/user" -Method Post -Body $body -ContentType "application/json"
```

**Login:**
```powershell
$loginBody = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/auth/login/user" -Method Post -Body $loginBody -ContentType "application/json"
$token = $response.data.token
```

**Get current user:**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:8080/auth/me" -Headers $headers
```

---

## 📦 Services Status

- ✅ **MongoDB:** Running on port 27017
- ✅ **RabbitMQ:** Running on port 5672
- ✅ **Redis:** Running on port 6379
- ✅ **Auth Service:** Running on port 8080

---

## 🎯 Common Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response:
```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

---

## 📝 Notes

1. The application is running in **watch mode** - any code changes will automatically trigger a rebuild
2. All endpoints use JSON for request/response bodies
3. Authentication tokens are JWT-based
4. Some services communicate via RabbitMQ (not exposed as HTTP endpoints)
