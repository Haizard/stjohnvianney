#!/bin/bash

echo "Creating a minimal frontend..."

# Create the build directory
mkdir -p frontend/school-frontend-app/build

# Create a simple index.html file
cat > frontend/school-frontend-app/build/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>St. John Vianney School Management System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .card {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-right: 10px;
        }
        footer {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <header>
        <h1>St. John Vianney School Management System</h1>
    </header>
    
    <div class="card">
        <h2>Welcome to the School Management System</h2>
        <p>This is a temporary static page. The full application is being built.</p>
        <p>You can access the API endpoints directly:</p>
        <p>
            <a href="/api/health" class="button">API Health Check</a>
            <a href="/api/users" class="button">Users API</a>
            <a href="/api/students" class="button">Students API</a>
        </p>
    </div>
    
    <div class="card">
        <h2>API Documentation</h2>
        <p>The following API endpoints are available:</p>
        <ul>
            <li><strong>/api/health</strong> - Check if the API is running</li>
            <li><strong>/api/users</strong> - User management</li>
            <li><strong>/api/teachers</strong> - Teacher management</li>
            <li><strong>/api/students</strong> - Student management</li>
            <li><strong>/api/classes</strong> - Class management</li>
            <li><strong>/api/subjects</strong> - Subject management</li>
            <li><strong>/api/exams</strong> - Exam management</li>
            <li><strong>/api/results</strong> - Result management</li>
        </ul>
    </div>
    
    <footer>
        <p>&copy; 2025 St. John Vianney School. All rights reserved.</p>
    </footer>
</body>
</html>
EOL

echo "Minimal frontend created successfully!"
ls -la frontend/school-frontend-app/build/
