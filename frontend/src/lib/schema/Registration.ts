import { registerRequestSchema } from '@homekeeper/shared';
import { z } from 'zod';

export const frontendRegisterSchema = registerRequestSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});