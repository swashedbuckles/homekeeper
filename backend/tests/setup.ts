/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/require-jsdoc */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { beforeAll, afterAll, beforeEach, vi, expect } from 'vitest';

import { connectTestDB, closeTestDB, clearTestDB } from './helpers/db';

dotenv.config({ path: '.env.test' });

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
process.env.AWS_S3_BUCKET = 'test-bucket';
process.env.AWS_REGION = 'us-east-1';

beforeAll(async () => await connectTestDB(), 30000);
afterAll(async () => await closeTestDB(), 10000);
beforeEach(async () => await clearTestDB());

vi.mock('aws-sdk', () => ({
  S3: vi.fn(() => ({
    upload: vi.fn().mockReturnValue({
      promise: vi.fn().mockResolvedValue({
        Location: 'https://test-bucket.s3.amazonaws.com/test-file.pdf',
        Key: 'test-file.pdf',
        Bucket: 'test-bucket',
      }),
    }),
    deleteObject: vi.fn().mockReturnValue({
      promise: vi.fn().mockResolvedValue({}),
    }),
    getSignedUrl: vi.fn().mockReturnValue('https://signed-url.com/file.pdf'),
  })),
}));

// Console overrides for cleaner test output
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const originalConsole = { ...console };
if (process.env.SUPPRESS_TEST_LOGS === 'true') {
  console.log = vi.fn();
  console.info = vi.fn();
  console.warn = vi.fn();
}

expect.extend({
  toBeValidObjectId(received) {
    const pass = mongoose.Types.ObjectId.isValid(received);
    const message = pass
      ? (): string => `expected ${received} not to be a valid ObjectId`
      : (): string => `expected ${received} to be a valid ObjectId`;

    return {
      message,
      pass,
    };
  },

  toHaveBeenCalledWithObjectId(received, expected) {
    const pass = received.mock.calls.some((call: any[]) =>
      call.some((arg) => mongoose.Types.ObjectId.isValid(arg) && arg.toString() === expected.toString()),
    );

    return {
      message: (): string => `expected function to have been called with ObjectId ${expected}`,
      pass,
    };
  },
});

// Type declarations for custom matchers
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeValidObjectId(): T;
    toHaveBeenCalledWithObjectId(expected: any): T;
  }
  interface AsymmetricMatchersContaining {
    toBeValidObjectId(): any;
    toHaveBeenCalledWithObjectId(expected: any): any;
  }
}

// Error handling for unhandled promises in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process in tests, just log
});

console.log('Test environment setup completed!');
