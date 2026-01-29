# PO Management System (PO-CMS)

## Prerequisites

- Node.js (v18 or v18+)
- MySQL Database

## Project Structure

- backend/: Node.js Express API server
- frontend/: Next.js client application
- docs/: Detailed project documentation (API, Architecture, Workflows)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   cd backend

2. Install dependencies:
   npm install

3. Environment Configuration:
   Create a .env file in the backend directory with the following variables:
   ```
   PORT=8000
   JWT_SECRET=your_jwt_secret
   DB_CONNECTION_STRING=mysql://user:password@host:port/database_name
   EMAIL=admin.cms@mcaffeine.com
   APP_PASSWORD=your_email_app_password
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   S3_BUCKET_NAME=your_bucket_name
   S3_REGION_NAME=your_aws_region
   ```

4. Run the server:
   Development: npm run dev
   Production: npm start

   The server will start on port 8000 (or as specified in .env).

### Frontend Setup

1. Navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Environment Configuration:
   Create a .env.local file in the frontend directory:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_S3_BUCKET_NAME=your_bucket_name
   NEXT_PUBLIC_S3_REGION_NAME=your_aws_region
   ```

4. Run the application:
   npm run dev

   The application will be available at http://localhost:3000.

## Documentation

For more detailed information, please refer to the documentation in the docs/ directory:

- Architecture Overview: docs/ARCHITECTURE.md
- API Reference: docs/API_REFERENCE.md
- Workflows: docs/WORKFLOWS.md
- Postman Collection: docs/POSTMAN_COLLECTION.json

## Deployment

The project is configured for deployment using PM2.

- Start all services:
  pm2 start ecosystem.config.js

- Restart all services:
  pm2 restart ecosystem.config.js

- View logs:
  pm2 logs
