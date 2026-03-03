# Universal Archive Management System – Backend

Node.js + Express API for the Universal Archive Management System. Handles authentication, file uploads, audit logging, and dashboard stats.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT, bcryptjs
- **Uploads**: Multer
- **Security**: Helmet, express-rate-limit, CORS
- **Validation**: Joi
- **Logging**: Morgan

## Project Structure

```
backend/
├── config/          # Database, environment
├── controllers/     # auth, file, audit, dashboard
├── middleware/     # auth, errorHandler, validate, notFound
├── models/         # User, File, AuditLog, FileVersion
├── routes/         # auth, files, audit, dashboard
├── services/       # auth, file, audit
├── uploads/        # Stored file uploads
├── utils/          # logger, apiResponse, generateFileId
├── validators/     # Joi schemas
├── tests/          # Jest + Supertest
├── server.js
├── .env.example
└── README.md       # This file
```

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment

Copy `.env.example` to `.env` and set:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/universal-archive
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
UPLOAD_MAX_SIZE=10485760
CORS_ORIGIN=http://localhost:5173
```

- **MONGODB_URI**: Local MongoDB or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string.
- **JWT_SECRET**: Use a long random string in production (e.g. `openssl rand -hex 32`).
- **CORS_ORIGIN**: Frontend origin(s), comma-separated (e.g. `http://localhost:5173,https://your-app.vercel.app`).

### 3. Run

**Development (with watch):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Server runs at `http://localhost:5000` (or your `PORT`).

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/files` | Bearer | Upload file (multipart) |
| GET | `/api/files` | Bearer | List files (pagination, status, sort, search) |
| GET | `/api/files/:id` | Bearer | Get file by ARC id |
| PUT | `/api/files/:id` | Bearer | Update file metadata |
| DELETE | `/api/files/:id` | Admin | Delete file |
| GET | `/api/files/:id/versions` | Bearer | Version history |
| GET | `/api/dashboard/stats` | Bearer | Dashboard stats |
| GET | `/api/audit` | Admin | Audit logs |

All JSON responses use: `{ success, message, data? }`.

## Testing

Requires MongoDB (local or set `MONGODB_URI`).

```bash
npm test
```

Runs Jest tests in `tests/` (auth and files).

## Docker

```bash
docker build -t uams-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI="your-uri" \
  -e JWT_SECRET="your-secret" \
  -e CORS_ORIGIN="https://your-frontend.vercel.app" \
  uams-backend
```

## File ID Format

Generated IDs: **ARC-YYYY-XXXXXX** (e.g. `ARC-2025-000001`). YYYY = year, XXXXXX = 6-digit sequence per year.

## License

MIT.
