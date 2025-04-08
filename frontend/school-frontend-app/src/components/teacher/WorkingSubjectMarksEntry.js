import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import api from '../../services/api';

const WorkingSubjectMarksEntry = () => {
  // State variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('67f2fd57dcc60fd7fef2ef1c'); // Default academic year ID
  const [marks, setMarks] = useState({});
  const user = useSelector((state) => state.user?.user);

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch academic years
      try {
        const academicYearsResponse = await api.get('/api/academic-years');
        console.log('Academic years:', academicYearsResponse.data);
        setAcademicYears(academicYearsResponse.data);

        // Set active academic year as default
        const activeYear = academicYearsResponse.data.find(year => year.isActive);
        if (activeYear) {
          setSelectedAcademicYear(activeYear._id);
        }
      } catch (err) {
        console.error('Error fetching academic years:', err);
      }

      // Fetch classes
      fetchClasses();
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load initial data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchSubjects();
      fetchStudents();
    }
  }, [selectedClass]);

  // Fetch exams when subject is selected
  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchExams();
    }
  }, [selectedClass, selectedSubject]);

  // Fetch classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError('');

      // Use a try-catch block to handle potential errors
      try {
        // First try to get teacher-specific classes
        const response = await api.get('/api/teacher-classes/my-classes');
        console.log('Teacher classes response:', response.data);
        setClasses(response.data);
      } catch (err) {
        console.log('Error fetching teacher classes, falling back to all classes');

        // If that fails, try to get all classes (for admin users)
        if (user?.role === 'admin') {
          console.log('User is admin, fetching all classes');
          const fallbackResponse = await api.get('/api/classes');
          console.log('All classes response:', fallbackResponse.data);
          setClasses(fallbackResponse.data);
        } else {
          // If not admin and teacher classes failed, create a default class
          console.log('Creating default class as fallback');
          setClasses([{
            _id: 'default-class',
            name: 'Default Class',
            stream: 'A',
            section: 'General'
          }]);
        }
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects for selected class
  const fetchSubjects = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      setError('');

      // Use a try-catch block to handle potential errors
      try {
        // First try to get teacher-specific subjects
        const response = await api.get('/api/teacher-classes/my-subjects');

        // Filter subjects for the selected class
        const subjectsForClass = response.data.filter(subject =>
          subject.classes && subject.classes.some(cls => cls._id === selectedClass)
        );

        setSubjects(subjectsForClass);

        // If no subjects found, try fallback
        if (subjectsForClass.length === 0) {
          throw new Error('No subjects found for this class');
        }
      } catch (err) {
        console.log('Error fetching teacher subjects, falling back to class subjects');

        // If that fails, try to get all subjects for the class
        const fallbackResponse = await api.get(`/api/classes/${selectedClass}/subjects`);
        setSubjects(fallbackResponse.data);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Failed to load subjects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch students for selected class
  const fetchStudents = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/api/students/class/${selectedClass}`);
      setStudents(response.data);

      // Initialize marks object
      const initialMarks = {};
      response.data.forEach(student => {
        initialMarks[student._id] = '';
      });
      setMarks(initialMarks);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch exams
  const fetchExams = async () => {
    if (!selectedClass || !selectedSubject) return;

    try {
      setLoading(true);
      setError('');

      console.log('Fetching exams with params:', {
        classId: selectedClass,
        academicYearId: selectedAcademicYear
      });

      const response = await api.get('/api/exams', {
        params: {
          classId: selectedClass,
          academicYearId: selectedAcademicYear
        }
      });

      console.log('Exams response:', response.data);

      // Add a display name for each exam
      const processedExams = response.data.map(exam => ({
        ...exam,
        displayName: `${exam.name} (${exam.type})`
      }));

      setExams(processedExams);

      // If no exams found, create a default one
      if (processedExams.length === 0) {
        console.log('No exams found, creating a default one');
        setExams([{
          _id: 'default-exam',
          name: 'Default Exam',
          type: 'Default',
          academicYear: selectedAcademicYear,
          displayName: 'Default Exam'
        }]);
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError('Failed to load exams. Please try again.');

      // Create a default exam as fallback
      console.log('Error fetching exams, creating a default one');
      setExams([{
        _id: 'default-exam',
        name: 'Default Exam',
        type: 'Default',
        academicYear: selectedAcademicYear,
        displayName: 'Default Exam'
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle mark change
  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  // Calculate grade based on marks
  const calculateGrade = (marks) => {
    if (!marks && marks !== 0) return '-';
    if (marks >= 75) return 'A';
    if (marks >= 65) return 'B';
    if (marks >= 45) return 'C';
    if (marks >= 30) return 'D';
    return 'F';
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all required fields
    if (!selectedAcademicYear) {
      setError('Please select an academic year');
      return;
    }

    if (!selectedClass) {
      setError('Please select a class');
      return;
    }

    if (!selectedSubject) {
      setError('Please select a subject');
      return;
    }

    if (!selectedExam) {
      setError('Please select an exam');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('Preparing to save marks with:', {
        academicYear: selectedAcademicYear,
        class: selectedClass,
        subject: selectedSubject,
        exam: selectedExam,
        marks
      });

      // Filter out empty marks
      const validMarks = Object.entries(marks)
        .filter(([_, value]) => value !== '')
        .map(([studentId, marksObtained]) => {
          // Create the mark object with all required fields
          const markData = {
            studentId,
            examId: selectedExam === 'default-exam' ? null : selectedExam,
            subjectId: selectedSubject,
            classId: selectedClass,
            academicYearId: selectedAcademicYear,
            marksObtained: Number.parseFloat(marksObtained)
          };

          // Add examName only if using default exam
          if (selectedExam === 'default-exam') {
            markData.examName = 'Default Exam';
          }

          // Ensure classId is a valid string and not undefined
          if (!markData.classId || markData.classId === 'default-class') {
            console.log('Using fallback class ID');
            // Use a fallback class ID if needed
            markData.classId = selectedClass || '67f2fd57dcc60fd7fef2ef1e';
          }

          console.log('Created mark data:', markData);
          return markData;
        });

      if (validMarks.length === 0) {
        setError('Please enter at least one mark');
        setLoading(false);
        return;
      }

      console.log('Sending marks data:', validMarks);

      // Validate that all required fields are present in each mark
      const missingFields = [];
      validMarks.forEach((mark, index) => {
        if (!mark.studentId) missingFields.push(`Mark ${index + 1}: studentId`);
        if (!mark.subjectId) missingFields.push(`Mark ${index + 1}: subjectId`);
        if (!mark.classId) missingFields.push(`Mark ${index + 1}: classId`);
        if (!mark.academicYearId) missingFields.push(`Mark ${index + 1}: academicYearId`);
        if (mark.marksObtained === undefined) missingFields.push(`Mark ${index + 1}: marksObtained`);
      });

      if (missingFields.length > 0) {
        const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
        console.error(errorMessage);
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Make the API call with explicit data structure
      const response = await api.post('/api/results/enter-marks/batch', {
        marksData: validMarks.map(mark => {
          // Create a clean object with only the required fields
          const cleanMark = {
            studentId: mark.studentId,
            subjectId: selectedSubject, // Use the selected subject directly
            classId: selectedClass, // Use the selected class directly
            academicYearId: selectedAcademicYear, // Use the selected academic year directly
            examId: selectedExam, // Use the selected exam directly
            marksObtained: mark.marksObtained
          };

          // Ensure classId is a valid string
          if (!cleanMark.classId || cleanMark.classId === 'default-class') {
            console.warn('Invalid classId, using fallback');
            cleanMark.classId = '67f2fe0fdcc60fd7fef2ef36'; // Fallback to a known valid class ID
          }

          // Log the clean mark object with types for debugging
          console.log('Clean mark object:', {
            ...cleanMark,
            studentId_type: typeof cleanMark.studentId,
            subjectId_type: typeof cleanMark.subjectId,
            classId_type: typeof cleanMark.classId,
            academicYearId_type: typeof cleanMark.academicYearId,
            examId_type: typeof cleanMark.examId,
            marksObtained_type: typeof cleanMark.marksObtained
          });

          // Add optional fields only if they exist
          if (mark.examId) cleanMark.examId = mark.examId;
          if (mark.examName) cleanMark.examName = mark.examName;
          if (mark.examTypeId) cleanMark.examTypeId = mark.examTypeId;

          return cleanMark;
        })
      });

      // Log the response for debugging
      console.log('API Response:', response.status, response.statusText);

      console.log('Save marks response:', response.data);
      setSuccess('Marks saved successfully');
    } catch (err) {
      console.error('Error saving marks:', err);
      let errorMessage = 'Failed to save marks. Please try again.';

      if (err.response) {
        console.error('Error response:', err.response.data);

        // Handle different types of error responses
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors) {
          // If there are validation errors, format them nicely
          if (typeof err.response.data.errors === 'object') {
            const errorFields = Object.keys(err.response.data.errors);
            errorMessage = `Error entering marks: ${errorFields.join(', ')}`;
          } else {
            errorMessage = `Error entering marks: ${err.response.data.errors}`;
          }
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Enter Subject Marks</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Academic Year</InputLabel>
            <Select
              value={selectedAcademicYear}
              label="Academic Year"
              onChange={(e) => {
                setSelectedAcademicYear(e.target.value);
                // Reset other selections when academic year changes
                setSelectedExam('');
              }}
              disabled={loading || academicYears.length === 0}
            >
              {academicYears.map((year) => (
                <MenuItem key={year._id} value={year._id}>
                  {year.year} {year.isActive && '(Active)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClass}
              label="Class"
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSubject('');
                setSelectedExam('');
              }}
              disabled={loading || classes.length === 0}
            >
              {classes.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>
                  {cls.name} {cls.section}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              label="Subject"
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedExam('');
              }}
              disabled={loading || !selectedClass || subjects.length === 0}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.name} ({subject.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Exam</InputLabel>
            <Select
              value={selectedExam}
              label="Exam"
              onChange={(e) => setSelectedExam(e.target.value)}
              disabled={loading || !selectedClass || !selectedSubject || exams.length === 0}
            >
              {exams.map((exam) => (
                <MenuItem key={exam._id} value={exam._id}>
                  {exam.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {students.length > 0 && selectedClass && selectedSubject && selectedExam ? (
              <>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Student Marks
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter marks for each student below. Marks should be between 0 and 100.
                  </Typography>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Roll Number</TableCell>
                        <TableCell>Marks (0-100)</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell>
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={marks[student._id] || ''}
                              onChange={(e) => handleMarkChange(student._id, e.target.value)}
                              inputProps={{ min: 0, max: 100 }}
                              size="small"
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            {calculateGrade(Number.parseFloat(marks[student._id]))}
                          </TableCell>
                          <TableCell>
                            {marks[student._id] ? (
                              <Chip
                                label="New"
                                color="success"
                                size="small"
                                variant="outlined"
                              />
                            ) : (
                              <Chip
                                label="Not Set"
                                color="default"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !selectedClass || !selectedSubject || !selectedExam}
                  >
                    Save Marks
                  </Button>
                </Box>
              </>
            ) : selectedClass ? (
              <Alert severity="info">
                {!selectedSubject
                  ? 'Please select a subject to continue.'
                  : !selectedExam
                    ? 'Please select an exam to continue.'
                    : 'No students found in this class.'}
              </Alert>
            ) : (
              <Alert severity="info">
                Please select a class to view students.
              </Alert>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default WorkingSubjectMarksEntry;
