# StudentSphere API — Complete Endpoint Documentation

**Course:** Web Technology (2304362L) — Practical No. 6  
**Institution:** MIT Academy of Engineering, Pune (MITAOE)  
**System:** StudentSphere API — Student Record Management System  
**Base URL (Local):** `http://localhost:3000`  
**Base URL (Production):** Configured via `baseUrl` variable or hosting provider (e.g. Render)

---

## 1. Quick Route Table

| HTTP Method | Endpoint | Purpose | Request Body Required? | Success Code | Possible Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | API Root / Welcome Info | No | `200 OK` | `500` |
| **GET** | `/health` | Health probe & DB readiness check | No | `200 OK` | `503 Service Unavailable` |
| **POST** | `/api/students` | Register a new student record | **Yes** (JSON) | `201 Created` | `400 Bad Request`, `409 Conflict`, `500` |
| **GET** | `/api/students` | Retrieve all student records | No | `200 OK` | `500` |
| **GET** | `/api/students/:id` | Retrieve single student by ObjectId | No | `200 OK` | `400 Bad Request`, `404 Not Found`, `500` |
| **PUT** | `/api/students/:id` | Update existing student record | **Yes** (JSON) | `200 OK` | `400 Bad Request`, `404 Not Found`, `409 Conflict`, `500` |
| **DELETE**| `/api/students/:id` | Delete student record by ObjectId | No | `200 OK` | `400 Bad Request`, `404 Not Found`, `500` |

---

## 2. Detailed Endpoint Specifications

### A. Health Check
- **Route:** `GET /health`
- **Description:** Verifies service uptime and the actual MongoDB Atlas connection state using `mongoose.connection.readyState`.
- **Response Headers:** `Content-Type: application/json`

#### Success Response (`200 OK`):
```json
{
  "status": "UP",
  "database": "connected",
  "service": "StudentSphere API",
  "timestamp": "2026-10-28T09:00:00.000Z",
  "uptime": 128.4
}
```

#### Degraded Response (`503 Service Unavailable`):
```json
{
  "status": "DEGRADED",
  "database": "disconnected",
  "service": "StudentSphere API",
  "message": "Server is running but database connection is unavailable.",
  "timestamp": "2026-10-28T09:00:00.000Z",
  "uptime": 128.4
}
```

---

### B. Create Student
- **Route:** `POST /api/students`
- **Description:** Validates input parameters, checks for duplicate PRN and email, and persists a new student in MongoDB.
- **Request Headers:** `Content-Type: application/json`

#### Request Body Schema:
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

#### Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "Student created successfully.",
  "data": {
    "name": "Aarav Sharma",
    "prn": "2301234",
    "email": "aarav.sharma@mitaoe.ac.in",
    "mobile": "9876543210",
    "department": "Computer Engineering",
    "year": "Third Year",
    "dob": "2004-06-15T00:00:00.000Z",
    "_id": "6ae1b95f70817b24375b277c",
    "createdAt": "2026-10-28T08:59:11.692Z",
    "updatedAt": "2026-10-28T08:59:11.692Z",
    "id": "6ae1b95f70817b24375b277c"
  }
}
```

#### Error Response — Validation Failure (`400 Bad Request`):
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

#### Error Response — Duplicate Conflict (`409 Conflict`):
```json
{
  "success": false,
  "message": "Student with PRN '2301234' already exists.",
  "errors": [
    {
      "field": "prn",
      "message": "PRN is already registered to another student."
    }
  ]
}
```

---

### C. Get All Students
- **Route:** `GET /api/students`
- **Description:** Returns an array of all students sorted by most recently created (`createdAt: -1`).
- **Query Parameters:** None

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
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
  ]
}
```

---

### D. Get Student by ID
- **Route:** `GET /api/students/:id`
- **URL Parameters:**
  - `id` (String): 24-character hexadecimal MongoDB ObjectId.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Student retrieved successfully.",
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

#### Error Response — Malformed ObjectId (`400 Bad Request`):
```json
{
  "success": false,
  "message": "Invalid student ID format: 'invalid-id'. Must be a 24-character hexadecimal string."
}
```

#### Error Response — Non-existent Record (`404 Not Found`):
```json
{
  "success": false,
  "message": "Student with ID '507f1f77bcf86cd799439011' not found."
}
```

---

### E. Update Student
- **Route:** `PUT /api/students/:id`
- **URL Parameters:**
  - `id` (String): 24-character hexadecimal MongoDB ObjectId.
- **Request Headers:** `Content-Type: application/json`

#### Request Body Schema:
```json
{
  "name": "Aarav S. Sharma",
  "prn": "2301234",
  "email": "aarav.updated@mitaoe.ac.in",
  "mobile": "9876543210",
  "department": "Computer Engineering",
  "year": "Final Year",
  "dob": "2004-06-15"
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Student updated successfully.",
  "data": {
    "id": "6ae1b95f70817b24375b277c",
    "name": "Aarav S. Sharma",
    "prn": "2301234",
    "email": "aarav.updated@mitaoe.ac.in",
    "mobile": "9876543210",
    "department": "Computer Engineering",
    "year": "Final Year",
    "dob": "2004-06-15T00:00:00.000Z",
    "createdAt": "2026-10-28T08:59:11.692Z",
    "updatedAt": "2026-10-28T08:59:11.719Z"
  }
}
```

---

### F. Delete Student
- **Route:** `DELETE /api/students/:id`
- **URL Parameters:**
  - `id` (String): 24-character hexadecimal MongoDB ObjectId.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Student deleted successfully.",
  "data": {
    "id": "6ae1b95f70817b24375b277c",
    "name": "Aarav S. Sharma",
    "prn": "2301234"
  }
}
```

#### Error Response — Non-existent Record (`404 Not Found`):
```json
{
  "success": false,
  "message": "Student with ID '507f1f77bcf86cd799439011' not found. Cannot perform delete operation."
}
```

---

## 3. Validation Rules Reference

| Field | Type | Validation Rules | Error Message |
| :--- | :--- | :--- | :--- |
| `name` | String | Required, trimmed, length 2 to 100 characters, letters & symbols only | "Student name is required." / "Name must be at least 2 characters long." |
| `prn` | String | Required, unique, 6-12 alphanumeric characters (e.g. `2301234`) | "PRN must be 6 to 12 alphanumeric characters." |
| `email` | String | Required, unique, valid email format regex | "Enter a valid email address." |
| `mobile` | String | Required, 10-digit Indian phone format (`^[6-9]\d{9}$`) | "Mobile number must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9." |
| `department` | String | Required, enum: Computer Engineering, Information Technology, Electronics & Telecommunication, Mechanical Engineering, Civil Engineering, Chemical Engineering, Design Engineering | "Invalid department. Accepted values: ..." |
| `year` | String | Required, enum: First Year, Second Year, Third Year, Final Year | "Invalid academic year. Accepted values: ..." |
| `dob` | Date | Required, valid ISO 8601 date, must be in the past | "Date of birth must be a valid date in the past." |
