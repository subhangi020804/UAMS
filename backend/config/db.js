import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Connect to MongoDB with retry logic for production resilience.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    logger.error('MONGODB_URI is not set. Add it to backend/.env (see backend/.env.example).');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB is running and connected: ${conn.connection.host}`);
    console.log('');
    console.log('  ✓ MongoDB is running');
    console.log('');
  } catch (error) {
    logger.error('MongoDB connection error:', error.message);
    console.error('\n  ✗ MongoDB is not running or MONGODB_URI is wrong.');
    console.error('    Start MongoDB (e.g. brew services start mongodb-community) or check backend/.env\n');
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB error:', err);
});
