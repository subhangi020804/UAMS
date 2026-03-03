import Joi from 'joi';

const fileIdPattern = /^ARC-\d{4}-\d{6}$/;

export const createFileSchema = Joi.object({
  retention_years: Joi.number().integer().min(1).max(100).required(),
  building: Joi.string().trim().max(100).allow('').optional(),
  room: Joi.string().trim().max(50).allow('').optional(),
}).unknown(false);

export const updateFileSchema = Joi.object({
  file_name: Joi.string().trim().max(255).optional(),
  retention_years: Joi.number().integer().min(1).max(100).optional(),
  building: Joi.string().trim().max(100).allow('').optional(),
  room: Joi.string().trim().max(50).allow('').optional(),
}).unknown(false);

export const fileIdParamSchema = Joi.object({
  id: Joi.string().pattern(fileIdPattern).required(),
}).unknown(false);

export const listFilesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('all', 'Active', 'Expired', 'Expiring Soon').default('all'),
  sort: Joi.string().valid('newest', 'oldest', 'expiry', 'name').default('newest'),
  search: Joi.string().trim().max(200).allow('').optional(),
}).unknown(false);
