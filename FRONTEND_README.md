# Universal Archive Management System – Frontend

React + TypeScript frontend for the Universal Archive Management System. Connects to the backend API for auth, file management, dashboard, and audit.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build**: Vite
- **Routing**: React Router v7
- **HTTP**: Axios
- **UI**: Tailwind CSS v4, Radix UI, Lucide icons, Recharts
- **Forms**: React Hook Form
- **Notifications**: Sonner (toast)
- **Testing**: Vitest, React Testing Library

## Project Structure

```
src/
├── app/
│   ├── components/     # Pages and shared UI
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx, RegisterPage.tsx
│   │   ├── DashboardPage.tsx, UploadPage.tsx
│   │   ├── SearchPage.tsx, MyFilesPage.tsx
│   │   ├── SystemOverviewPage.tsx, AuditPage.tsx
│   │   ├── ProtectedRoute.tsx, ErrorBoundary.tsx
│   │   ├── Navigation.tsx
│   │   └── ui/         # Radix-based components
│   ├── context/        # AuthContext
│   ├── services/       # api.ts (Axios + API helpers)
│   └── utils/          # storage helpers (optional)
├── styles/             # Global CSS, Tailwind, theme
├── test/               # Vitest setup
└── main.tsx
```

## Setup

### 1. Install dependencies

From the **project root** (where this README lives):

```bash
npm install
```

### 2. Environment

Optional. Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

If unset, the app uses `http://localhost:5000/api` by default.

### 3. Run

**Development:**

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173). Ensure the backend is running so login and file operations work.

**Production build:**

```bash
npm run build
```

Output is in `dist/`. Serve with any static host (e.g. Vercel, Netlify).

## Main Features

- **Auth**: Login and Register pages; JWT stored in localStorage; Axios interceptor adds `Authorization` and handles 401 (logout).
- **Protected routes**: Dashboard, Upload, Search, My Files require login; Audit requires admin.
- **Dashboard**: Fetches `/api/dashboard/stats` (storage, file types, recent uploads, expiring soon).
- **Upload**: `POST /api/files` with `FormData` (file + retention_years, building, room). File ID format ARC-YYYY-XXXXXX.
- **My Files**: Paginated list from `/api/files` with filters, sort, and search; delete only for admin.
- **Search**: Search by ARC id or name via `/api/files` and `/api/files/:id`.
- **System Overview**: Static system overview (no API).
- **Audit**: Admin-only page showing `/api/audit` logs.

## Testing

```bash
npm test
```

Runs Vitest (e.g. Login page tests). For watch mode:

```bash
npm run test:watch
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

## License

MIT.
