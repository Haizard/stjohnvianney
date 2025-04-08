/**
 * Script to test the deployment
 */
require('dotenv').config();
const axios = require('axios');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:5000';

async function testHealthEndpoint() {
  console.log(`Testing health endpoint at ${API_URL}/api/health`);
  
  try {
    const response = await axios.get(`${API_URL}/api/health`);
    console.log('Health check successful!');
    console.log('Status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('Health check failed!');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. The server might be down.');
    } else {
      console.error('Error message:', error.message);
    }
    return false;
  }
}

async function main() {
  console.log(`Testing deployment at ${API_URL}...`);
  
  // Test health endpoint
  const healthCheckPassed = await testHealthEndpoint();
  
  if (healthCheckPassed) {
    console.log('\nDeployment test passed! The server is up and running.');
  } else {
    console.error('\nDeployment test failed! Please check your server logs.');
  }
}

// Run the tests
main().catch(error => {
  console.error('Unhandled error:', error);
});
