#!/bin/bash

echo "Creating a static site as a fallback..."

# Create the directory structure
mkdir -p frontend/school-frontend-app/build/static/css
mkdir -p frontend/school-frontend-app/build/static/js

# Create a simple index.html file
cat > frontend/school-frontend-app/build/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>St. John Vianney School Management System</title>
    <link rel="stylesheet" href="/static/css/main.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>St. John Vianney School Management System</h1>
        </header>
        
        <main>
            <div class="card">
                <h2>Welcome to the School Management System</h2>
                <p>This is a static version of the site. The full application is currently being built.</p>
                <p>Please check back later or contact the administrator for assistance.</p>
                
                <div class="buttons">
                    <a href="/api/health" class="button">Check API Status</a>
                    <a href="/" class="button">Refresh Page</a>
                </div>
            </div>
            
            <div class="features">
                <div class="feature">
                    <h3>Student Management</h3>
                    <p>Manage student records, attendance, and performance.</p>
                </div>
                
                <div class="feature">
                    <h3>Teacher Management</h3>
                    <p>Manage teacher profiles, assignments, and schedules.</p>
                </div>
                
                <div class="feature">
                    <h3>Academic Management</h3>
                    <p>Manage classes, subjects, exams, and results.</p>
                </div>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2025 St. John Vianney School. All rights reserved.</p>
        </footer>
    </div>
    
    <script src="/static/js/main.js"></script>
</body>
</html>
EOL

# Create a simple CSS file
cat > frontend/school-frontend-app/build/static/css/main.css << 'EOL'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}

.container {
    max-width: 1200px;
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
    text-align: center;
}

.buttons {
    margin-top: 20px;
}

.button {
    display: inline-block;
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    margin: 0 10px;
    transition: background-color 0.3s;
}

.button:hover {
    background-color: #2980b9;
}

.features {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
}

.feature {
    flex: 1;
    min-width: 300px;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

footer {
    text-align: center;
    padding: 20px;
    background-color: #2c3e50;
    color: white;
    border-radius: 5px;
}

@media (max-width: 768px) {
    .features {
        flex-direction: column;
    }
}
EOL

# Create a simple JavaScript file
cat > frontend/school-frontend-app/build/static/js/main.js << 'EOL'
// Check if the API is available
function checkApiStatus() {
    fetch('/api/health')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('API not available');
        })
        .then(data => {
            console.log('API Status:', data);
            document.querySelector('.card').innerHTML += '<p class="status-message success">API is available!</p>';
        })
        .catch(error => {
            console.error('Error checking API status:', error);
            document.querySelector('.card').innerHTML += '<p class="status-message error">API is not available. Please try again later.</p>';
        });
}

// Add event listener for when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Static site loaded');
    
    // Check API status after a short delay
    setTimeout(checkApiStatus, 2000);
});
EOL

echo "Static site created successfully!"
ls -la frontend/school-frontend-app/build/
