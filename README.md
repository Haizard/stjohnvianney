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

### Backend Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - **Name**: st-john-vianey-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose an appropriate plan (Free for testing)
   - **Advanced**: Add the environment variables from your `.env` file

### Frontend Deployment

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Use the following settings:
   - **Name**: st-john-vianey-frontend
   - **Build Command**: `cd frontend/school-frontend-app && npm install && npm run build`
   - **Publish Directory**: `frontend/school-frontend-app/build`
   - **Advanced**: Set environment variable `REACT_APP_API_URL` to your backend URL

## License

[MIT](LICENSE)
#   s t j o h n v i a n n e y  
 