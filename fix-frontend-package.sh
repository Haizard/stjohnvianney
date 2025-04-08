#!/bin/bash

echo "Fixing frontend package.json..."

# Navigate to the frontend directory
cd frontend/school-frontend-app

# Create a backup of package.json
cp package.json package.json.backup

# Use sed to remove the eslint-plugin-react-hooks dependency
# This is a bit complex because we need to handle the case where it's the only dependency
# or the last dependency in the list

# Check if package.json exists
if [ -f "package.json" ]; then
  echo "Modifying package.json to remove eslint-plugin-react-hooks dependency..."
  
  # Create a temporary file without the eslint-plugin-react-hooks dependency
  cat package.json | sed 's/"eslint-plugin-react-hooks": "[^"]*"[,]*//' > package.json.tmp
  
  # Move the temporary file to package.json
  mv package.json.tmp package.json
  
  echo "Modified package.json"
else
  echo "package.json does not exist!"
  exit 1
fi

# Return to the project root
cd ../..

echo "Frontend package.json fixed successfully!"
