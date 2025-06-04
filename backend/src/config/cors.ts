import type { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URI || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
};
