#!/bin/bash

# Verify that the frontend build files exist
if [ ! -d "frontend/school-frontend-app/build" ] || [ ! -f "frontend/school-frontend-app/build/index.html" ]; then
  echo "ERROR: Frontend build files are missing!"
  echo "Current directory: $(pwd)"
  echo "Listing directories:"
  ls -la
  echo "Listing frontend directory:"
  ls -la frontend/
  echo "Listing frontend/school-frontend-app directory:"
  ls -la frontend/school-frontend-app/

  # Try to build the frontend if it's missing
  echo "Attempting to build the frontend..."
  bash ./build-frontend.sh

  # Check again after attempting to build
  if [ ! -d "frontend/school-frontend-app/build" ] || [ ! -f "frontend/school-frontend-app/build/index.html" ]; then
    echo "ERROR: Failed to build the frontend!"
  else
    echo "Successfully built the frontend."
  fi
fi

# Start the backend server
cd backend
node server.js
