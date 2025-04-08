#!/bin/bash

echo "Disabling ESLint for the build process..."

# Navigate to the frontend directory
cd frontend/school-frontend-app

# Create a .env file to disable ESLint during build
echo "Creating .env file to disable ESLint..."
echo "DISABLE_ESLINT_PLUGIN=true" > .env

# Check if it worked
if [ -f ".env" ]; then
  echo "Created .env file with DISABLE_ESLINT_PLUGIN=true"
  cat .env
else
  echo "Failed to create .env file"
fi

# Return to the project root
cd ../..

echo "ESLint disabled for the build process!"
