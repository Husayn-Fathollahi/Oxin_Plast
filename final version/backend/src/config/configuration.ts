/**
 * configuration.ts
 * Main configuration factory loaded by ConfigModule.
 * Access values via ConfigService.get('database.url') etc.
 */
export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV ?? 'development',

  database: {
    url: process.env.DATABASE_URL,
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT ?? '587', 10),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM ?? 'noreply@plasticcompany.ir',
  },

  upload: {
    maxFileSizeBytes: parseInt(process.env.MAX_FILE_SIZE_BYTES ?? '10485760', 10), // 10 MB
    uploadDir: process.env.UPLOAD_DIR ?? './uploads',
  },
});
