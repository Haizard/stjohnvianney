const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const Subject = require('../models/Subject');

// Get all subjects
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('GET /api/subjects - Fetching all subjects');
    const subjects = await Subject.find();
    console.log(`GET /api/subjects - Found ${subjects.length} subjects`);
    res.json(subjects);
  } catch (error) {
    console.error('GET /api/subjects - Error:', error);
    res.status(500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Create new subject
router.post('/', authenticateToken, authorizeRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log('POST /api/subjects - Creating subject with data:', req.body);
    const subject = new Subject(req.body);
    const newSubject = await subject.save();
    console.log('Subject created successfully:', newSubject);
    res.status(201).json(newSubject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(400).json({
      message: error.message,
      code: error.code,
      name: error.name
    });
  }
});

// Update subject
router.put('/:id', authenticateToken, authorizeRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log(`PUT /api/subjects/${req.params.id} - Updating subject with data:`, req.body);
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) {
      console.log(`Subject not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Subject not found' });
    }
    console.log('Subject updated successfully:', subject);
    res.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(400).json({
      message: error.message,
      code: error.code,
      name: error.name
    });
  }
});

// Delete subject
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log(`DELETE /api/subjects/${req.params.id} - Deleting subject`);
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      console.log(`Subject not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Subject not found' });
    }
    console.log('Subject deleted successfully:', subject);
    res.json({
      message: 'Subject deleted successfully',
      deletedSubject: subject
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({
      message: error.message,
      code: error.code,
      name: error.name
    });
  }
});

module.exports = router;