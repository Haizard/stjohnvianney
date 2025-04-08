import axios from 'axios';
import { normalizeApiResponse } from './dataNormalizer';

/**
 * Create a new axios instance with interceptors to normalize responses
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to normalize data
api.interceptors.response.use(
  (response) => {
    // Normalize the response data
    const normalizedResponse = {
      ...response,
      data: normalizeApiResponse(response.data),
    };
    return normalizedResponse;
  },
  (error) => {
    // Return the error as is
    return Promise.reject(error);
  }
);

/**
 * Get a student result report
 * @param {string} studentId - The student ID
 * @param {string} examId - The exam ID
 * @returns {Promise<Object>} - The normalized student result report
 */
export const getStudentResultReport = async (studentId, examId) => {
  try {
    const response = await api.get(`/results/report/student/${studentId}/${examId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student result report:', error);
    throw error;
  }
};

/**
 * Get a class result report
 * @param {string} classId - The class ID
 * @param {string} examId - The exam ID
 * @returns {Promise<Object>} - The normalized class result report
 */
export const getClassResultReport = async (classId, examId) => {
  try {
    const response = await api.get(`/results/report/class/${classId}/${examId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class result report:', error);
    throw error;
  }
};

export default {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
  patch: api.patch,
  getStudentResultReport,
  getClassResultReport,
};
