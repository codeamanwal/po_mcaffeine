# Architecture Overview

## Technology Stack

- **Frontend**: Next.js (React)
  - UI Library: Tailwind CSS, Shadcn UI
  - State Management: Zustand (`useUserStore`)
  - HTTP Client: Axios
- **Backend**: Node.js with Express
  - ORM: Sequelize
  - Database: MySQL (configured in `src/db/mysql.js`)
  - Authentication: JWT

## Directory Structure

### Root

- `/frontend`: Next.js application source.
- `/backend`: Node.js API server source.
- `/docs`: Project documentation.
- `ecosystem.config.js`: PM2 configuration for process management in EC2.

### Backend Structure (`/backend/src`)

- `controllers/`: Request handlers containing business logic.
- `models/`: Sequelize data models (User, ShipmentOrder, SkuOrder, Logs, MasterSheets, etc.).
- `routes/`: API route definitions mapping URLs to controllers.
- `middleware/`: Auth middleware (JWT verification) and Role-based access control.
- `db/`: Database connection setup.
- `utils/`: Helper functions.

### Frontend Structure (`/frontend/src`)

- `app/`: Next.js App Router pages.
- `components/`: Reusable UI components.
- `constants/`: App-wide constants (URLs, data types).
- `lib/`: Utility libraries (API wrappers like `order.js`, `user.js`).
- `hooks/`: Custom React hooks (e.g., `useAxios -> api`).

## Environment Configuration

### Backend (`backend/.env`)

| Variable                  | Description                                        |
| :------------------------ | :------------------------------------------------- |
| `PORT`                  | The port the server listens on (e.g.`8000`).     |
| `JWT_SECRET`            | Secret key for signing JWT tokens.                 |
| `DB_CONNECTION_STRING`  | Database connection URL (MySQL).                   |
| `EMAIL`                 | Email address for sending notifications/passwords. |
| `APP_PASSWORD`          | App password for the email service.                |
| `AWS_ACCESS_KEY_ID`     | AWS Credentials for S3 access.                     |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key for S3 access.                      |
| `S3_BUCKET_NAME`        | Name of the S3 bucket for file uploads.            |
| `S3_REGION_NAME`        | AWS Region of the S3 bucket.                       |

### Frontend (`frontend/.env.local`)

| Variable                       | Description                                             |
| :----------------------------- | :------------------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL`   | URL of the backend API (e.g.`http://localhost:8000`). |
| `NEXT_PUBLIC_S3_BUCKET_NAME` | Name of the S3 bucket (for public access references).   |
| `NEXT_PUBLIC_S3_REGION_NAME` | Region of the S3 bucket.                                |

## Deployment

The application is configured to run with **PM2**.

- **Config File**: `ecosystem.config.js`
- **Commands**:
  - Start: `pm2 start ecosystem.config.js`
  - Restart: `pm2 restart ecosystem.config.js`
