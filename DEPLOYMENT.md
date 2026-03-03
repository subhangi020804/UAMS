# Deployment Guide – Universal Archive Management System

This guide covers deploying the **Universal Archive Management System** (UAMS) for internship, placement, or production use.

## Architecture

- **Frontend**: React + Vite (static build) → deploy to **Vercel**
- **Backend**: Node.js + Express → deploy to **Render** (or any Node host)
- **Database**: **MongoDB Atlas** (cloud)

---

## 1. MongoDB Atlas

1. Create an account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster (free tier is fine).
3. Under **Database Access**, add a database user (username + password). Note the password.
4. Under **Network Access**, add `0.0.0.0/0` to allow connections from Render and your IP (or restrict to Render IPs if known).
5. Click **Connect** on the cluster → **Connect your application** → copy the connection string. It looks like:
   ```text
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your user password and set `<dbname>` to e.g. `universal-archive`.

---

## 2. Backend (Render)

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) and sign in with GitHub.
3. **New** → **Web Service**.
4. Connect the repo and set:
   - **Root Directory**: `backend` (if the backend lives in a `backend` folder).
   - **Runtime**: Node.
   - **Build Command**: `npm install`.
   - **Start Command**: `node server.js` or `npm start`.
5. Under **Environment** add:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random string (e.g. from `openssl rand -hex 32`)
   - `CORS_ORIGIN` = your frontend URL (e.g. `https://your-app.vercel.app`)
   - Optional: `PORT` (Render sets this automatically)
6. Deploy. Note the backend URL (e.g. `https://your-backend.onrender.com`).

---

## 3. Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo.
2. Set **Root Directory** to the project root (where the frontend lives).
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist` (Vite default)
5. Under **Environment Variables** add:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api` (your Render backend URL + `/api`)
6. Deploy. Vercel will give you a URL like `https://your-app.vercel.app`.

---

## 4. Post-deploy checks

1. **CORS**: Backend `CORS_ORIGIN` must include the exact Vercel URL (and optionally `http://localhost:5173` for local dev).
2. **API**: Open `https://your-app.vercel.app`, register a user, log in, and try uploading a file. If requests fail, check browser Network tab and backend logs on Render.
3. **MongoDB**: In Atlas, check **Collections** to see users and files after signup and upload.

---

## 5. Docker (optional – backend only)

From the **project root**:

```bash
cd backend
docker build -t uams-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI="your-atlas-uri" \
  -e JWT_SECRET="your-secret" \
  -e CORS_ORIGIN="https://your-frontend.vercel.app" \
  uams-backend
```

Use the same env vars as in Render. For production, run behind a reverse proxy (e.g. Nginx) and use HTTPS.

---

## 6. First admin user

The app does not create an admin by default. To get an admin:

**Option A – MongoDB Atlas UI**

1. In Atlas, open your cluster → **Collections** → `users`.
2. Add a document (or edit an existing user) and set `role: "admin"`.

**Option B – Seed script (you can add one)**

Create `backend/scripts/seedAdmin.js` that connects to MongoDB, finds a user by email, and sets `role: 'admin'`, then run it once locally with `MONGODB_URI` pointing to your Atlas DB.

---

## 7. Security checklist

- Use strong `JWT_SECRET` and never commit it.
- Keep MongoDB credentials only in env vars (Render/Atlas).
- In production, set `CORS_ORIGIN` to your real frontend origin(s) only.
- Rely on Helmet and rate limiting already configured in the backend.
- For production file storage, consider moving uploads to cloud storage (e.g. S3) and storing only URLs in MongoDB.

---

## 8. CI/CD (GitHub Actions)

A workflow file is provided at `.github/workflows/ci.yml`. It runs backend tests and frontend build on push/PR. Adjust the `backend` path and Node version if your repo layout differs.

---

## Summary

| Component   | Where       | Env / Config |
|------------|-------------|--------------|
| MongoDB    | Atlas       | Connection string → `MONGODB_URI` |
| Backend API | Render     | `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN` |
| Frontend   | Vercel      | `VITE_API_URL` = backend URL + `/api` |

After deployment, share the Vercel URL as the app URL and the Render URL as the API base for any integration or grading.
