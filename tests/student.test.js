process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');
const Student = require('../models/Student');

const TEST_DB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/studentsphere_test_db';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI, {
    serverSelectionTimeoutMS: 5000,
    driverInfo: { name: 'nodejs', version: process.version || '24.12.0' },
  });
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
    await mongoose.connection.close();
  }
});

// Payload matching faculty specification
const facultyStudentPayload = {
  name: 'Aarav Sharma',
  rollNumber: '2301234',
  email: 'aarav.sharma@mitaoe.ac.in',
  course: 'Computer Engineering',
  year: 3,
};

// Payload matching legacy PRN format for backward compatibility
const legacyStudentPayload = {
  name: 'Rohan Patil',
  prn: '2301235',
  email: 'rohan.patil@mitaoe.ac.in',
  mobile: '9876543210',
  department: 'Information Technology',
  year: 'Third Year',
  dob: '2004-06-15',
};

describe('Student Records RESTful API - Automated Test Suite', () => {
  // =========================================================================
  // 1. Root & Health Check Endpoints
  // =========================================================================
  describe('GET / and GET /health', () => {
    it('should return welcome message and route manifest on GET / (HTTP 200)', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Student Records RESTful API');
      expect(res.body.endpoints).toBeDefined();
    });

    it('should report healthy UP status when database is connected on GET /health (HTTP 200)', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('UP');
      expect(res.body.database).toBe('connected');
    });
  });

  // =========================================================================
  // 2. CREATE STUDENT (POST /api/students)
  // =========================================================================
  describe('POST /api/students (Create Student)', () => {
    it('should create a new student record with faculty required fields (HTTP 201)', async () => {
      const res = await request(app)
        .post('/api/students')
        .send(facultyStudentPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Student created successfully.');
      expect(res.body.data.name).toBe(facultyStudentPayload.name);
      expect(res.body.data.rollNumber).toBe(facultyStudentPayload.rollNumber);
      expect(res.body.data.email).toBe(facultyStudentPayload.email);
      expect(res.body.data.course).toBe(facultyStudentPayload.course);
      expect(res.body.data.year).toBe(3);
      expect(res.body.data.id).toBeDefined();
    });

    it('should create a new student record with legacy/extended fields (HTTP 201)', async () => {
      const res = await request(app)
        .post('/api/students')
        .send(legacyStudentPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Student created successfully.');
      expect(res.body.data.name).toBe(legacyStudentPayload.name);
      expect(res.body.data.prn).toBe(legacyStudentPayload.prn);
      expect(res.body.data.rollNumber).toBe(legacyStudentPayload.prn);
      expect(res.body.data.email).toBe(legacyStudentPayload.email);
      expect(res.body.data.year).toBe(3);
    });

    it('should reject creation when missing required fields (HTTP 400)', async () => {
      const res = await request(app)
        .post('/api/students')
        .send({
          name: 'Incomplete Student',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed.');
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.some((e) => e.field === 'rollNumber')).toBe(true);
      expect(res.body.errors.some((e) => e.field === 'email')).toBe(true);
      expect(res.body.errors.some((e) => e.field === 'course')).toBe(true);
      expect(res.body.errors.some((e) => e.field === 'year')).toBe(true);
    });

    it('should reject invalid email format (HTTP 400)', async () => {
      const res = await request(app)
        .post('/api/students')
        .send({
          ...facultyStudentPayload,
          email: 'not-a-valid-email',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === 'email')).toBe(true);
    });

    it('should reject invalid academic year out of range 1-4 (HTTP 400)', async () => {
      const res = await request(app)
        .post('/api/students')
        .send({
          ...facultyStudentPayload,
          year: 5,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === 'year')).toBe(true);
    });

    it('should reject invalid mobile number when provided (HTTP 400)', async () => {
      const res = await request(app)
        .post('/api/students')
        .send({
          ...facultyStudentPayload,
          mobile: '12345', // Not 10 digits
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === 'mobile')).toBe(true);
    });

    it('should reject invalid future date of birth when provided (HTTP 400)', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 2);

      const res = await request(app)
        .post('/api/students')
        .send({
          ...facultyStudentPayload,
          dob: futureDate.toISOString(),
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === 'dob')).toBe(true);
    });

    it('should reject duplicate rollNumber (HTTP 409 Conflict)', async () => {
      await request(app).post('/api/students').send(facultyStudentPayload);

      const res = await request(app)
        .post('/api/students')
        .send({
          ...facultyStudentPayload,
          email: 'different.email@mitaoe.ac.in',
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('should reject duplicate email (HTTP 409 Conflict)', async () => {
      await request(app).post('/api/students').send(facultyStudentPayload);

      const res = await request(app)
        .post('/api/students')
        .send({
          ...facultyStudentPayload,
          rollNumber: '2309999',
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
  });

  // =========================================================================
  // 3. GET ALL STUDENTS (GET /api/students)
  // =========================================================================
  describe('GET /api/students (Get All Students)', () => {
    it('should return empty list when no students exist (HTTP 200)', async () => {
      const res = await request(app).get('/api/students');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
      expect(res.body.data).toEqual([]);
    });

    it('should return all student records when records exist (HTTP 200)', async () => {
      await Student.create(facultyStudentPayload);
      await Student.create({
        name: 'Neha Kulkarni',
        rollNumber: '2301235',
        email: 'neha.kulkarni@mitaoe.ac.in',
        course: 'Information Technology',
        year: 3,
      });

      const res = await request(app).get('/api/students');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data.length).toBe(2);
    });
  });

  // =========================================================================
  // 4. GET STUDENT BY ID (GET /api/students/:id)
  // =========================================================================
  describe('GET /api/students/:id (Get Student by ID)', () => {
    it('should return student record when ID exists (HTTP 200)', async () => {
      const created = await Student.create(facultyStudentPayload);

      const res = await request(app).get(`/api/students/${created._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rollNumber).toBe(facultyStudentPayload.rollNumber);
      expect(res.body.data.course).toBe(facultyStudentPayload.course);
    });

    it('should return 400 for malformed MongoDB ObjectId', async () => {
      const res = await request(app).get('/api/students/not-a-valid-id');
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid student ID format');
    });

    it('should return 404 when valid ObjectId does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/students/${nonExistentId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });
  });

  // =========================================================================
  // 5. UPDATE STUDENT (PUT /api/students/:id)
  // =========================================================================
  describe('PUT /api/students/:id (Update Student)', () => {
    it('should update student with valid data (HTTP 200)', async () => {
      const created = await Student.create(facultyStudentPayload);

      const updatePayload = {
        name: 'Aarav S. Sharma',
        rollNumber: created.rollNumber,
        email: 'aarav.updated@mitaoe.ac.in',
        course: 'Computer Engineering',
        year: 4,
      };

      const res = await request(app)
        .put(`/api/students/${created._id}`)
        .send(updatePayload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Aarav S. Sharma');
      expect(res.body.data.email).toBe('aarav.updated@mitaoe.ac.in');
      expect(res.body.data.year).toBe(4);
    });

    it('should return 400 for invalid data during update', async () => {
      const created = await Student.create(facultyStudentPayload);

      const res = await request(app)
        .put(`/api/students/${created._id}`)
        .send({
          ...facultyStudentPayload,
          email: 'bad-email-address',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 when updating non-existent student', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/students/${nonExistentId}`)
        .send(facultyStudentPayload);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // =========================================================================
  // 6. DELETE STUDENT (DELETE /api/students/:id)
  // =========================================================================
  describe('DELETE /api/students/:id (Delete Student)', () => {
    it('should delete existing student (HTTP 200)', async () => {
      const created = await Student.create(facultyStudentPayload);

      const res = await request(app).delete(`/api/students/${created._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted successfully');

      // Verify deletion in database
      const foundInDb = await Student.findById(created._id);
      expect(foundInDb).toBeNull();
    });

    it('should return 404 when deleting non-existent student', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/students/${nonExistentId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when deleting with malformed ID', async () => {
      const res = await request(app).delete('/api/students/invalid-hex-id');
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // =========================================================================
  // 7. 404 Route & Malformed Request Handling
  // =========================================================================
  describe('Error Handling Middleware', () => {
    it('should return 404 JSON for undefined routes', async () => {
      const res = await request(app).get('/api/non-existent-route');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Resource not found');
    });

    it('should handle malformed JSON syntax gracefully (HTTP 400)', async () => {
      const res = await request(app)
        .post('/api/students')
        .set('Content-Type', 'application/json')
        .send('{"name": "Broken JSON, }');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Malformed JSON');
    });
  });
});
