# StudentSphere API — Student Record Management System

**Subject:** Web Technology (2304362L)  
**Practical No. 6:** RESTful API  
**Institution:** MIT Academy of Engineering, Pune (MITAOE)  
**Author:** B.Tech Computer Engineering Student (Third Year)  

---

## 1. Project Overview

**StudentSphere API** is a robust, production-ready RESTful CRUD backend service engineered with **Node.js**, **Express.js**, and **MongoDB / Mongoose**. It provides standardized resource-oriented endpoints for creating, retrieving, updating, and deleting student academic records while enforcing strict schema constraints, data validation, duplicate conflict prevention, and uniform JSON responses.

### Key Features
- **Strict RESTful Design:** Resource-based URLs with semantic HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).
- **Comprehensive Server-Side Validation:** Validates formats for Indian phone numbers (10 digits), college PRNs, RFC-compliant emails, academic departments, years of study, and dates of birth.
- **Unique Constraint Enforcement:** Uniqueness indexing and pre-save checks for both PRN and Email with HTTP `409 Conflict` resolution.
- **Health Check & Readiness:** `/health` endpoint performing live connection probes on the MongoDB database.
- **Centralized Error Handling:** Uniform JSON responses for validation errors, CastErrors (malformed MongoDB ObjectIds), duplicate keys, and syntax errors without leaking server stack traces.
- **Automated Testing Suite:** 22 automated integration test cases built with Jest and Supertest.
- **Postman Collection:** Complete v2.1.0 collection with test assertions and automatic dynamic variable chaining (`studentId`).

---

## 2. Technology Stack

- **Runtime:** Node.js (v18+ / v20+ / v24+)
- **Web Framework:** Express.js (v4.21.2)
- **Database:** MongoDB Atlas (Hosted) / Local MongoDB Server
- **ODM:** Mongoose (v8.9.5)
- **Cross-Origin Security:** CORS
- **Configuration:** Dotenv
- **Automated Testing:** Jest, Supertest
- **API Client:** Postman
- **Version Control & Deployment:** Git, GitHub, Render

---

## 3. Project Directory Structure

```text
StudentSphere-API/
│
├── server.js                               # Application entry point & Express configuration
├── package.json                            # Project metadata, dependencies & scripts
├── package-lock.json                       # Dependency lockfile
├── .gitignore                              # Git ignore rules (node_modules, .env, etc.)
├── .env.example                            # Configuration template with placeholder credentials
├── .env                                    # Local environment variables (do NOT commit)
├── README.md                               # Project documentation & execution guide
│
├── config/
│   └── db.js                               # MongoDB connection logic and health check helper
│
├── models/
│   └── Student.js                          # Mongoose schema and model definition
│
├── controllers/
│   └── studentController.js                # Business logic for all CRUD operations
│
├── routes/
│   └── studentRoutes.js                    # Express router mapping routes to controllers
│
├── middleware/
│   ├── validateStudent.js                  # Request body and ObjectId format validation
│   ├── notFound.js                         # 404 Route Not Found JSON middleware
│   └── errorHandler.js                     # Centralized error formatting middleware
│
├── tests/
│   └── student.test.js                     # 22 Jest & Supertest integration tests
│
├── postman/
│   └── StudentSphere_API.postman_collection.json # Exportable Postman collection
│
└── docs/
    └── endpoint-documentation.md           # Exhaustive REST API route specifications
```

---

## 4. Prerequisites

Before running the application, make sure you have installed:
1. **Node.js** (v18.0.0 or higher): Verify with `node -v`
2. **npm** (v9.0.0 or higher): Verify with `npm -v`
3. **Git**: Verify with `git --version`
4. **Postman**: For API verification
5. Either a **MongoDB Atlas account** (Free Tier) or a **Local MongoDB Service** running on `mongodb://127.0.0.1:27017`.

---

## 5. Installation & Setup (Windows PowerShell)

### Step 1: Navigate to the Project Directory
```powershell
cd StudentSphere-API
```

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```powershell
Copy-Item .env.example .env
```
Open `.env` in any text editor and configure your port and connection string:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/studentsphere_db
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas SRV connection string as explained below).*

---

## 6. MongoDB Atlas Configuration Guide

To deploy or connect to a cloud-hosted database on MongoDB Atlas:
1. Navigate to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Click **Build a Database** and select the **M0 Free** cluster tier.
3. Choose a cloud provider and region (e.g. AWS / `ap-south-1` Mumbai).
4. Under **Security Quickstart**:
   - Create a database user (e.g. Username: `student_admin`, Password: `YourSecurePassword123!`).
   - Under **IP Access List**, click **Add My Current IP Address**, or add `0.0.0.0/0` (Allow access from anywhere) so cloud hosts like Render can connect.
5. Click **Finish and Close**, then navigate to **Database Deployments**.
6. Click the **Connect** button on your cluster, select **Drivers**, and choose **Node.js**.
7. Copy the SRV connection string:
   ```text
   mongodb+srv://student_admin:<password>@cluster0.abcde.mongodb.net/studentsphere_db?retryWrites=true&w=majority
   ```
8. In your `.env` file, set `MONGODB_URI` with your actual password (ensure special characters in passwords are URL-encoded).

---

## 7. Starting the Server

### Development Mode (with file watcher):
```powershell
npm run dev
```

### Production / Standard Mode:
```powershell
npm start
```

When started, your console will show:
```text
====================================================
🚀 StudentSphere API Server running on port 3000
📡 Local URL: http://localhost:3000
🩺 Health check: http://localhost:3000/health
📚 Students endpoint: http://localhost:3000/api/students
====================================================
✅ MongoDB Connected successfully to host: 127.0.0.1
📦 Database Name: studentsphere_db
```

---

## 8. REST API Endpoints Summary

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/health` | Live service health & DB connection probe | `200 OK` / `503 Service Unavailable` |
| **POST** | `/api/students` | Create a new student record | `201 Created` / `400` / `409` |
| **GET** | `/api/students` | Retrieve all student records | `200 OK` |
| **GET** | `/api/students/:id` | Retrieve single student by 24-char ObjectId | `200 OK` / `400` / `404` |
| **PUT** | `/api/students/:id` | Update student details by ObjectId | `200 OK` / `400` / `404` / `409` |
| **DELETE**| `/api/students/:id` | Delete student record by ObjectId | `200 OK` / `400` / `404` |

---

## 9. Sample Requests & Responses

### Sample POST Request Body:
```json
{
  "name": "Aarav Sharma",
  "prn": "2301234",
  "email": "aarav.sharma@mitaoe.ac.in",
  "mobile": "9876543210",
  "department": "Computer Engineering",
  "year": "Third Year",
  "dob": "2004-06-15"
}
```

### Sample POST Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "Student created successfully.",
  "data": {
    "id": "6ae1b95f70817b24375b277c",
    "name": "Aarav Sharma",
    "prn": "2301234",
    "email": "aarav.sharma@mitaoe.ac.in",
    "mobile": "9876543210",
    "department": "Computer Engineering",
    "year": "Third Year",
    "dob": "2004-06-15T00:00:00.000Z",
    "createdAt": "2026-10-28T08:59:11.692Z",
    "updatedAt": "2026-10-28T08:59:11.692Z"
  }
}
```

### Sample Validation Error Response (`400 Bad Request`):
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "mobile",
      "message": "Mobile number must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9."
    }
  ]
}
```

---

## 10. Running Automated Tests

The project includes 22 automated integration tests covering positive flows, invalid formats, missing fields, duplicate conflicts, malformed IDs, 404 handlers, and corrupted JSON bodies.

Run the test suite using PowerShell:
```powershell
npm test
```

Expected output:
```text
PASS tests/student.test.js
  StudentSphere RESTful API - Automated Test Suite
    GET / and GET /health
      √ should return welcome message and route manifest on GET / (HTTP 200)
      √ should report healthy UP status when database is connected on GET /health (HTTP 200)
    POST /api/students (Create Student)
      √ should create a new student record with valid payload (HTTP 201)
      √ should reject creation when missing required fields (HTTP 400)
      √ should reject invalid email format (HTTP 400)
      √ should reject invalid mobile number (HTTP 400)
      √ should reject invalid future date of birth (HTTP 400)
      √ should reject duplicate PRN (HTTP 409 Conflict)
      √ should reject duplicate email (HTTP 409 Conflict)
    GET /api/students (Get All Students)
      √ should return empty list when no students exist (HTTP 200)
      √ should return all student records when records exist (HTTP 200)
    GET /api/students/:id (Get Student by ID)
      √ should return student record when ID exists (HTTP 200)
      √ should return 400 for malformed MongoDB ObjectId
      √ should return 404 when valid ObjectId does not exist
    PUT /api/students/:id (Update Student)
      √ should update student with valid data (HTTP 200)
      √ should return 400 for invalid data during update
      √ should return 404 when updating non-existent student
    DELETE /api/students/:id (Delete Student)
      √ should delete existing student (HTTP 200)
      √ should return 404 when deleting non-existent student
      √ should return 400 when deleting with malformed ID
    Error Handling Middleware
      √ should return 404 JSON for undefined routes
      √ should handle malformed JSON syntax gracefully (HTTP 400)

Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
```

---

## 11. Importing & Running the Postman Collection

1. Launch **Postman**.
2. Click the **Import** button in the top-left corner.
3. Drag and drop the file:  
   `postman/StudentSphere_API.postman_collection.json`
4. The collection **StudentSphere API - Practical 6 Test Collection** will appear in your left sidebar.
5. In the collection settings, the `baseUrl` variable is pre-configured to `http://localhost:3000`. If testing on a deployed service, edit `baseUrl` to your deployed URL (e.g. `https://studentsphere-api.onrender.com`).
6. Run the requests sequentially from **1 to 15**. Request 2 automatically captures the generated `_id` into the collection variable `studentId`, allowing requests 8, 11, 12, 13, and 15 to reference it without manual copying.

---

## 12. GitHub Publishing Instructions

To publish your source code to GitHub cleanly:

1. Initialize git and configure user (if not already set):
   ```powershell
   git init
   ```
2. Verify `.gitignore` is present so `.env` and `node_modules` are excluded:
   ```powershell
   git status
   ```
3. Stage and commit:
   ```powershell
   git add .
   git commit -m "feat: complete RESTful CRUD StudentSphere API for Practical 6"
   ```
4. Create a new public repository on GitHub (e.g. `StudentSphere-API`).
5. Link remote and push:
   ```powershell
   git remote add origin https://github.com/<your-username>/StudentSphere-API.git
   git branch -M main
   git push -u origin main
   ```

---

## 13. Cloud Deployment Guide (Render)

1. Sign up / Log in to [Render](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `StudentSphere-API`.
4. Configure the Web Service:
   - **Name:** `studentsphere-api`
   - **Region:** Singapore / Frankfurt (or closest)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `PORT`: `3000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas SRV connection string>`
6. Ensure your MongoDB Atlas cluster has network access enabled for `0.0.0.0/0`.
7. Click **Deploy Web Service**.
8. Once deployed, test the live health check:
   `https://<your-subdomain>.onrender.com/health`

---

## 14. Known Limitations

1. **Authentication:** The current practical focuses strictly on core RESTful CRUD architecture. Authentication (JWT / OAuth2) is intentionally omitted for simplicity.
2. **Soft Deletes:** Records deleted via `DELETE` are permanently purged from the database rather than soft-deleted using a flag.
