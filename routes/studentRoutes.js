const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const {
  validateStudent,
  validateObjectId,
} = require('../middleware/validateStudent');

// Route: /api/students
router
  .route('/')
  .get(getAllStudents)
  .post(validateStudent, createStudent);

// Route: /api/students/:id
router
  .route('/:id')
  .get(validateObjectId, getStudentById)
  .put(validateObjectId, validateStudent, updateStudent)
  .delete(validateObjectId, deleteStudent);

module.exports = router;
