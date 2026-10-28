const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { connectDB, isDBConnected, getDBStatus } = require('./config/db');
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

// Health Check Endpoint (Reports actual database connection status)
app.get('/health', (req, res) => {
  const dbStatus = getDBStatus();

  if (dbStatus.connected) {
    return res.status(200).json({
      status: 'UP',
      database: 'connected',
      details: {
        host: dbStatus.host,
        databaseName: dbStatus.name,
        state: dbStatus.state,
      },
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
      details: {
        state: dbStatus.state,
        targetUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studentsphere_db',
      },
      message: 'Server is running but database connection is unavailable.',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
});

// Middleware: Ensure database is connected before handling DB-dependent routes
// Prevents unhandled Mongoose buffering errors when the DB is down
const checkDBReady = (req, res, next) => {
  if (!isDBConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is currently unavailable. Please verify MongoDB is running at mongodb://127.0.0.1:27017/studentsphere_db.',
    });
  }
  next();
};

// Mount Resource Routes with DB readiness verification
app.use('/api/students', checkDBReady, studentRoutes);

// 404 Route Handler
app.use(notFound);

// Centralized Error Handler
app.use(errorHandler);

// Server startup logic
let server;

const startServer = async () => {
  // Ensure MongoDB connects BEFORE opening HTTP port to accept requests
  await connectDB();

  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 StudentSphere API Server running on port ${PORT}`);
      console.log(`📡 Local URL: http://localhost:${PORT}`);
      console.log(`🩺 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 Students endpoint: http://localhost:${PORT}/api/students`);
      console.log(`====================================================`);
      resolve(server);
    });
  });
};

// Only start the listener if this file is executed directly (not imported by test runner or other scripts)
if (require.main === module) {
  startServer();
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

module.exports = { app, server, startServer };
