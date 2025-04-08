#!/bin/bash

echo "Creating public directory with placeholder index.html..."

# Create the public directory if it doesn't exist
mkdir -p public

# Create a simple index.html file
cat > public/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>St. John Vianney School Management System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
            flex-direction: column;
        }
        .container {
            max-width: 800px;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #2c3e50;
        }
        p {
            color: #7f8c8d;
            line-height: 1.6;
        }
        .loading {
            margin-top: 20px;
            display: flex;
            justify-content: center;
        }
        .loading-spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #3498db;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>St. John Vianney School Management System</h1>
        <p>The application is loading. Please wait...</p>
        <div class="loading">
            <div class="loading-spinner"></div>
        </div>
        <p>If the application doesn't load automatically, please try refreshing the page.</p>
        <a href="/" class="button">Refresh</a>
    </div>

    <script>
        // Check if the frontend is ready every 5 seconds
        function checkFrontend() {
            fetch('/api/health')
                .then(response => {
                    if (response.ok) {
                        console.log('Backend is ready, refreshing page...');
                        window.location.reload();
                    } else {
                        console.log('Backend not ready yet, waiting...');
                        setTimeout(checkFrontend, 5000);
                    }
                })
                .catch(error => {
                    console.error('Error checking backend:', error);
                    setTimeout(checkFrontend, 5000);
                });
        }

        // Start checking after 5 seconds
        setTimeout(checkFrontend, 5000);
    </script>
</body>
</html>
EOL

echo "Created public/index.html"
ls -la public/

# Create a simple style.css file
cat > public/style.css << 'EOL'
/* Basic styles for the placeholder page */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}
EOL

echo "Created public/style.css"

echo "Public directory created successfully!"
