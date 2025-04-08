const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Result = require('../models/Result');
const Student = require('../models/Student');
const Class = require('../models/Class');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://haithammisape:hrz123@schoolsystem.mp5ul7f.mongodb.net/john_vianey?retryWrites=true&w=majority';
console.log('Using MongoDB URI:', MONGODB_URI);

async function migrateResults() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Find all results
    const results = await Result.find({});
    console.log(`Found ${results.length} results to migrate`);

    let updatedCount = 0;
    let errorCount = 0;

    // Process each result
    for (const result of results) {
      try {
        // Find the student to get their class
        const student = await Student.findById(result.studentId);
        if (!student) {
          console.log(`Student not found for result ${result._id}, skipping`);
          errorCount++;
          continue;
        }

        // Set the classId if not already set
        if (!result.classId) {
          result.classId = student.class;
        }

        // Set alias fields
        result.student = result.studentId;
        result.exam = result.examId;
        result.academicYear = result.academicYearId;
        result.examType = result.examTypeId;
        result.subject = result.subjectId;
        result.class = result.classId;

        // Calculate grade and points if not already set
        if (result.marksObtained !== undefined && !result.grade) {
          // Simple grading logic - can be customized based on requirements
          if (result.marksObtained >= 80) {
            result.grade = 'A';
            result.points = 1;
          } else if (result.marksObtained >= 65) {
            result.grade = 'B';
            result.points = 2;
          } else if (result.marksObtained >= 50) {
            result.grade = 'C';
            result.points = 3;
          } else if (result.marksObtained >= 40) {
            result.grade = 'D';
            result.points = 4;
          } else {
            result.grade = 'F';
            result.points = 5;
          }
        }

        // Save the updated result
        await result.save();
        updatedCount++;
        
        if (updatedCount % 10 === 0) {
          console.log(`Processed ${updatedCount} results so far`);
        }
      } catch (err) {
        console.error(`Error processing result ${result._id}:`, err);
        errorCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} results. Errors: ${errorCount}`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migrateResults();
