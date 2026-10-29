const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long.'],
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    // rollNumber is the primary roll / PRN identifier required by faculty
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required.'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Za-z0-9-]{3,15}$/, 'Roll number must be 3 to 15 alphanumeric characters.'],
    },
    // prn alias maintained for backward compatibility with existing tests and records
    prn: {
      type: String,
      trim: true,
      uppercase: true,
    },
    // rollNo alias maintained for Render API compatibility
    rollNo: {
      type: String,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address.',
      ],
    },
    // course is required by faculty; department maintained for backward compatibility
    course: {
      type: String,
      required: [true, 'Course is required.'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    // year: numeric (1-4) representing academic year of study
    year: {
      type: Number,
      required: [true, 'Academic year is required.'],
      min: [1, 'Academic year must be between 1 and 4.'],
      max: [4, 'Academic year must be between 1 and 4.'],
    },
    // Optional additional fields for real-world profile support
    mobile: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save hook: ensure aliases stay synchronized (Mongoose v8 sync hook)
studentSchema.pre('save', function () {
  const rollVal = this.rollNumber || this.prn || this.rollNo;
  if (rollVal) {
    this.rollNumber = rollVal.trim().toUpperCase();
    this.prn = this.rollNumber;
    this.rollNo = this.rollNumber;
  }

  const courseVal = this.course || this.department;
  if (courseVal) {
    this.course = courseVal.trim();
    this.department = this.course;
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
