# St. John Vianey School Management System

A comprehensive school management system for St. John Vianey School.

## Features

- Student management
- Teacher management
- Class management
- Exam and result management
- Financial management
- SMS notifications
- Reports and analytics

## Tech Stack

- **Frontend**: React, Material UI
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd st-john-vianey
   ```

2. Install dependencies

   ```bash
   npm run install:all
   ```

3. Set up environment variables
   - Create a `.env` file in the backend directory based on `.env.example`

4. Run the application in development mode

   ```bash
   npm run dev
   ```

## Deployment on Render

### Deployment Steps

1. Create a Render account at [https://render.com](https://render.com)
2. Connect your GitHub repository to Render
3. Create a new Web Service with the following settings:
   - **Name**: st-john-vianey-api
   - **Environment**: Node
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm run render-start`
   - **Plan**: Choose an appropriate plan (Free for testing)

4. Set up the required environment variables in the Render dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `JWT_REFRESH_SECRET`: Another secure random string for refresh tokens
   - `NODE_ENV`: Set to `production`
   - `PORT`: Set to `10000` or any port Render assigns
   - Other variables as needed from `backend/.env.production`

5. For the frontend, you can either:
   - Deploy it separately on Render as a Static Site
   - Or deploy it on Netlify, Vercel, or GitHub Pages

### Frontend Deployment on Render

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Use the following settings:
   - **Name**: st-john-vianey-frontend
   - **Build Command**: `cd frontend/school-frontend-app && npm install && npm run build`
   - **Publish Directory**: `frontend/school-frontend-app/build`
   - **Environment Variable**: Set `REACT_APP_API_URL` to your backend URL (e.g., `https://st-john-vianey-api.onrender.com`)

### Troubleshooting Deployment

If you encounter issues during deployment:

1. Check the Render logs for error messages
2. Make sure all required environment variables are set
3. Verify that the build and start scripts are working correctly
4. Try running the build process locally to identify any issues

```bash
# Test the build process locally
npm run render-build

# Test the backend server locally
npm run render-start
```

### Testing Your Deployment

After deployment, you can test if everything is working correctly:

```bash
# Set the API_URL environment variable to your deployed backend URL
API_URL=https://your-backend-api.onrender.com node scripts/testDeployment.js
```

## License

[MIT](LICENSE)
