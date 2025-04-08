import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Tabs,
  Tab,
  Snackbar
} from '@mui/material';
import {
  Print as PrintIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { getClassResultReport } from '../../services/normalizedApi';
import { generateClassResultPDF } from '../../utils/pdfGenerator';

/**
 * A completely redesigned class result report component
 * This component uses the normalized data from the API
 */
const NewClassResultReport = () => {
  const { classId, examId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Fetch the class result report
  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      console.log(`Fetching result report for class ${classId} and exam ${examId}`);
      const data = await getClassResultReport(classId, examId);
      console.log('Normalized report data:', data);
      setReport(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching result report:', err);
      let errorMessage = 'Failed to fetch result report';
      if (err.response) {
        errorMessage = err.response.data?.message || err.response.statusText || errorMessage;
      } else if (err.request) {
        errorMessage = 'No response received from server. Please check your network connection.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [classId, examId]);

  // Fetch the report when the component mounts
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle download
  const handleDownload = () => {
    if (!report) {
      setSnackbar({ open: true, message: 'No report data available to download' });
      return;
    }

    try {
      // Generate the PDF
      const doc = generateClassResultPDF(report);

      // Save the PDF
      const fileName = `${report.className || 'Class'}_${report.section || ''}_${report.examName || 'Exam'}_Report.pdf`;
      doc.save(fileName);

      setSnackbar({ open: true, message: 'Report downloaded successfully' });
    } catch (err) {
      console.error('Error generating PDF:', err);
      setSnackbar({ open: true, message: 'Failed to download report' });
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Get division explanation
  const getDivisionExplanation = (points) => {
    if (!points) return '';

    const numPoints = Number(points);
    if (numPoints >= 7 && numPoints <= 14) return 'Division I (7-14 points)';
    if (numPoints >= 15 && numPoints <= 21) return 'Division II (15-21 points)';
    if (numPoints >= 22 && numPoints <= 25) return 'Division III (22-25 points)';
    if (numPoints >= 26 && numPoints <= 32) return 'Division IV (26-32 points)';
    if (numPoints >= 33 && numPoints <= 36) return 'Division 0 (33-36 points)';
    return '';
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading result report...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchReport}>
          Try Again
        </Button>
      </Box>
    );
  }

  // Show empty state
  if (!report) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No result report found for this class and exam.
        </Alert>
      </Box>
    );
  }

  // Render the report
  return (
    <Box sx={{ p: 3 }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
      />
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">
            Class Result Report
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ mr: 1 }}
              onClick={handleDownload}
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
            >
              Share
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h5">
          {report.className} {report.section} - {report.examName} Results
        </Typography>
        <Typography variant="subtitle1">
          Academic Year: {report.academicYear}
        </Typography>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Total Students
              </Typography>
              <Typography variant="h4">
                {report.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Class Average
              </Typography>
              <Typography variant="h4">
                {report.classAverage.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Highest Average
              </Typography>
              <Typography variant="h4">
                {report.students.length > 0 ? report.students[0].averageMarks : 'N/A'}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Total Subjects
              </Typography>
              <Typography variant="h4">
                {report.subjects.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Results Table" />
          <Tab label="Subject Analysis" />
          <Tab label="Division Analysis" />
        </Tabs>
      </Paper>

      {/* Results Table */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Student Results
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Sex</TableCell>
                  {report.subjects.map(subject => (
                    <TableCell key={subject.id} colSpan={2} align="center">{subject.name}</TableCell>
                  ))}
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Average</TableCell>
                  <TableCell align="center">Division</TableCell>
                  <TableCell align="center">Points</TableCell>
                  <TableCell align="center">Rank</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} />
                  {report.subjects.map(subject => (
                    <React.Fragment key={`header-${subject.id}`}>
                      <TableCell align="center">Marks</TableCell>
                      <TableCell align="center">Grade</TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell colSpan={5} />
                </TableRow>
              </TableHead>
              <TableBody>
                {report.students.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell>{student.rank}</TableCell>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>{student.sex}</TableCell>
                    {report.subjects.map(subject => {
                      const subjectResult = student.subjectResults.find(
                        result => result.subjectId === subject.id
                      );
                      return (
                        <React.Fragment key={`${student.studentId}-${subject.id}`}>
                          <TableCell align="center">
                            {subjectResult?.present ? subjectResult.marks : '-'}
                          </TableCell>
                          <TableCell align="center">
                            {subjectResult?.present ? subjectResult.grade : '-'}
                          </TableCell>
                        </React.Fragment>
                      );
                    })}
                    <TableCell align="center">{student.totalMarks}</TableCell>
                    <TableCell align="center">{student.averageMarks}</TableCell>
                    <TableCell align="center">
                      {student.division}
                      <Typography variant="caption" display="block">
                        {getDivisionExplanation(student.points)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{student.points}</TableCell>
                    <TableCell align="center">{student.rank}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Subject Analysis */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Subject Analysis
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell align="center">Average</TableCell>
                  <TableCell align="center">Highest</TableCell>
                  <TableCell align="center">Lowest</TableCell>
                  <TableCell align="center">A</TableCell>
                  <TableCell align="center">B</TableCell>
                  <TableCell align="center">C</TableCell>
                  <TableCell align="center">D</TableCell>
                  <TableCell align="center">F</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.subjects.map((subject) => {
                  // Calculate subject statistics
                  const subjectResults = report.students.flatMap(student =>
                    student.subjectResults.filter(result =>
                      result.subjectId === subject.id && result.present
                    )
                  );

                  const marks = subjectResults.map(result => Number(result.marks));
                  const average = marks.length > 0
                    ? marks.reduce((sum, mark) => sum + mark, 0) / marks.length
                    : 0;
                  const highest = marks.length > 0 ? Math.max(...marks) : 0;
                  const lowest = marks.length > 0 ? Math.min(...marks) : 0;

                  // Count grades
                  const grades = {
                    A: subjectResults.filter(result => result.grade === 'A').length,
                    B: subjectResults.filter(result => result.grade === 'B').length,
                    C: subjectResults.filter(result => result.grade === 'C').length,
                    D: subjectResults.filter(result => result.grade === 'D').length,
                    F: subjectResults.filter(result => result.grade === 'F').length,
                  };

                  return (
                    <TableRow key={subject.id}>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell align="center">{average.toFixed(2)}%</TableCell>
                      <TableCell align="center">{highest}</TableCell>
                      <TableCell align="center">{lowest}</TableCell>
                      <TableCell align="center">{grades.A}</TableCell>
                      <TableCell align="center">{grades.B}</TableCell>
                      <TableCell align="center">{grades.C}</TableCell>
                      <TableCell align="center">{grades.D}</TableCell>
                      <TableCell align="center">{grades.F}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Division Analysis */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Division Analysis
          </Typography>
          <Grid container spacing={2}>
            {['I', 'II', 'III', 'IV', '0'].map((division) => {
              const count = report.students.filter(student =>
                student.division === division
              ).length;
              const percentage = report.students.length > 0
                ? (count / report.students.length * 100).toFixed(1)
                : 0;

              return (
                <Grid item key={division} xs={12} sm={6} md={2.4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        Division {division}
                      </Typography>
                      <Typography variant="h4" align="center">
                        {count}
                      </Typography>
                      <Typography variant="subtitle1" align="center">
                        {percentage}%
                      </Typography>
                      <Typography variant="caption" align="center" display="block">
                        {getDivisionExplanation(division === 'I' ? 7 :
                          division === 'II' ? 15 :
                          division === 'III' ? 22 :
                          division === 'IV' ? 26 : 33)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default NewClassResultReport;
