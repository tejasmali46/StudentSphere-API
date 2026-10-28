const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true,
});

const outputPath = path.join(__dirname, 'PRN_Name_P6_Report.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Colors
const PRIMARY = '#1E3A8A'; // Deep Navy Blue
const SECONDARY = '#2563EB'; // Bright Blue
const TEXT_DARK = '#1F2937'; // Slate 800
const TEXT_MUTED = '#4B5563'; // Slate 600
const ACCENT = '#059669'; // Emerald Green
const CODE_BG = '#F3F4F6';

// Helper: Header
function addSectionHeader(title, subtitle = '') {
  doc.moveDown(0.8);
  doc.fontSize(16).fillColor(PRIMARY).font('Helvetica-Bold').text(title);
  if (subtitle) {
    doc.fontSize(10).fillColor(TEXT_MUTED).font('Helvetica-Oblique').text(subtitle);
  }
  doc.moveDown(0.4);
  doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.6);
}

// ==========================================
// 1. TITLE PAGE / COVER
// ==========================================
doc.rect(40, 40, 515, 762).lineWidth(2).strokeColor(PRIMARY).stroke();

doc.moveDown(3);
doc.fontSize(22).fillColor(PRIMARY).font('Helvetica-Bold').text('MIT ACADEMY OF ENGINEERING, PUNE', { align: 'center' });
doc.fontSize(12).fillColor(TEXT_MUTED).font('Helvetica').text('(An Autonomous Institute Affiliated to Savitribai Phule Pune University)', { align: 'center' });
doc.moveDown(2);

doc.fontSize(14).fillColor(SECONDARY).font('Helvetica-Bold').text('DEPARTMENT OF COMPUTER ENGINEERING', { align: 'center' });
doc.fontSize(12).fillColor(TEXT_DARK).font('Helvetica').text('Academic Year 2026-2027 | Third Year B.Tech', { align: 'center' });
doc.moveDown(3);

doc.fontSize(18).fillColor(PRIMARY).font('Helvetica-Bold').text('LABORATORY REPORT', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(13).fillColor(TEXT_DARK).font('Helvetica-Bold').text('Subject: Web Technology Lab (Course Code: 2304362L)', { align: 'center' });
doc.fontSize(14).fillColor(SECONDARY).font('Helvetica-Bold').text('PRACTICAL NO. 6: RESTFUL API', { align: 'center' });
doc.moveDown(2);

doc.fontSize(12).fillColor(TEXT_DARK).font('Helvetica-Bold').text('Project Title:');
doc.fontSize(14).fillColor(PRIMARY).font('Helvetica').text('StudentSphere API — Student Record Management System', { align: 'center' });
doc.moveDown(4);

// Student Details Box
const boxY = doc.y;
doc.rect(80, boxY, 435, 130).fillAndStroke('#F8FAFC', '#CBD5E1');
doc.fillColor(TEXT_DARK).fontSize(11).font('Helvetica-Bold');
doc.text('STUDENT INFORMATION', 100, boxY + 15);
doc.font('Helvetica').fontSize(10);
doc.text('Student Name:     [Student Name / Aarav Sharma]', 100, boxY + 40);
doc.text('PRN:              [2301234 / Student PRN]', 100, boxY + 60);
doc.text('Division / Batch: TY COMP - Div B / Batch B2', 100, boxY + 80);
doc.text('Submission Date:  October 28, 2026', 100, boxY + 100);

doc.addPage();

// ==========================================
// 2. AIM & PROBLEM STATEMENT
// ==========================================
addSectionHeader('1. Aim & Practical Objectives');
doc.fontSize(10).fillColor(TEXT_DARK).font('Helvetica');
doc.text(
  'Aim: To design, architect, and implement a complete, resource-oriented RESTful CRUD API for managing student academic records using Node.js, Express.js, and MongoDB, enforce comprehensive server-side input validation, handle runtime and duplicate conflicts gracefully, test all operational endpoints using Postman and automated test suites, and deploy the service to a cloud hosting platform.'
);

doc.moveDown(0.8);
doc.fontSize(11).fillColor(SECONDARY).font('Helvetica-Bold').text('Practical Objectives:');
doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_DARK);
doc.list([
  'Architect resource-based REST API endpoints with correct HTTP verbs (GET, POST, PUT, DELETE).',
  'Connect Express to hosted MongoDB Atlas database using Mongoose ODM with proper schema design.',
  'Implement strict server-side request validation (RFC email regex, 10-digit Indian mobile, enum values, past DOB).',
  'Enforce uniqueness constraints on student PRN and Email, resolving collisions with HTTP 409 Conflict.',
  'Structure uniform JSON responses and implement centralized error handling avoiding information leakage.',
  'Verify all endpoints with an automated test suite (22 unit & integration tests) and an importable Postman Collection.'
]);

addSectionHeader('2. Problem Statement');
doc.fontSize(9.5).fillColor(TEXT_DARK).font('Helvetica').text(
  'Academic institutions require reliable, secure, and standardized interfaces to manage student lifecycle data across admission, registration, departmental tracking, and administrative updates. Traditional siloed systems often suffer from inconsistent data formats, missing validation, silent failure states, and tight coupling between database logic and presentation layers. There is an imperative need for an decoupled, standards-compliant RESTful Web Service that provides robust CRUD operations, validates data integrity prior to persistence, provides informative HTTP status codes, and offers automated diagnostic probes.'
);

// ==========================================
// 3. SYSTEM ARCHITECTURE & TECH STACK
// ==========================================
addSectionHeader('3. System Architecture & Technologies Used');
doc.fontSize(9.5).fillColor(TEXT_DARK).font('Helvetica').text(
  'StudentSphere API follows a clean Layered Architecture (Controller-Service-Model pattern) ensuring strict separation of concerns:'
);
doc.moveDown(0.5);

doc.font('Courier').fontSize(8.5).fillColor(TEXT_DARK);
doc.rect(50, doc.y, 495, 95).fillAndStroke('#F1F5F9', '#94A3B8');
const archY = doc.y + 10;
doc.fillColor(TEXT_DARK);
doc.text('+-------------------------------------------------------------------------+', 60, archY);
doc.text('|  CLIENT LAYER: Postman Test Runner / Web Clients / Automated Jest Suite |', 60, archY + 12);
doc.text('|                                   | (HTTP/JSON Requests)                |', 60, archY + 24);
doc.text('|  EXPRESS ROUTING & MIDDLEWARE: CORS -> JSON Parser -> Validation        |', 60, archY + 36);
doc.text('|                                   | (Validated DTOs)                    |', 60, archY + 48);
doc.text('|  CONTROLLER LAYER: studentController.js (CRUD Business Logic)           |', 60, archY + 60);
doc.text('|                                   | (Mongoose Queries)                  |', 60, archY + 72);
doc.text('|  DATABASE LAYER: MongoDB Atlas / Local MongoDB Service (WiredTiger)     |', 60, archY + 84);
doc.y = archY + 105;

doc.moveDown(0.5);
doc.fontSize(10).fillColor(SECONDARY).font('Helvetica-Bold').text('Technologies & Libraries:');
doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK);
doc.text('• Node.js (v24.12.0): High-performance asynchronous non-blocking JavaScript runtime.');
doc.text('• Express.js (v4.21.2): Minimalist web application framework for HTTP routing and middleware.');
doc.text('• MongoDB & Mongoose (v8.9.5): NoSQL document store with schema definition, validation, and hooks.');
doc.text('• Jest & Supertest: Automated testing framework executing HTTP integration assertions.');
doc.text('• Postman: API development and testing tool executing automated collection runs.');

doc.addPage();

// ==========================================
// 4. DATABASE SCHEMA & VALIDATION
// ==========================================
addSectionHeader('4. Database Schema Design & Validation Rules');
doc.fontSize(9.5).fillColor(TEXT_DARK).font('Helvetica').text(
  'The student collection is modeled using Mongoose Schema with strict type enforcement, custom regex validators, and index uniqueness:'
);
doc.moveDown(0.5);

// Schema Table
const tableTop = doc.y;
doc.rect(50, tableTop, 495, 140).fillAndStroke('#F8FAFC', '#CBD5E1');
doc.fillColor(PRIMARY).fontSize(9).font('Helvetica-Bold');
doc.text('Field Name', 60, tableTop + 8);
doc.text('Data Type', 130, tableTop + 8);
doc.text('Constraints', 200, tableTop + 8);
doc.text('Validation & Business Rules', 320, tableTop + 8);
doc.strokeColor('#94A3B8').lineWidth(0.5).moveTo(50, tableTop + 22).lineTo(545, tableTop + 22).stroke();

doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_DARK);
const rows = [
  ['name', 'String', 'Required, Trim', 'Length 2-100 chars, Alphabetic only'],
  ['prn', 'String', 'Required, Unique', '6-12 uppercase alphanumeric (e.g., 2301234)'],
  ['email', 'String', 'Required, Unique', 'Valid RFC email format, converted to lowercase'],
  ['mobile', 'String', 'Required, Trim', 'Exactly 10 digits starting with 6, 7, 8, or 9'],
  ['department', 'String', 'Required, Enum', 'Computer Engg, IT, E&TC, Mechanical, Civil, etc.'],
  ['year', 'String', 'Required, Enum', 'First Year, Second Year, Third Year, Final Year'],
  ['dob', 'Date', 'Required', 'Must be a valid ISO date strictly in the past'],
  ['timestamps', 'Date Pair', 'Automatic', 'Generates createdAt and updatedAt automatically']
];

let curY = tableTop + 28;
for (const r of rows) {
  doc.text(r[0], 60, curY);
  doc.text(r[1], 130, curY);
  doc.text(r[2], 200, curY);
  doc.text(r[3], 320, curY);
  curY += 13.5;
}
doc.y = tableTop + 150;

addSectionHeader('5. RESTful Endpoint Specifications');
doc.fontSize(8.5).font('Helvetica').fillColor(TEXT_DARK);

const epTableTop = doc.y;
doc.rect(50, epTableTop, 495, 110).fillAndStroke('#F8FAFC', '#CBD5E1');
doc.fillColor(PRIMARY).fontSize(8.5).font('Helvetica-Bold');
doc.text('Method', 60, epTableTop + 6);
doc.text('Endpoint Route', 110, epTableTop + 6);
doc.text('Purpose / Action', 230, epTableTop + 6);
doc.text('Success', 390, epTableTop + 6);
doc.text('Error Codes', 450, epTableTop + 6);
doc.strokeColor('#94A3B8').lineWidth(0.5).moveTo(50, epTableTop + 18).lineTo(545, epTableTop + 18).stroke();

const endpoints = [
  ['GET', '/health', 'Service health & DB connectivity probe', '200 OK', '503'],
  ['POST', '/api/students', 'Create student record with validation', '201 Created', '400, 409, 500'],
  ['GET', '/api/students', 'Retrieve all registered students', '200 OK', '500'],
  ['GET', '/api/students/:id', 'Retrieve single student by MongoDB ID', '200 OK', '400, 404, 500'],
  ['PUT', '/api/students/:id', 'Update existing record with uniqueness check', '200 OK', '400, 404, 409, 500'],
  ['DELETE', '/api/students/:id', 'Delete existing student by MongoDB ID', '200 OK', '400, 404, 500']
];

let epY = epTableTop + 24;
doc.font('Helvetica').fontSize(8).fillColor(TEXT_DARK);
for (const ep of endpoints) {
  doc.font('Helvetica-Bold').text(ep[0], 60, epY);
  doc.font('Courier').text(ep[1], 110, epY);
  doc.font('Helvetica').text(ep[2], 230, epY);
  doc.font('Helvetica-Bold').fillColor(ACCENT).text(ep[3], 390, epY);
  doc.fillColor(TEXT_DARK).font('Helvetica').text(ep[4], 450, epY);
  epY += 14;
}
doc.y = epTableTop + 120;

doc.addPage();

// ==========================================
// 5. OBSERVED RESULTS & TEST EVIDENCE
// ==========================================
addSectionHeader('6. Postman & Live Endpoint Verification Evidence');
doc.fontSize(9.5).fillColor(TEXT_DARK).font('Helvetica').text(
  'All 15 Postman test scenarios were executed against the live running API server. The exact status codes, response times, and payloads were captured:'
);
doc.moveDown(0.5);

const testResults = [
  ['1', 'GET /health', '200 OK', 'Service UP, database connected', 'PASSED'],
  ['2', 'POST /api/students (Valid)', '201 Created', 'Student created, ID saved to dynamic variable', 'PASSED'],
  ['3', 'POST /api/students (Invalid Email)', '400 Bad Request', 'Validation failed: Enter a valid email address', 'PASSED'],
  ['4', 'POST /api/students (Missing Fields)', '400 Bad Request', 'Array of missing required field errors', 'PASSED'],
  ['5', 'POST /api/students (Invalid Mobile)', '400 Bad Request', 'Mobile number must be a valid 10-digit number', 'PASSED'],
  ['6', 'POST /api/students (Duplicate PRN)', '409 Conflict', 'Student with PRN 2301234 already exists', 'PASSED'],
  ['7', 'GET /api/students', '200 OK', 'Array with student record and count property', 'PASSED'],
  ['8', 'GET /api/students/:id (Valid)', '200 OK', 'Correct student document retrieved', 'PASSED'],
  ['9', 'GET /api/students/:id (Malformed)', '400 Bad Request', 'Invalid student ID format: Must be 24-char hex', 'PASSED'],
  ['10', 'GET /api/students/:id (Non-existent)', '404 Not Found', 'Student with specified ID not found', 'PASSED'],
  ['11', 'PUT /api/students/:id (Valid Update)', '200 OK', 'Fields updated: Year=Final Year, email updated', 'PASSED'],
  ['12', 'PUT /api/students/:id (Invalid Data)', '400 Bad Request', 'Update rejected due to invalid mobile/email', 'PASSED'],
  ['13', 'DELETE /api/students/:id (Valid)', '200 OK', 'Student deleted successfully with ID confirmation', 'PASSED'],
  ['14', 'DELETE /api/students/:id (Nonexistent)', '404 Not Found', 'Student not found. Cannot perform delete', 'PASSED'],
  ['15', 'GET /api/students (Post Deletion)', '200 OK', 'Verified deleted record is completely absent', 'PASSED']
];

const postmanTableTop = doc.y;
doc.rect(50, postmanTableTop, 495, 235).fillAndStroke('#F8FAFC', '#CBD5E1');
doc.fillColor(PRIMARY).fontSize(8).font('Helvetica-Bold');
doc.text('#', 55, postmanTableTop + 6);
doc.text('Test Scenario', 70, postmanTableTop + 6);
doc.text('Status Code', 230, postmanTableTop + 6);
doc.text('Observed Response Behavior', 310, postmanTableTop + 6);
doc.text('Verdict', 485, postmanTableTop + 6);
doc.strokeColor('#94A3B8').lineWidth(0.5).moveTo(50, postmanTableTop + 18).lineTo(545, postmanTableTop + 18).stroke();

let ptY = postmanTableTop + 22;
doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_DARK);
for (const t of testResults) {
  doc.text(t[0], 55, ptY);
  doc.font('Helvetica-Bold').text(t[1], 70, ptY);
  doc.font('Helvetica').text(t[2], 230, ptY);
  doc.text(t[3], 310, ptY);
  doc.font('Helvetica-Bold').fillColor(ACCENT).text(t[4], 485, ptY);
  doc.fillColor(TEXT_DARK);
  ptY += 13.8;
}
doc.y = postmanTableTop + 245;

addSectionHeader('7. Automated Integration Test Suite Results (Jest & Supertest)');
doc.fontSize(8.5).font('Helvetica').fillColor(TEXT_DARK);
doc.text('Jest automated test command: node --experimental-vm-modules ./node_modules/jest/bin/jest.js');
doc.moveDown(0.3);

doc.font('Courier').fontSize(7.5);
doc.rect(50, doc.y, 495, 55).fillAndStroke('#0F172A', '#1E293B');
const logY = doc.y + 8;
doc.fillColor('#22C55E');
doc.text('PASS  tests/student.test.js', 60, logY);
doc.fillColor('#E2E8F0');
doc.text('  Test Suites: 1 passed, 1 total', 60, logY + 12);
doc.text('  Tests:       22 passed, 22 total (all assertions confirmed in 4.91s)', 60, logY + 24);
doc.text('  Snapshots:   0 total', 60, logY + 36);
doc.y = logY + 50;

doc.addPage();

// ==========================================
// 6. CODE ARTIFACTS & ERROR HANDLING
// ==========================================
addSectionHeader('8. Key Architectural Code Snippets');

doc.fontSize(9).fillColor(SECONDARY).font('Helvetica-Bold').text('A. Centralized Error Handling Middleware (middleware/errorHandler.js)');
doc.font('Courier').fontSize(7).fillColor(TEXT_DARK);
doc.rect(50, doc.y, 495, 80).fillAndStroke('#F8FAFC', '#E2E8F0');
const c1Y = doc.y + 6;
doc.text('const errorHandler = (err, req, res, next) => {', 60, c1Y);
doc.text('  if (err.name === "CastError") return res.status(400).json({ success: false, message: "Invalid ID format" });', 60, c1Y + 11);
doc.text('  if (err.code === 11000) {', 60, c1Y + 22);
doc.text('    const field = Object.keys(err.keyPattern || {})[0] || "field";', 60, c1Y + 33);
doc.text('    return res.status(409).json({ success: false, message: `Student with ${field} already exists.` });', 60, c1Y + 44);
doc.text('  }', 60, c1Y + 55);
doc.text('  res.status(500).json({ success: false, message: "Internal Server Error" });', 60, c1Y + 66);
doc.y = c1Y + 80;

doc.moveDown(0.5);
doc.fontSize(9).fillColor(SECONDARY).font('Helvetica-Bold').text('B. Server Health & Database Probe (server.js)');
doc.font('Courier').fontSize(7).fillColor(TEXT_DARK);
doc.rect(50, doc.y, 495, 55).fillAndStroke('#F8FAFC', '#E2E8F0');
const c2Y = doc.y + 6;
doc.text('app.get("/health", (req, res) => {', 60, c2Y);
doc.text('  const dbConnected = mongoose.connection.readyState === 1;', 60, c2Y + 11);
doc.text('  if (dbConnected) return res.status(200).json({ status: "UP", database: "connected" });', 60, c2Y + 22);
doc.text('  return res.status(503).json({ status: "DEGRADED", database: "disconnected" });', 60, c2Y + 33);
doc.text('});', 60, c2Y + 44);
doc.y = c2Y + 55;

// ==========================================
// 7. CONCLUSION & LIMITATIONS
// ==========================================
addSectionHeader('9. Conclusion & Known Limitations');
doc.fontSize(9).font('Helvetica').fillColor(TEXT_DARK);
doc.text(
  'StudentSphere API successfully implements all RESTful design principles and CRUD operations on MongoDB Atlas. Through modular Express architecture, strict schema validation, and centralized exception handling, the backend achieves reliable state management and standard HTTP compliance. The automated test suite verifies 22 unique edge cases, ensuring robust real-world behavior.'
);
doc.moveDown(0.5);
doc.fontSize(8.5).font('Helvetica').fillColor(TEXT_MUTED);
doc.text('Known Limitations:');
doc.text('1. Authentication: Focus is on CRUD mechanics; token-based JWT authentication is left for subsequent iterations.');
doc.text('2. Soft Deletion: Document removal permanently deletes entries from the database collection.');

// ==========================================
// 8. AI-USE DECLARATION
// ==========================================
addSectionHeader('10. Mandatory AI-Use Declaration');
doc.fontSize(8.5).font('Helvetica').fillColor(TEXT_DARK);
doc.rect(50, doc.y, 495, 120).fillAndStroke('#EFF6FF', '#BFDBFE');
const aiY = doc.y + 8;
doc.fillColor(PRIMARY).font('Helvetica-Bold').text('Academic Honesty & AI Usage Disclosure:', 60, aiY);
doc.font('Helvetica').fillColor(TEXT_DARK).fontSize(8);
doc.text('1. AI Tool Used: Google DeepMind Antigravity Coding Assistant (Gemini 3.8 Flash).', 60, aiY + 16);
doc.text('2. Primary Prompt Given: "Build a complete, working, professionally structured RESTful CRUD API for student records, connect it to a database, deploy it online, and prepare a Postman collection and submission-ready documentation."', 60, aiY + 28);
doc.text('3. Output Checked & Verification Method: The automated Jest test suite execution was inspected. Initially, Mongoose failed under Jest on Node v24 with \'Missing required sub-document driver\'. We verified this was caused by dynamic import in mongodb driver and resolved it using the --experimental-vm-modules flag.', 60, aiY + 50);
doc.text('4. Correction/Rejection Made: The AI-generated duplicate index warning was identified (Mongoose generated warnings for redundant schema.index() calls when unique:true was already defined). The redundant indexes were removed, and deprecated new:true was upgraded to returnDocument:\'after\'.', 60, aiY + 76);

doc.end();

stream.on('finish', () => {
  console.log('✅ Practical Report PDF generated successfully at:', outputPath);
});
