import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes.js';
import fileRoutes from '../routes/fileRoutes.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { connectDB } from '../config/db.js';
import { File } from '../models/File.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/universal-archive-test';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use(errorHandler);

let authToken;
let testUserId;

describe('Files API', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'File Test User',
        email: `filetest-${Date.now()}@example.com`,
        password: 'Password1',
      });
    authToken = registerRes.body.data?.token;
    testUserId = registerRes.body.data?.user?.id;
  });

  afterAll(async () => {
    await File.deleteMany({ uploaded_by: testUserId });
    await User.deleteOne({ _id: testUserId });
    await mongoose.connection.close();
  });

  describe('GET /api/files', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/files');
      expect(res.status).toBe(401);
    });

    it('should return 200 with valid token', async () => {
      const res = await request(app)
        .get('/api/files')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.files)).toBe(true);
    });
  });

  describe('GET /api/files/:id', () => {
    it('should return 404 for non-existent file_id', async () => {
      const res = await request(app)
        .get('/api/files/ARC-2030-999999')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(404);
    });
  });
});
