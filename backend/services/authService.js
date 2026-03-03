import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

export const createToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

export const findUserByEmail = (email) => {
  return User.findOne({ email }).select('+password');
};

export const createUser = async (data) => {
  return User.create(data);
};
