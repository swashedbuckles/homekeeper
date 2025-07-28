#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'node:path';

import { HouseholdsSeeder } from './households.seeder';
import { InvitationsSeeder } from './invitations.seeder';
import { SeederRunner } from './seeder';
import { UsersSeeder } from './users.seeder';

dotenv.config({path: path.resolve(__dirname, '../../', '.env.local')});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/homekeeper';

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
}

async function main(): Promise<void> {
  console.log('Homekeeper Database Seeder');
  console.log('===========================');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const shouldClear = args.includes('--clear') || args.includes('-c');
  const verbose = !args.includes('--quiet') && !args.includes('-q');

  if (shouldClear) {
    console.log('WARNING: This will clear all existing data!');
    console.log('Press Ctrl+C now to cancel, or wait 3 seconds to continue...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  await connectDB();

  try {
    const runner = new SeederRunner({
      clear: shouldClear,
      verbose: verbose,
    });

    // Add seeders in dependency order
    runner.addSeeder(new UsersSeeder());
    runner.addSeeder(new HouseholdsSeeder());
    runner.addSeeder(new InvitationsSeeder());

    await runner.run();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }

  console.log('Seeding process completed');
  process.exit(0);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the seeder
if (require.main === module) {
  void main();
}