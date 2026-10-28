# StudentSphere API — Viva Voce Preparation Guide

**Subject:** Web Technology (2304362L) — Practical No. 6  
**Institution:** MIT Academy of Engineering, Pune  
**Project:** StudentSphere API (Student Record Management System)

This guide provides concise, technically rigorous answers to the 22 core viva questions expected by the external/internal examiner.

---

### 1. What is a REST API?
**Answer:**  
REST stands for **Representational State Transfer**. It is an architectural style for networked distributed systems defined by Roy Fielding in 2000. A REST API allows client applications to communicate with a server using standard HTTP methods to transfer representations of resources (most commonly formatted as JSON or XML). Key constraints include:
- **Client-Server Architecture:** Decoupling user interface concerns from data storage concerns.
- **Statelessness:** Each request from client to server must contain all of the information necessary to understand and complete the request; the server stores no client session context.
- **Cacheability:** Responses must explicitly define themselves as cacheable or non-cacheable.
- **Uniform Interface:** Standardized resource identification (URIs), resource manipulation through representations, and self-descriptive messages.
- **Layered System:** The client cannot ordinarily tell whether it is connected directly to the end server or an intermediary proxy.

---

### 2. What is CRUD?
**Answer:**  
CRUD is an acronym for the four fundamental data management operations performed on persistent storage:
- **C — Create:** Inserting new data records (mapped to HTTP `POST`).
- **R — Read:** Querying or fetching existing data (mapped to HTTP `GET`).
- **U — Update:** Modifying existing records (mapped to HTTP `PUT` for complete replacement or `PATCH` for partial modification).
- **D — Delete:** Removing records from storage (mapped to HTTP `DELETE`).

---

### 3. What is the difference between GET, POST, PUT, PATCH, and DELETE?
**Answer:**  
| HTTP Method | Purpose | Idempotent? | Safe? | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Fetches an existing resource | **Yes** | **Yes** | No |
| **POST** | Creates a new resource or triggers processing | **No** | **No** | Yes |
| **PUT** | Completely replaces an existing resource at a URI | **Yes** | **No** | Yes |
| **PATCH** | Applies partial modifications to a resource | **No** (by RFC standard) | **No** | Yes |
| **DELETE** | Removes the resource at a specific URI | **Yes** | **No** | Optional |

*Note: An idempotent method produces the identical server state whether executed once or ten times consecutively (e.g., deleting ID `123` ten times leaves the record deleted).*

---

### 4. What is a resource-based endpoint?
**Answer:**  
In REST, endpoints are modeled around **nouns** (resources) representing business entities rather than verbs or RPC action names:
- **RESTful Resource URL:** `GET /api/students` or `DELETE /api/students/123` (the HTTP verb specifies the action, and the URI specifies the entity).
- **Non-RESTful (RPC style):** `POST /api/getStudentList` or `POST /api/deleteStudentById?id=123`.

---

### 5. What is a route parameter?
**Answer:**  
A route parameter is a named URL segment used to capture a variable value specified at that position in the path. In Express, it is declared with a colon:
```javascript
app.get('/api/students/:id', (req, res) => {
  const studentId = req.params.id; // Captured from URL
});
```
When a client requests `GET /api/students/6ae1b95f`, Express populates `req.params.id` with `"6ae1b95f"`.

---

### 6. What is JSON?
**Answer:**  
JSON (**JavaScript Object Notation**) is a lightweight, human-readable, text-based data interchange format based on a subset of JavaScript object syntax. It is language-independent and universally supported. JSON supports data primitives: Strings, Numbers, Booleans, Null, Arrays (`[...]`), and Objects (`{ "key": "value" }`).

---

### 7. What is HTTP status code 200?
**Answer:**  
**`200 OK`**: Indicates that the HTTP request has succeeded. Used for successful `GET` queries, successful `PUT` updates, and `DELETE` confirmations returning a payload.

---

### 8. What is HTTP status code 201?
**Answer:**  
**`201 Created`**: Indicates that the request succeeded and led to the creation of a new resource. In our API, `POST /api/students` returns `201 Created` along with the newly created student record containing its database-assigned `_id`.

---

### 9. What is HTTP status code 400?
**Answer:**  
**`400 Bad Request`**: Indicates that the server cannot or will not process the request due to client error, such as invalid JSON syntax, malformed MongoDB ObjectId, or failed schema validation rules (e.g., invalid phone format or missing required name).

---

### 10. What is HTTP status code 404?
**Answer:**  
**`404 Not Found`**: Indicates that the origin server did not find a current representation for the target resource. Occurs when requesting an unregistered route (`GET /api/unknown`) or querying a valid ObjectId that does not exist in the database collection.

---

### 11. What is HTTP status code 500?
**Answer:**  
**`500 Internal Server Error`**: A generic error indicating that the server encountered an unexpected condition that prevented it from fulfilling the request, such as unhandled database driver exceptions or unhandled runtime syntax errors.

---

### 12. What is Express.js?
**Answer:**  
Express.js is a fast, unopinionated, minimalist web framework for Node.js. It provides a robust layer of fundamental web application features without obscuring Node.js features:
- Routing mechanisms (`app.get`, `app.post`, `express.Router`).
- Middleware pipeline execution (`req`, `res`, `next`).
- Request body parsing (`express.json()`).
- Error handling delegation.

---

### 13. What is MongoDB?
**Answer:**  
MongoDB is a source-available, open-source, document-oriented NoSQL database. Rather than storing records in rigid tables with rows and columns (relational model), MongoDB stores records as flexible, self-describing BSON (Binary JSON) documents organized into collections. Key advantages include horizontal scalability, dynamic schema flexibility, high-performance indexing, and native aggregation pipelines.

---

### 14. What is Mongoose?
**Answer:**  
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It acts as an abstraction layer over the native MongoDB driver, providing:
- Schema definitions and type casting.
- Built-in and custom server-side validation.
- Middleware hooks (pre/post save hooks).
- Model methods for concise querying (`find`, `create`, `findByIdAndUpdate`, `findByIdAndDelete`).

---

### 15. What is a schema?
**Answer:**  
In Mongoose, a schema is a JSON-like configuration object that defines the structure of documents within a specific MongoDB collection. It specifies the expected fields, their data types (String, Number, Date, ObjectId), constraints (`required: true`, `unique: true`), default values, validation regex patterns, and timestamps.

---

### 16. What is database connectivity?
**Answer:**  
Database connectivity refers to establishing and maintaining a persistent network communication channel (via TCP sockets or connection pools) between an application server and a database engine. In our project, `mongoose.connect(MONGODB_URI)` initiates an authenticated connection to MongoDB Atlas, after which Mongoose manages a connection pool to execute queries asynchronously.

---

### 17. How does server-side validation work?
**Answer:**  
Server-side validation is the process of inspecting incoming request data inside application middleware and schema definitions before allowing it to trigger database writes:
1. When a client issues `POST /api/students`, Express intercepts the payload with `validateStudent` middleware.
2. The middleware inspects `req.body` against business rules (e.g., Mobile Regex `/^[6-9]\d{9}$/`, RFC Email Regex, past Date of Birth).
3. If any field fails, execution stops immediately, and the server returns `HTTP 400 Bad Request` with an array of field errors.
4. If validation passes, `next()` passes control to the controller, where Mongoose executes secondary schema-level validators.

---

### 18. How are duplicate records prevented?
**Answer:**  
Duplicate records (such as duplicate PRNs or emails) are prevented using a **two-layer defensive strategy**:
1. **Application Layer Check (Pre-flight):** In `studentController.js`, we query `Student.findOne({ prn })` and `Student.findOne({ email })`. If found, we return `HTTP 409 Conflict` with a human-readable explanation.
2. **Database Layer Check (Unique Indexes):** In the Mongoose schema, fields are declared with `unique: true`. MongoDB enforces unique BSON index structures in the database engine (WiredTiger). Any concurrent insertion collision triggers MongoDB error code `11000` (E11000 duplicate key), which is caught by our centralized error middleware.

---

### 19. What is Postman?
**Answer:**  
Postman is an industry-standard API client and testing platform. It allows engineers to construct, send, and inspect HTTP requests (`GET`, `POST`, `PUT`, `DELETE`), inspect raw headers and JSON response bodies, automate test assertions using JavaScript test scripts (`pm.test`, `pm.expect`), and store dynamic values across requests using collection and environment variables.

---

### 20. How is the API deployed?
**Answer:**  
Deployment involves moving the backend application from a local development environment to an internet-facing cloud platform:
1. The code is pushed to a Git repository on GitHub without `.env` or `node_modules`.
2. A cloud PaaS provider (such as **Render**) is linked to the repository.
3. Render detects `package.json`, installs dependencies using `npm install`, and starts the server with `npm start`.
4. Environment variables (`PORT`, `NODE_ENV`, `MONGODB_URI`) are injected securely in the Render dashboard.
5. MongoDB Atlas Network Access is configured to allow incoming traffic from cloud hosts (`0.0.0.0/0`).
6. The public health probe (`https://<app>.onrender.com/health`) validates the deployment.

---

### 21. Why should credentials be stored in environment variables?
**Answer:**  
Storing credentials (database passwords, API keys, private tokens) in source code introduces severe security risks:
- Committing secrets to version control (Git/GitHub) exposes them publicly to scraping bots and unauthorized users.
- Storing configuration in environment variables (`process.env`) adheres to the industry-standard **Twelve-Factor App methodology (Config factor)**, allowing identical codebase deployments across local, staging, and production environments with different credentials.

---

### 22. Explain the complete flow from a Postman request to Express routing, validation, database operations, and the JSON response.
**Answer:**  
Step-by-step request lifecycle:
1. **Client Dispatch:** Postman formats an HTTP POST request targeting `http://localhost:3000/api/students` with a JSON body and sends it over TCP.
2. **Global Middleware:** Express receives the raw request. `cors()` verifies CORS headers; `express.json()` reads the incoming data stream and parses it into `req.body`.
3. **Route Matching:** Express matches `/api/students` to the router mounted in `routes/studentRoutes.js`.
4. **Validation Middleware:** `validateStudent` middleware inspects `req.body.mobile`, `email`, `prn`, etc. If invalid, it halts and returns HTTP 400. If valid, it invokes `next()`.
5. **Controller Execution:** `studentController.createStudent` runs. It queries MongoDB to ensure uniqueness, creates a new Mongoose document instance, and invokes `Student.create()`.
6. **Database Persistence:** Mongoose serializes the JavaScript object into BSON and writes it to the MongoDB `students` collection via the open connection pool. MongoDB generates a 12-byte ObjectId `_id` and persists the record.
7. **Response Formatting:** The controller receives the persisted document, formats a uniform JSON payload `{ success: true, message: "...", data: student }`, and sends an HTTP `201 Created` response.
8. **Client Assertion:** Postman receives the HTTP response, executes its test script to verify `pm.response.to.have.status(201)`, and extracts `data.id` into `pm.collectionVariables` for subsequent requests.
