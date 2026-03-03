import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/universal-archive-test';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Auth API', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  });

  afterAll(async () => {
    await User.deleteMany({ email: /test.*@example\.com/ });
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: `test-${Date.now()}@example.com`,
          password: 'Password1',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email');
      expect(res.body.data.user).toHaveProperty('role');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: `weak-${Date.now()}@example.com`,
          password: 'short',
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject missing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', password: 'Password1' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    const testEmail = `login-${Date.now()}@example.com`;
    beforeAll(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ name: 'Login Test', email: testEmail, password: 'Password1' });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'Password1' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'WrongPass1' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
