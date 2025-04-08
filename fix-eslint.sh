#!/bin/bash

echo "Fixing ESLint configuration..."

# Navigate to the frontend directory
cd frontend/school-frontend-app

# Install the missing ESLint plugin
echo "Installing eslint-plugin-react-hooks..."
npm install eslint-plugin-react-hooks --save-dev

# Check if .eslintrc.js exists
if [ -f ".eslintrc.js" ]; then
  echo ".eslintrc.js exists, creating a backup..."
  cp .eslintrc.js .eslintrc.js.backup
  
  # Create a simplified .eslintrc.js file
  echo "Creating simplified .eslintrc.js..."
  cat > .eslintrc.js << 'EOL'
module.exports = {
  extends: ['react-app', 'react-app/jest'],
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
EOL
  
  echo "Created simplified .eslintrc.js"
else
  echo ".eslintrc.js does not exist, creating it..."
  
  # Create a new .eslintrc.js file
  cat > .eslintrc.js << 'EOL'
module.exports = {
  extends: ['react-app', 'react-app/jest'],
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
EOL
  
  echo "Created new .eslintrc.js"
fi

# Return to the project root
cd ../..

echo "ESLint configuration fixed successfully!"
