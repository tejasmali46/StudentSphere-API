const mongoose = require('mongoose');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const ROLL_REGEX = /^[A-Za-z0-9-]{3,15}$/;

/**
 * Normalizes year value to an integer between 1 and 4.
 * Supports strings like "Third Year", "TE", "3", or numeric 3.
 */
function parseAcademicYear(val) {
  if (typeof val === 'number') {
    return Number.isInteger(val) && val >= 1 && val <= 4 ? val : null;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim().toLowerCase();
    if (/^[1-4]$/.test(trimmed)) {
      return parseInt(trimmed, 10);
    }
    const yearMap = {
      'first year': 1,
      'first': 1,
      'fe': 1,
      'second year': 2,
      'second': 2,
      'se': 2,
      'third year': 3,
      'third': 3,
      'te': 3,
      'final year': 4,
      'fourth year': 4,
      'fourth': 4,
      'be': 4,
    };
    return yearMap[trimmed] || null;
  }
  return null;
}

/**
 * Validates incoming request body for POST (Create) and PUT (Update) student operations.
 */
const validateStudent = (req, res, next) => {
  const { name, rollNumber, prn, rollNo, email, course, department, year, mobile, dob } = req.body || {};
  const errors = [];

  // 1. Name validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Student name is required.' });
  } else if (name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long.' });
  } else if (name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name cannot exceed 100 characters.' });
  }

  // 2. Roll Number / PRN validation (accepts rollNumber, prn, or rollNo)
  const rawRoll = rollNumber || prn || rollNo;
  if (!rawRoll || typeof rawRoll !== 'string' || rawRoll.trim().length === 0) {
    errors.push({ field: 'rollNumber', message: 'Roll number / PRN is required.' });
  } else if (!ROLL_REGEX.test(rawRoll.trim())) {
    errors.push({
      field: 'rollNumber',
      message: 'Roll number must be 3 to 15 alphanumeric characters (e.g., 2301234 or MIT23CS01).',
    });
  }

  // 3. Email validation
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email address is required.' });
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'Enter a valid email address (e.g., student@mitaoe.ac.in).' });
  }

  // 4. Course / Department validation (accepts course or department)
  const rawCourse = course || department;
  if (!rawCourse || typeof rawCourse !== 'string' || rawCourse.trim().length === 0) {
    errors.push({ field: 'course', message: 'Course / Department is required.' });
  } else if (rawCourse.trim().length < 2) {
    errors.push({ field: 'course', message: 'Course must be at least 2 characters long.' });
  }

  // 5. Academic Year validation (number 1-4 or recognized string)
  if (year === undefined || year === null || (typeof year === 'string' && year.trim().length === 0)) {
    errors.push({ field: 'year', message: 'Academic year is required (1, 2, 3, or 4).' });
  } else {
    const normalizedYear = parseAcademicYear(year);
    if (!normalizedYear) {
      errors.push({
        field: 'year',
        message: 'Academic year must be a number between 1 and 4 (or First Year, Second Year, Third Year, Final Year).',
      });
    }
  }

  // 6. Optional Mobile validation (if provided)
  if (mobile !== undefined && mobile !== null && String(mobile).trim().length > 0) {
    if (!MOBILE_REGEX.test(String(mobile).trim())) {
      errors.push({
        field: 'mobile',
        message: 'Mobile number must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.',
      });
    }
  }

  // 7. Optional Date of Birth validation (if provided)
  if (dob !== undefined && dob !== null && String(dob).trim().length > 0) {
    const parsedDate = new Date(dob);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'dob', message: 'Date of birth must be a valid date format (e.g., YYYY-MM-DD).' });
    } else if (parsedDate >= new Date()) {
      errors.push({ field: 'dob', message: 'Date of birth cannot be today or in the future.' });
    }
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
  }

  // Sanitize and normalize fields on req.body
  const sanitizedRoll = String(rawRoll).trim().toUpperCase();
  const sanitizedCourse = String(rawCourse).trim();
  const sanitizedYear = parseAcademicYear(year);

  req.body.name = name.trim();
  req.body.rollNumber = sanitizedRoll;
  req.body.prn = sanitizedRoll;
  req.body.rollNo = sanitizedRoll;
  req.body.email = email.trim().toLowerCase();
  req.body.course = sanitizedCourse;
  req.body.department = sanitizedCourse;
  req.body.year = sanitizedYear;

  if (mobile) {
    req.body.mobile = String(mobile).trim();
  }
  if (dob) {
    req.body.dob = new Date(dob);
  }

  next();
};

/**
 * Validates whether the route parameter :id is a valid 24-character hexadecimal MongoDB ObjectId.
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid student ID format: '${id}'. Must be a 24-character hexadecimal string.`,
    });
  }

  next();
};

module.exports = {
  validateStudent,
  validateObjectId,
  parseAcademicYear,
};
