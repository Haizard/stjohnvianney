#!/bin/bash

echo "Copying frontend build files to the expected location..."

# Check if the source build directory exists
if [ -d "frontend/school-frontend-app/build" ] && [ -f "frontend/school-frontend-app/build/index.html" ]; then
  echo "Source build directory exists and contains index.html"
  
  # Create a backup of the build directory
  echo "Creating backup of build directory..."
  mkdir -p frontend-build-backup
  cp -r frontend/school-frontend-app/build/* frontend-build-backup/
  
  echo "Backup created successfully"
  ls -la frontend-build-backup/
else
  echo "Source build directory does not exist or is missing index.html"
  
  # Check if we have a backup
  if [ -d "frontend-build-backup" ] && [ -f "frontend-build-backup/index.html" ]; then
    echo "Found backup build directory, restoring..."
    mkdir -p frontend/school-frontend-app/build
    cp -r frontend-build-backup/* frontend/school-frontend-app/build/
    echo "Backup restored successfully"
  else
    echo "No backup found, attempting to build frontend..."
    bash ./build-frontend.sh
  fi
fi

# Final verification
if [ -d "frontend/school-frontend-app/build" ] && [ -f "frontend/school-frontend-app/build/index.html" ]; then
  echo "Frontend build files are now in the expected location"
  ls -la frontend/school-frontend-app/build/
else
  echo "ERROR: Failed to ensure frontend build files are in the expected location"
  exit 1
fi

echo "Copy operation completed successfully!"
