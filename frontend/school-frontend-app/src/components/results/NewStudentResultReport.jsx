import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
  Chip,
  Snackbar
} from '@mui/material';
import {
  Print as PrintIcon,
  Share as ShareIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { getStudentResultReport } from '../../services/normalizedApi';
import { generateStudentResultPDF } from '../../utils/pdfGenerator';

/**
 * A completely redesigned student result report component
 * This component uses the normalized data from the API
 */
const NewStudentResultReport = () => {
  const { studentId, examId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [gradeDistribution, setGradeDistribution] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Fetch the student result report
  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      console.log(`Fetching result report for student ${studentId} and exam ${examId}`);
      const data = await getStudentResultReport(studentId, examId);
      console.log('Normalized report data:', data);
      setReport(data);

      // Calculate grade distribution
      if (data && data.results) {
        const distribution = {};
        data.results.forEach(result => {
          const grade = result.grade || 'N/A';
          distribution[grade] = (distribution[grade] || 0) + 1;
        });
        setGradeDistribution(distribution);
      }

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
  }, [studentId, examId]);

  // Fetch the report when the component mounts
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

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
      const doc = generateStudentResultPDF({ ...report, gradeDistribution });

      // Save the PDF
      const fileName = `${report.student?.fullName || 'Student'}_${report.exam?.name || 'Exam'}_Report.pdf`;
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
          No result report found for this student and exam.
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
            Student Result Report
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

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">
              Student Information
            </Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {report.student?.fullName}
            </Typography>
            <Typography variant="body1">
              <strong>Class:</strong> {report.class?.fullName}
            </Typography>
            <Typography variant="body1">
              <strong>Academic Year:</strong> {report.academicYear}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">
              Exam Information
            </Typography>
            <Typography variant="body1">
              <strong>Exam:</strong> {report.exam?.name}
            </Typography>
            <Typography variant="body1">
              <strong>Term:</strong> {report.exam?.term}
            </Typography>
            <Typography variant="body1">
              <strong>Year:</strong> {report.exam?.year}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Total Marks
              </Typography>
              <Typography variant="h4">
                {report.totalMarks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Average Marks
              </Typography>
              <Typography variant="h4">
                {report.averageMarks}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Division
              </Typography>
              <Typography variant="h4">
                {report.division}
              </Typography>
              <Typography variant="caption">
                {getDivisionExplanation(report.points)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Rank
              </Typography>
              <Typography variant="h4">
                {report.rank}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Subject Results Table */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Subject Results
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell align="center">Marks</TableCell>
                <TableCell align="center">Grade</TableCell>
                <TableCell align="center">Points</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.subject?.name}</TableCell>
                  <TableCell align="center">{result.marks}</TableCell>
                  <TableCell align="center">{result.grade}</TableCell>
                  <TableCell align="center">{result.points}</TableCell>
                  <TableCell>{result.remarks}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={1}><strong>Total</strong></TableCell>
                <TableCell align="center"><strong>{report.totalMarks}</strong></TableCell>
                <TableCell align="center"><strong>{report.grade}</strong></TableCell>
                <TableCell align="center"><strong>{report.points}</strong></TableCell>
                <TableCell><strong>{report.remarks}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Grade Distribution */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Grade Distribution
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(gradeDistribution).map(([grade, count]) => (
            <Grid item key={grade} xs={6} sm={4} md={2}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">
                    {grade}
                  </Typography>
                  <Typography variant="h4" align="center">
                    {count}
                  </Typography>
                  <Typography variant="caption" align="center" display="block">
                    subjects
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default NewStudentResultReport;
