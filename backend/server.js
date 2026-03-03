import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { runPeriodicFileStatusCheck } from './services/fileService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await connectDB();

const app = express();

// Helmet: disable crossOriginEmbedderPolicy to avoid 403 on API requests from frontend
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);
// CORS: in dev allow any localhost port (5173, 5174, 5175, etc.); in prod use env list
const allowedOriginList = env.CORS_ORIGIN.split(',').map((o) => o.trim());
const isLocalhost = (o) => /^http:\/\/localhost(:\d+)?$/.test(o);
app.use(
  cors({
      origin: true,
      credentials: true,
  })
);
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    message: { success: false, message: 'Too many requests. Please try again later.' },
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

// Periodic file status check: run on startup and on an interval (Active / Expiring Soon / Expired)
app.listen(env.PORT, async () => {
  console.log('');
  console.log('  ✓ Backend is connected and listening');
  console.log(`    Port: ${env.PORT}`);
  console.log(`    Env:  ${env.NODE_ENV}`);
  console.log(`    API:  http://localhost:${env.PORT}/api`);
  console.log('');

  try {
    await runPeriodicFileStatusCheck();
  } catch (err) {
    console.error('  Periodic file check (startup):', err.message);
  }
  setInterval(async () => {
    try {
      await runPeriodicFileStatusCheck();
    } catch (err) {
      console.error('Periodic file check:', err.message);
    }
  }, env.FILE_CHECK_INTERVAL_MS);
});
