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
    prn: {
      type: String,
      required: [true, 'PRN (Permanent Registration Number) is required.'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9]{6,12}$/, 'PRN must be 6 to 12 alphanumeric characters.'],
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
    mobile: {
      type: String,
      required: [true, 'Mobile number is required.'],
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        'Mobile number must be a valid 10-digit Indian phone number starting with 6-9.',
      ],
    },
    department: {
      type: String,
      required: [true, 'Department is required.'],
      trim: true,
      enum: {
        values: [
          'Computer Engineering',
          'Information Technology',
          'Electronics & Telecommunication',
          'Mechanical Engineering',
          'Civil Engineering',
          'Chemical Engineering',
          'Design Engineering',
        ],
        message: '{VALUE} is not a supported department.',
      },
    },
    year: {
      type: String,
      required: [true, 'Academic year is required.'],
      trim: true,
      enum: {
        values: ['First Year', 'Second Year', 'Third Year', 'Final Year'],
        message: '{VALUE} is not a valid academic year.',
      },
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required.'],
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value) && value < new Date();
        },
        message: 'Date of birth must be a valid date in the past.',
      },
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

// Note: 'unique: true' on 'prn' and 'email' fields automatically creates unique MongoDB indexes

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
