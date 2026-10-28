require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, isDBConnected } = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Core Middleware
app.use(cors());
app.use(express.json());

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to StudentSphere API — Student Record Management System',
    version: '1.0.0',
    institution: 'MIT Academy of Engineering, Pune',
    course: 'Web Technology (2304362L) - Practical 6',
    endpoints: {
      health: 'GET /health',
      getAllStudents: 'GET /api/students',
      createStudent: 'POST /api/students',
      getStudentById: 'GET /api/students/:id',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id',
    },
  });
});

// Health Check Endpoint (Deployment readiness and DB probe)
app.get('/health', (req, res) => {
  const dbConnected = isDBConnected();

  if (dbConnected) {
    return res.status(200).json({
      status: 'UP',
      database: 'connected',
      service: 'StudentSphere API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } else {
    // Return HTTP 503 Service Unavailable if database is not reachable
    return res.status(503).json({
      status: 'DEGRADED',
      database: 'disconnected',
      service: 'StudentSphere API',
      message: 'Server is running but database connection is unavailable.',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
});

// Mount Resource Routes
app.use('/api/students', studentRoutes);

// 404 Route Handler
app.use(notFound);

// Centralized Error Handler
app.use(errorHandler);

// Server startup logic
let server;

// Only start the listener if this file is executed directly (not imported by tests)
if (process.env.NODE_ENV !== 'test') {
  // Connect to MongoDB
  connectDB();

  server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 StudentSphere API Server running on port ${PORT}`);
    console.log(`📡 Local URL: http://localhost:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 Students endpoint: http://localhost:${PORT}/api/students`);
    console.log(`====================================================`);
  });
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server...');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
    });
  }
});

module.exports = { app, server };
