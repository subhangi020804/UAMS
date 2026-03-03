import Joi from 'joi';

const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .message('Password must be at least 8 characters with one uppercase, one lowercase, and one number');

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: passwordSchema.required(),
  role: Joi.string().valid('admin', 'manager', 'user').default('user'),
}).unknown(false);

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().required(),
}).unknown(false);
