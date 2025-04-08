#!/bin/bash

# This script verifies that the frontend build files exist in the expected location

# Check if the frontend build directory exists
if [ -d "frontend/school-frontend-app/build" ]; then
  echo "Frontend build directory exists"
  ls -la frontend/school-frontend-app/build
  
  # Check if index.html exists
  if [ -f "frontend/school-frontend-app/build/index.html" ]; then
    echo "index.html exists"
  else
    echo "ERROR: index.html does not exist!"
    exit 1
  fi
else
  echo "ERROR: Frontend build directory does not exist!"
  exit 1
fi

echo "Verification completed successfully!"
