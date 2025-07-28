import { z } from 'zod';
import { createPasswordSchema } from '../config/password.js';

export const registerRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: createPasswordSchema(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});