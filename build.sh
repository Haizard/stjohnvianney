#!/bin/bash

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies and build
echo "Installing frontend dependencies and building..."
cd frontend/school-frontend-app
npm install
npm run build
cd ../..

echo "Build completed successfully!"
