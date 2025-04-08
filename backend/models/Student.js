const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'M', 'F', 'Other'],
    default: 'male'
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  admissionNumber: {
    type: String,
    required: false,  // Changed to false to allow generation
    unique: true,
    trim: true
  },
  rollNumber: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    sparse: true  // This allows multiple null values, fixing the duplicate key error
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'transferred'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate rollNumber if not provided
studentSchema.pre('save', async function(next) {
  try {
    // If rollNumber is not set, generate one based on admissionNumber or a random value
    if (!this.rollNumber) {
      if (this.admissionNumber) {
        // Use admissionNumber as rollNumber if available
        this.rollNumber = this.admissionNumber;
      } else {
        // Generate a random rollNumber
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const prefix = new Date().getFullYear().toString().slice(-2);
        this.rollNumber = `${prefix}${randomNum}`;

        // Also set admissionNumber if it's not set
        if (!this.admissionNumber) {
          this.admissionNumber = this.rollNumber;
        }
      }

      console.log(`Generated rollNumber: ${this.rollNumber} for student: ${this.firstName} ${this.lastName}`);
    }
    next();
  } catch (error) {
    console.error('Error in student pre-save hook:', error);
    next(error);
  }
});

// Add any indexes needed
studentSchema.index({ userId: 1 }, { unique: true });
studentSchema.index({ admissionNumber: 1 }, { unique: true });
// Make rollNumber index sparse to allow multiple null values
studentSchema.index({ rollNumber: 1 }, { unique: true, sparse: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;