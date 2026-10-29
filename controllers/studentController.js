const Student = require('../models/Student');

/**
 * @desc    Create a new student record
 * @route   POST /api/students
 * @access  Public
 */
const createStudent = async (req, res, next) => {
  try {
    const { name, rollNumber, prn, rollNo, email, course, department, year, mobile, dob } = req.body;
    const rollVal = rollNumber || prn || rollNo;
    const courseVal = course || department;

    // Check for duplicate Roll Number / PRN
    const existingRoll = await Student.findOne({
      $or: [{ rollNumber: rollVal }, { prn: rollVal }, { rollNo: rollVal }],
    });
    if (existingRoll) {
      return res.status(409).json({
        success: false,
        message: `Student with roll number / PRN '${rollVal}' already exists.`,
        errors: [{ field: 'rollNumber', message: 'Roll number is already registered to another student.' }],
      });
    }

    // Check for duplicate Email
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: `Student with email '${email}' already exists.`,
        errors: [{ field: 'email', message: 'Email address is already in use.' }],
      });
    }

    const newStudent = await Student.create({
      name,
      rollNumber: rollVal,
      prn: rollVal,
      rollNo: rollVal,
      email,
      course: courseVal,
      department: courseVal,
      year,
      mobile,
      dob,
    });

    return res.status(201).json({
      success: true,
      message: 'Student created successfully.',
      data: newStudent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all student records
 * @route   GET /api/students
 * @access  Public
 */
const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single student by MongoDB ID
 * @route   GET /api/students/:id
 * @access  Public
 */
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student retrieved successfully.',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing student record by ID
 * @route   PUT /api/students/:id
 * @access  Public
 */
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, rollNumber, prn, rollNo, email, course, department, year, mobile, dob } = req.body;
    const rollVal = rollNumber || prn || rollNo;
    const courseVal = course || department;

    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID '${id}' not found.`,
      });
    }

    // Check duplicate Roll Number / PRN against other students
    if (rollVal && rollVal !== existingStudent.rollNumber && rollVal !== existingStudent.prn) {
      const duplicateRoll = await Student.findOne({
        _id: { $ne: id },
        $or: [{ rollNumber: rollVal }, { prn: rollVal }, { rollNo: rollVal }],
      });
      if (duplicateRoll) {
        return res.status(409).json({
          success: false,
          message: `Cannot update: Roll number / PRN '${rollVal}' is already in use by another student.`,
          errors: [{ field: 'rollNumber', message: 'Roll number must be unique.' }],
        });
      }
    }

    // Check duplicate Email against other students
    if (email && email !== existingStudent.email) {
      const duplicateEmail = await Student.findOne({ email, _id: { $ne: id } });
      if (duplicateEmail) {
        return res.status(409).json({
          success: false,
          message: `Cannot update: Email '${email}' is already in use by another student.`,
          errors: [{ field: 'email', message: 'Email must be unique.' }],
        });
      }
    }

    const updateData = {
      name,
      rollNumber: rollVal,
      prn: rollVal,
      rollNo: rollVal,
      email,
      course: courseVal,
      department: courseVal,
      year,
      mobile,
      dob,
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully.',
      data: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete student record by ID
 * @route   DELETE /api/students/:id
 * @access  Public
 */
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID '${id}' not found. Cannot perform delete operation.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully.',
      data: {
        id: deletedStudent.id || deletedStudent._id,
        name: deletedStudent.name,
        rollNumber: deletedStudent.rollNumber || deletedStudent.prn || deletedStudent.rollNo,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
