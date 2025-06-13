import { DEV_FRONTEND } from '../constants';

import type { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URI ?? DEV_FRONTEND,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
};
