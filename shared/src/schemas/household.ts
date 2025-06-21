import { z } from 'zod';
import { HOUSEHOLD_ROLES } from '../constants/roles';

export const InviteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(HOUSEHOLD_ROLES)
});

export const HouseholdSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional()
});