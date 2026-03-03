# Universal Archive Management System

Enterprise-grade digital archive platform built with the **MERN** stack (MongoDB, Express, React, Node.js). Suitable for internships, placements, and production deployment.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Stack](https://img.shields.io/badge/Stack-MERN-2e7d32.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## Features

- **Authentication & authorization**: JWT-based auth with role-based access (admin, manager, user)
- **File management**: Upload, list, search, update, and delete (admin) with unique IDs in format **ARC-YYYY-XXXXXX**
- **All file types**: PDF, DOCX, XLSX, CSV, images, and more
- **Dashboard**: Storage usage, file type distribution, recent uploads, expiring-soon alerts
- **Audit trail**: Logs for upload, delete, update, login, role change (IP and timestamp)
- **Version history**: Metadata revision history for files (admin)
- **Security**: Helmet, rate limiting, CORS, validation (Joi), bcrypt, secure env config
- **UI**: Responsive sidebar-style layout, dark theme, toasts, protected routes

---

## Tech Stack

| Layer     | Technologies |
|----------|----------------|
| Frontend  | React 18, TypeScript, Vite, React Router, Axios, Tailwind CSS, Radix UI, Recharts |
| Backend   | Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Multer, Helmet, express-rate-limit, Joi, Morgan |
| Database  | MongoDB (MongoDB Atlas compatible) |
| Testing   | Jest + Supertest (backend), Vitest + React Testing Library (frontend) |

---

## Project Structure

```
├── backend/                 # Express API
│   ├── config/             # DB, env
│   ├── controllers/
│   ├── middleware/          # auth, errorHandler, validate
│   ├── models/              # User, File, AuditLog, FileVersion
│   ├── routes/
│   ├── services/
│   ├── uploads/             # Stored files
│   ├── utils/
│   ├── validators/
│   ├── tests/
│   ├── server.js
│   └── .env.example
├── src/
│   ├── app/
│   │   ├── components/      # Pages, UI, ErrorBoundary, ProtectedRoute
│   │   ├── context/         # AuthContext
│   │   ├── services/        # api.ts (Axios)
│   │   └── utils/
│   └── styles/
├── .env.example             # Frontend env
├── DEPLOYMENT.md            # Render, Vercel, MongoDB Atlas
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone and install

```bash
git clone <repo-url>
cd GLP  # or your folder name
npm install
cd backend && npm install && cd ..
```

### 2. Environment

**Backend** – copy `backend/.env.example` to `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/universal-archive
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

**Frontend** – optional: create `.env` in project root:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run

**Terminal 1 – backend**

```bash
cd backend
node server.js
# or: npm run dev
```

**Terminal 2 – frontend**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Register a user, log in, and use Dashboard, Upload, Search, and My Files.

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST   | `/api/auth/register` | No  | Register |
| POST   | `/api/auth/login`    | No  | Login |
| POST   | `/api/files`         | Yes | Upload file |
| GET    | `/api/files`         | Yes | List files (pagination, filters) |
| GET    | `/api/files/:id`     | Yes | Get file by ARC id |
| PUT    | `/api/files/:id`     | Yes | Update metadata |
| DELETE | `/api/files/:id`     | Admin | Delete file |
| GET    | `/api/files/:id/versions` | Yes | Version history |
| GET    | `/api/dashboard/stats`   | Yes | Dashboard stats |
| GET    | `/api/audit`         | Admin | Audit logs |

Response format: `{ success, message, data? }`.

---

## Testing

**Backend** (requires MongoDB):

```bash
cd backend
npm test
```

**Frontend**:

```bash
npm test
```

---

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for:

- MongoDB Atlas setup
- Backend on **Render**
- Frontend on **Vercel**
- Docker (backend)
- First admin user and security notes

---

## File ID Format

All archived files use a unique ID: **ARC-YYYY-XXXXXX**

- **ARC** – archive prefix  
- **YYYY** – year  
- **XXXXXX** – 6-digit sequence per year  

Example: `ARC-2025-000001`.

---

## License

MIT.

---

**Universal Archive Management System** – Secure • Traceable • Retention controlled.
# UAMS
