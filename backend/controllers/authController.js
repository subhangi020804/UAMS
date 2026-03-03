import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { createToken, findUserByEmail, createUser } from '../services/authService.js';
import { logAudit } from '../services/auditService.js';

export const register = async (req, res, next) => {
  try {
    const existing = await findUserByEmail(req.body.email);
    if (existing) {
      return errorResponse(res, 409, 'Email already registered');
    }
    const user = await createUser(req.body);
    const token = createToken(user._id);
    await logAudit(req, 'ROLE_CHANGE', { metadata: { newUser: user.email, role: user.role } });
    return successResponse(res, 201, 'Registration successful', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await findUserByEmail(req.body.email);
    if (!user || !(await user.comparePassword(req.body.password))) {
      return errorResponse(res, 401, 'Invalid email or password');
    }
    await logAudit(req, 'LOGIN', { metadata: { userId: user._id.toString() } });
    const token = createToken(user._id);
    return successResponse(res, 200, 'Login successful', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  } catch (err) {
    next(err);
  }
};
