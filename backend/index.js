const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Add Model Imports Here ---
require('./models/User');
require('./models/Teacher');
require('./models/Student');
require('./models/AcademicYear');
require('./models/Class');
require('./models/Subject'); // Ensure Subject is loaded
require('./models/Exam');
require('./models/ExamType');
require('./models/Result');
require('./models/News');
require('./models/ParentContact'); // Parent contact model for SMS
// Finance models
require('./models/Finance');
require('./models/FeeStructure');
require('./models/FeeSchedule');
require('./models/StudentFee');
require('./models/Payment');
require('./models/QuickbooksConfig');
// -----------------------------

const userRoutes = require('./routes/userRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const resultRoutes = require('./routes/resultRoutes');
const fixedResultRoutes = require('./routes/fixedResultRoutes');
const directTestRoutes = require('./routes/directTestRoutes');
const resultReportRoutes = require('./routes/resultReportRoutes');
const examRoutes = require('./routes/examRoutes');
const newsRoutes = require('./routes/newsRoutes');
const examTypeRoutes = require('./routes/examTypeRoutes');
const academicRoutes = require('./routes/academicRoutes');
const newAcademicRoutes = require('./routes/newAcademicRoutes');
const directStudentRegister = require('./routes/directStudentRegister');
const debugRoutes = require('./routes/debugRoutes');
const teacherClassesRoute = require('./routes/teacherClassesRoute');
const financeRoutes = require('./routes/financeRoutes');
// const classRoutes = require('./routes/classRoutes');
const classRoutes = require('./routes/fixedClassRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const parentContactRoutes = require('./routes/parentContactRoutes');
const smsRoutes = require('./routes/smsRoutes');
const smsSettingsRoutes = require('./routes/smsSettingsRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const setupRoutes = require('./routes/setupRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();

// Middleware
// Configure CORS with specific options
const corsOrigin = process.env.CORS_ORIGIN || '*';
const corsOptions = {
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Pragma'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  credentials: true, // Allow cookies to be sent with requests
  maxAge: 86400, // Cache preflight requests for 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

console.log(`CORS configured with origin: ${corsOrigin}`);

// Handle preflight requests
app.options('*', cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check request received');
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
// Use fixed result routes for batch marks entry
app.use('/api/results/enter-marks/batch', fixedResultRoutes);
// Use original result routes for other endpoints
app.use('/api/results', resultRoutes);
app.use('/api/results/report', resultReportRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/exam-types', examTypeRoutes);
app.use('/api/academic-years', academicRoutes);
app.use('/api/new-academic-years', newAcademicRoutes);
app.use('/api', directStudentRegister);
app.use('/api/debug', debugRoutes);
app.use('/api/direct-test', directTestRoutes);
app.use('/api/teacher-classes', teacherClassesRoute);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/parent-contacts', parentContactRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/settings/sms', smsSettingsRoutes);
app.use('/api/student-assignments', assignmentRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/pdf', pdfRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Something broke!',
    error: err.message
  });
});

// Handle 404 routes - Make sure this is last
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found` });
});

module.exports = app;
