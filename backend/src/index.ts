import type {} from './types/express.d.ts';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';

import { corsOptions } from './config/cors';
import { helmetConfig } from './config/helmet';
import { authLogFormat, authMorganConfig, morganConfig, morganFormat } from './config/morgan';
import { configurePassport } from './config/passport';
import { DEFAULT_PORT, HTTP_STATUS, RESPONSE_MESSAGES } from './constants';
import { requireAuth } from './middleware/auth';
import { csrfProtection } from './middleware/csrf';
import { router as authRouter } from './routes/auth';
import { apiResponseMiddleware } from './middleware/apiResponse';

const isProduction = process.env.NODE_ENV === 'production';
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const isBehindProxy = process.env.RENDER || process.env.RAILWAY || process.env.HEROKU;


dotenv.config();

/**
 * Setup the express application without kicking it off directly.
 * Add and configure all middleware and routes
 *
 * @returns Express App
 */
export const createApp = (): express.Application => {
  const app = express();
  
  if (isProduction || isBehindProxy) {
    app.set('trust proxy', true);
  }

  configurePassport();

  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet(helmetConfig));
  app.use(morgan(authLogFormat, authMorganConfig()));
  app.use(morgan(morganFormat(), morganConfig()));
  app.use(passport.initialize());
  app.use(apiResponseMiddleware);

  app.use('/api', csrfProtection);
  app.use('/protected', csrfProtection);

  app.use('/auth', authRouter);

  app.get('/api/health', (_req, res) => {
    res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGES.API_RUNNING });
  });

  app.get('/protected', requireAuth, (req, res) => {
    res.status(HTTP_STATUS.OK).apiSuccess({
      message: 'Welcome to the protected route!',
      data: req.user,
    });
  });

  // Root health check for easier debugging
  app.get('/', (_req, res) => {
    res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGES.SERVER_RUNNING });
  });

  return app;
};

/**
 * Setup the database connection
 */
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB with URI:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Continuing execution despite MongoDB connection failure');
  }
};

/**
 * Create and start the express server.
 *
 * Wait for the db connection before starting the server -- even if it errors, as
 * we want to see the connection issues and our error handing in the rest of the
 * app should handle it
 */
const startServer = async (): Promise<void> => {
  const port = process.env.PORT || DEFAULT_PORT;
  const app = createApp();

  try {
    // Try to connect to MongoDB but don't fail if it doesn't connect
    await connectDB().catch((err: unknown) =>{ 
      console.log('MongoDB connection issue, continuing...', err); 
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Health endpoint available at http://localhost:${port}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Don't start the server if we're importing this module (e.g. testing)
if (require.main === module) {
  void startServer();
}
