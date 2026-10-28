const mongoose = require('mongoose');

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/studentsphere_db';

/**
 * Establishes connection to MongoDB database.
 * Reads connection URI from environment variable MONGODB_URI,
 * defaulting to the local MongoDB instance at mongodb://127.0.0.1:27017/studentsphere_db.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || DEFAULT_LOCAL_URI;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
      driverInfo: { name: 'nodejs', version: process.version || '24.12.0' },
    });

    console.log(`✅ MongoDB Connected successfully to host: ${mongoose.connection.host}`);
    console.log(`📦 Database Name: ${mongoose.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not crash the process immediately to allow health checks and informative responses
    return false;
  }
};

/**
 * Returns detailed status of the MongoDB connection.
 * readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const readyState = mongoose.connection.readyState;
  return {
    connected: readyState === 1,
    state: states[readyState] || 'unknown',
    readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};

/**
 * Simple boolean check if the database is currently connected and ready.
 */
const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  connectDB,
  isDBConnected,
  getDBStatus,
  DEFAULT_LOCAL_URI,
};
