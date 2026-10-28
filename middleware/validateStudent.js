const mongoose = require('mongoose');

const VALID_DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Design Engineering',
];

const VALID_YEARS = [
  'First Year',
  'Second Year',
  'Third Year',
  'Final Year',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const PRN_REGEX = /^[A-Za-z0-9]{6,12}$/;

/**
 * Validates the student request body for POST (Create) and PUT (Full Update) operations.
 */
const validateStudent = (req, res, next) => {
  const { name, prn, email, mobile, department, year, dob } = req.body || {};
  const errors = [];

  // 1. Name validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Student name is required.' });
  } else if (name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long.' });
  } else if (name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name cannot exceed 100 characters.' });
  } else if (!/^[A-Za-z\s.'-]+$/.test(name.trim())) {
    errors.push({ field: 'name', message: 'Name should contain letters and standard name characters only.' });
  }

  // 2. PRN validation
  if (!prn || typeof prn !== 'string' || prn.trim().length === 0) {
    errors.push({ field: 'prn', message: 'PRN is required.' });
  } else if (!PRN_REGEX.test(prn.trim())) {
    errors.push({ field: 'prn', message: 'PRN must be 6 to 12 alphanumeric characters (e.g., 2301234 or MIT23CS01).' });
  }

  // 3. Email validation
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email address is required.' });
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'Enter a valid email address (e.g., student@mitaoe.ac.in).' });
  }

  // 4. Mobile validation
  if (!mobile || typeof mobile !== 'string' || mobile.trim().length === 0) {
    errors.push({ field: 'mobile', message: 'Mobile number is required.' });
  } else if (!MOBILE_REGEX.test(mobile.trim())) {
    errors.push({ field: 'mobile', message: 'Mobile number must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.' });
  }

  // 5. Department validation
  if (!department || typeof department !== 'string' || department.trim().length === 0) {
    errors.push({ field: 'department', message: 'Department is required.' });
  } else if (!VALID_DEPARTMENTS.includes(department.trim())) {
    errors.push({
      field: 'department',
      message: `Invalid department. Accepted values: ${VALID_DEPARTMENTS.join(', ')}.`,
    });
  }

  // 6. Year validation
  if (!year || typeof year !== 'string' || year.trim().length === 0) {
    errors.push({ field: 'year', message: 'Academic year is required.' });
  } else if (!VALID_YEARS.includes(year.trim())) {
    errors.push({
      field: 'year',
      message: `Invalid academic year. Accepted values: ${VALID_YEARS.join(', ')}.`,
    });
  }

  // 7. Date of Birth validation
  if (!dob) {
    errors.push({ field: 'dob', message: 'Date of birth is required.' });
  } else {
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

  // Clean / sanitize strings on req.body
  req.body.name = name.trim();
  req.body.prn = prn.trim().toUpperCase();
  req.body.email = email.trim().toLowerCase();
  req.body.mobile = mobile.trim();
  req.body.department = department.trim();
  req.body.year = year.trim();
  req.body.dob = new Date(dob);

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
};
