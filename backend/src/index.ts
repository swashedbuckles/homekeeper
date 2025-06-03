import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';

import { requireAuth } from './middleware/auth';
import authRouter from './routes/auth';

import './config/passport'; // jwt-strategy

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// MongoDB Connection Setup
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

app.use('/auth', authRouter);

// API routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API server is running' });
});

app.get('/protected', requireAuth, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the protected route!',
    user: req.user,
  });
});

// Root health check for easier debugging
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start server
const startServer = async () => {
  try {
    // Try to connect to MongoDB but don't fail if it doesn't connect
    await connectDB().catch((err) => console.log('MongoDB connection issue, continuing...', err));

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Health endpoint available at http://localhost:${port}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
