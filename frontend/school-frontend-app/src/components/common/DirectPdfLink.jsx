import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

/**
 * A component that provides a reliable PDF download by opening a dedicated HTML page
 * This approach works in all browsers and environments
 */
const DirectPdfLink = ({ 
  type, // 'student' or 'class'
  studentId,
  classId,
  examId,
  label,
  fullWidth = false,
  variant = 'contained',
  color = 'primary',
  disabled = false
}) => {
  const handleDownload = () => {
    // Get the authentication token
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to download the PDF');
      return;
    }
    
    // Validate required parameters
    if (type === 'student' && !studentId) {
      alert('Student ID is required');
      return;
    }
    
    if (type === 'class' && !classId) {
      alert('Class ID is required');
      return;
    }
    
    if (!examId) {
      alert('Exam ID is required');
      return;
    }
    
    // Determine the correct ID based on type
    const id = type === 'student' ? studentId : classId;
    
    // Create the URL to the direct PDF page with parameters
    const params = new URLSearchParams();
    params.append('type', type);
    params.append('id', id);
    params.append('examId', examId);
    params.append('token', token);
    
    const directPdfUrl = `/direct-pdf.html?${params.toString()}`;
    
    // Open the direct PDF page in a new tab
    window.open(directPdfUrl, '_blank');
  };
  
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
      fullWidth={fullWidth}
      disabled={disabled}
    >
      {label || `Download ${type === 'student' ? 'Student' : 'Class'} Report`}
    </Button>
  );
};

DirectPdfLink.propTypes = {
  type: PropTypes.oneOf(['student', 'class']).isRequired,
  studentId: PropTypes.string,
  classId: PropTypes.string,
  examId: PropTypes.string.isRequired,
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
  variant: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool
};

DirectPdfLink.defaultProps = {
  studentId: '',
  classId: '',
  label: '',
  fullWidth: false,
  variant: 'contained',
  color: 'primary',
  disabled: false
};

export default DirectPdfLink;
