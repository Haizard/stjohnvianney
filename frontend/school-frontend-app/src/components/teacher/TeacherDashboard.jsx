import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardGrid from '../DashboardGrid';

const TeacherDashboard = () => {
  const dashboardItems = [
    {
      title: 'My Classes',
      description: 'View assigned classes',
      link: '/teacher/my-subjects'
    },
    {
      title: 'My Students',
      description: 'View all your students',
      link: '/teacher/my-students'
    },
    {
      title: 'Enter Marks',
      description: 'Record student marks',
      link: '/teacher/marks-entry'
    },
    {
      title: 'View Results',
      description: 'Check student results',
      link: '/teacher/results'
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Teacher Dashboard
      </Typography>
      <DashboardGrid items={dashboardItems} />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <Typography variant="body1">
          Welcome to your teacher dashboard. Here you can manage your classes, grades, and student progress.
        </Typography>
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
