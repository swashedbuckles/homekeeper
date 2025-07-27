#!/usr/bin/env node

import mongoose from 'mongoose';
import { SeederRunner } from './seeder';
import { UsersSeeder } from './users.seeder';

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
  console.log('Homekeeper Minimal Database Seeder (Users Only)');
  console.log('================================================');

  await connectDB();

  try {
    const runner = new SeederRunner({
      clear: false,
      verbose: true,
    });

    // Only seed users for minimal setup
    runner.addSeeder(new UsersSeeder());

    await runner.run();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }

  console.log('Minimal seeding process completed');
  process.exit(0);
}

if (require.main === module) {
  void main();
}