# Student Records RESTful CRUD API

**Student Name:** Prachi Lohkare  
**PRN / Roll Number:** 202401040083  
**GitHub Profile:** [@prachilohkare8-debug](https://github.com/prachilohkare8-debug)  
**Institution:** MIT Academy of Engineering, Pune (MITAOE)  
**Department:** School of Computer Engineering  
**Course:** Web Technology (2304362L) — T.Y. B.Tech (AY 2025–26)  
**Practical No. 6:** RESTful API  
**Course Outcome:** CO4 — Build dynamic, database-backed web applications and APIs  
**Maximum Marks:** 10 Marks  

---

## 1. Project Title & Aim

### Project Title
**RESTful CRUD API for Student Records, Deployed and Tested with Postman**

### Aim
To design, implement, deploy, and test a complete resource-based RESTful API that performs CRUD (Create, Read, Update, Delete) operations on student records stored in a database (MongoDB Atlas / local MongoDB), enforce comprehensive server-side input validation, return standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`) with uniform JSON responses, and thoroughly verify all operations using automated tests and Postman.

---

## 2. Project Description

This project provides a clean, modular, and production-ready RESTful web service engineered with **Node.js**, **Express.js**, and **MongoDB Atlas** via **Mongoose ODM**. It adheres strictly to REST architectural constraints:
- **Resource-Oriented URIs:** `/api/students` and `/api/students/:id`
- **Standard HTTP Verbs:** `POST` (create), `GET` (read all & by ID), `PUT` (update), `DELETE` (delete).
- **Strict Data Validation:** Validates required fields, RFC-compliant email formatting, unique roll numbers, and academic study year (1 to 4).
- **Security & Integrity:** Validates 24-character hexadecimal MongoDB ObjectIds before querying, returns structured error messages, and avoids exposing database credentials or server stack traces.
- **Resilience:** Implements a `/health` readiness probe reporting database connection states.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Runtime** | Node.js (v18+ / v20+ / v24+) | High-performance asynchronous non-blocking JavaScript engine |
| **Framework** | Express.js (v4.21.2) | Minimalist web application framework for routing and middleware |
| **Database** | MongoDB Atlas / Local MongoDB | Distributed document-oriented NoSQL database with WiredTiger engine |
| **ODM** | Mongoose (v8.9.5) | Object Data Modeling library with schema validation and type casting |
| **API Testing** | Postman | Manual and automated collection execution with test assertions |
| **Automated Testing** | Jest & Supertest | 24 automated unit & integration tests running in under 2 seconds |
| **Deployment** | Render Cloud Platform | Cloud hosting for the live REST API web service |
| **Version Control** | Git & GitHub | Source code tracking and continuous deployment |

---

## 4. Project Folder Structure

```text
StudentSphere-API/
├── server.js                                # Application entry point, Express config & health probes
├── package.json                             # Dependencies, scripts & metadata
├── package-lock.json                        # Dependency lockfile
├── .gitignore                               # Git ignore rules (node_modules, .env, etc.)
├── .env.example                             # Configuration template with placeholder credentials
├── .env                                     # Local environment variables (do NOT commit)
├── README.md                                # Project documentation & execution guide
├── Student_Records_REST_API.postman_collection.json # Exportable Postman collection
├── build_report_p6.py                       # ReportLab PDF report generation script
├── PRN_Name_P6_Report.pdf                   # Final academic laboratory report
│
├── config/
│   └── db.js                                # Resilient MongoDB connection & health probe helper
│
├── models/
│   └── Student.js                           # Mongoose schema, validation rules & pre-save hooks
│
├── controllers/
│   └── studentController.js                 # Complete CRUD business logic with conflict checks
│
├── routes/
│   └── studentRoutes.js                     # RESTful route declarations & middleware binding
│
├── middleware/
│   ├── validateStudent.js                   # Request body validation & hex ObjectId verification
│   ├── notFound.js                          # 404 Route Not Found JSON middleware
│   └── errorHandler.js                      # Centralized error handler preventing stack leakage
│
├── tests/
│   └── student.test.js                      # 24 automated Jest & Supertest integration tests
│
├── postman/
│   └── Student_Records_REST_API.postman_collection.json # Postman collection backup
│
└── assets/
    └── architecture_diagram.png             # System architecture diagram
```

---

## 5. Prerequisites

Before running the application, ensure the following are installed on your machine:
1. **Node.js** (v18.0.0 or higher): Check with `node -v`
2. **npm** (v9.0.0 or higher): Check with `npm -v`
3. **Git**: Check with `git --version`
4. **Postman**: For API verification
5. Either a free **MongoDB Atlas account** or a **Local MongoDB Service** running on `mongodb://127.0.0.1:27017`.

---

## 6. Installation & Setup

### Step 1: Navigate to the Project Directory
```powershell
cd StudentSphere-API
```

### Step 2: Install Dependencies
```powershell
npm install
```

---

## 7. Environment Variable Setup

Create a `.env` file in the root directory (copy from `.env.example`):
```powershell
cp .env.example .env
```

Configure the environment variables in `.env`:
```env
# Server Port
PORT=3000

# Environment Mode
NODE_ENV=development

# MongoDB Connection String
# For Local MongoDB (Default):
MONGODB_URI=mongodb://127.0.0.1:27017/studentsphere_db

# For MongoDB Atlas Cloud (Alternative):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/studentsphere_db?retryWrites=true&w=majority
```

> **Security Note:** Never commit `.env` or real database passwords to version control. The `.gitignore` file automatically excludes `.env`.

---

## 8. MongoDB Atlas Configuration Instructions

If using MongoDB Atlas in the cloud:
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (M0 sandbox).
3. Under **Database Access**, create a database user with `Read and write to any database` permissions and save the credentials.
4. Under **Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere (`0.0.0.0/0`)** so your local API and Render deployment can connect.
5. In your cluster dashboard, click **Connect** > **Drivers** > copy the connection string.
6. Replace `<username>` and `<password>` with your database user credentials.
7. Paste this string into your `.env` as `MONGODB_URI` (or in Render's Environment Variables).

---

## 9. Local Run Commands

### Start in Normal Mode:
```powershell
npm start
```

### Start in Development Mode (with automatic reload):
```powershell
npm run dev
```

### Run Automated Integration Tests:
```powershell
npm test
```
*Expected test output:* **24 passed, 24 total** in under 2 seconds.

---

## 10. Complete RESTful Endpoints Table

| HTTP Method | Endpoint URL | Purpose / Action | Expected Success Code | Important Failure Codes |
| --- | --- | --- | --- | --- |
| `GET` | `/` | API Root Welcome, Course Metadata & Route Manifest | `200 OK` | `500` |
| `GET` | `/health` | Service Health & Database Connection Probe | `200 OK` | `503 Service Unavailable` |
| `POST` | `/api/students` | Create a new student record | `201 Created` | `400 Bad Request`, `409 Conflict`, `500` |
| `GET` | `/api/students` | Retrieve all student records | `200 OK` | `500` |
| `GET` | `/api/students/:id` | Retrieve single student by 24-char ObjectId | `200 OK` | `400 Bad Request`, `404 Not Found`, `500` |
| `PUT` | `/api/students/:id` | Update an existing student record | `200 OK` | `400 Bad Request`, `404 Not Found`, `409 Conflict`, `500` |
| `DELETE` | `/api/students/:id` | Delete student record by ID | `200 OK` | `400 Bad Request`, `404 Not Found`, `500` |

---

## 11. Example Request Bodies

### 1. Create Student (`POST /api/students`)
```json
{
  "name": "Prachi Lohkare",
  "rollNumber": "202401040083",
  "email": "prachi.lohkare@mitaoe.ac.in",
  "course": "Computer Engineering",
  "year": 3
}
```

### 2. Update Student (`PUT /api/students/:id`)
```json
{
  "name": "Prachi S. Lohkare",
  "rollNumber": "202401040083",
  "email": "prachi.updated@mitaoe.ac.in",
  "course": "Computer Engineering",
  "year": 4
}
```

---

## 12. Example Success & Error Responses

### Success: Create Student (HTTP 201 Created)
```json
{
  "success": true,
  "message": "Student created successfully.",
  "data": {
    "name": "Prachi Lohkare",
    "rollNumber": "202401040083",
    "email": "prachi.lohkare@mitaoe.ac.in",
    "course": "Computer Engineering",
    "year": 3,
    "id": "6ae3b68843f0c07441f735af",
    "createdAt": "2026-10-29T21:11:36.444Z",
    "updatedAt": "2026-10-29T21:11:36.444Z"
  }
}
```

### Success: Get All Students (HTTP 200 OK)
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "6ae3b68843f0c07441f735af",
      "name": "Prachi Lohkare",
      "rollNumber": "202401040083",
      "email": "prachi.lohkare@mitaoe.ac.in",
      "course": "Computer Engineering",
      "year": 3
    }
  ]
}
```

### Error: Missing Required Fields (HTTP 400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "rollNumber", "message": "Roll number / PRN is required." },
    { "field": "email", "message": "Email address is required." },
    { "field": "course", "message": "Course / Department is required." },
    { "field": "year", "message": "Academic year is required (1, 2, 3, or 4)." }
  ]
}
```

### Error: Malformed MongoDB ObjectId (HTTP 400 Bad Request)
```json
{
  "success": false,
  "message": "Invalid student ID format: 'invalid-id'. Must be a 24-character hexadecimal string."
}
```

### Error: Student Not Found (HTTP 404 Not Found)
```json
{
  "success": false,
  "message": "Student with ID '64b1f8e1234567890abcdef0' not found."
}
```

### Error: Duplicate Roll Number or Email (HTTP 409 Conflict)
```json
{
  "success": false,
  "message": "Student with roll number / PRN '2301234' already exists.",
  "errors": [
    { "field": "rollNumber", "message": "Roll number is already registered to another student." }
  ]
}
```

---

## 13. Postman Collection Import Instructions

1. Open **Postman Desktop Client** or **Postman Web**.
2. Click the **Import** button in the top-left corner.
3. Drag and drop the file: `Student_Records_REST_API.postman_collection.json`.
4. The imported collection `Student Records REST API` contains 5 folders:
   - **Create Student** (Creates student, runs assertions, captures `studentId` variable)
   - **Read Students** (Retrieves all students and individual student by `studentId`)
   - **Update Student** (Updates student record with new year and email)
   - **Delete Student** (Deletes student record from database)
   - **Error Handling** (Verifies 400 for missing fields, invalid email, malformed ID, and 404 for nonexistent ID)
5. **Configuring Environment:** In Collection Variables, verify `baseUrl` is set to `http://localhost:3000` (or `https://studentsphere-api.onrender.com` for deployed testing).
6. Click **Run Collection** to execute all requests and verify tests automatically.

---

## 14. Deployment Instructions (Render)

1. Push your latest code to GitHub:
   ```powershell
   git add .
   git commit -m "feat: complete student records REST API"
   git push origin main
   ```
2. Log in to [Render](https://render.com/).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository `StudentSphere-API` (from `prachilohkare8-debug`).
5. Configure the service settings:
   - **Name:** `studentsphere-api`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
6. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<your-mongodb-atlas-connection-string>`
7. Click **Deploy Web Service**.
8. Once deployed, verify your live API using the `/health` endpoint.

---

## 15. Verified Live Deployed API URL

- **Live Service Base URL:** `https://studentsphere-api.onrender.com`
- **Health Check Endpoint:** `https://studentsphere-api.onrender.com/health`
- **Students Resource Endpoint:** `https://studentsphere-api.onrender.com/api/students`

---

## 16. How the API Works

1. **Request Reception:** An incoming HTTP request hits Express at `server.js`.
2. **Readiness Probe:** If the route is `/health`, Express queries the Mongoose connection readyState.
3. **Database Guard:** The `checkDBReady` middleware ensures Mongoose is actively connected before processing data routes, preventing buffering errors.
4. **Validation Pipeline:** The request reaches `studentRoutes.js`. For `POST` and `PUT`, `validateStudent` sanitizes inputs and validates required fields. For route parameters `:id`, `validateObjectId` guarantees valid 24-character hexadecimal IDs.
5. **Controller Processing:** `studentController.js` executes Mongoose model methods (`create`, `find`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`).
6. **Conflict Protection:** Writes check existing records to prevent unique index collisions on `rollNumber` and `email`, returning HTTP 409 Conflict when duplicates are detected.
7. **Response Serialization:** Results are formatted into consistent JSON bodies with appropriate HTTP status codes, never exposing internal database stack traces or credentials.
