/**
 * Script to help with deployment setup on Render
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('Setting up environment for Render deployment...');

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);

// Check for required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  console.error('Please set these variables in your environment or .env file');
} else {
  console.log('All required environment variables are set');
}

// Create build directory for frontend if it doesn't exist
const buildDir = path.join(__dirname, '../frontend/school-frontend-app/build');
if (!fs.existsSync(buildDir)) {
  console.log('Frontend build directory does not exist. You need to build the frontend first.');
  console.log('Run: cd frontend/school-frontend-app && npm run build');
} else {
  console.log('Frontend build directory exists');
}

// Check if the backend can connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  mongoose.connection.close();
})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
});

console.log('\nSetup check completed. If all checks passed, you should be ready to deploy to Render.');
console.log('Make sure to set all required environment variables in the Render dashboard.');
