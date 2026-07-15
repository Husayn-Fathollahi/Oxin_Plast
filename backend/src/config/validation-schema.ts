import * as Joi from 'joi';

/**
 * validation-schema.ts
 * Joi schema that validates required environment variables at startup.
 * The application will refuse to start if any required variable is missing.
 */
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3001),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),

  DATABASE_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  MAIL_HOST: Joi.string().optional(),
  MAIL_PORT: Joi.number().default(587),
  MAIL_USER: Joi.string().optional(),
  MAIL_PASS: Joi.string().optional(),
  MAIL_FROM: Joi.string().email().default('noreply@plasticcompany.ir'),

  MAX_FILE_SIZE_BYTES: Joi.number().default(10485760),
  UPLOAD_DIR: Joi.string().default('./uploads'),
});
