import { z } from 'zod';


const VALID_CODE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const invitationCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, 'Code must be exactly 6 characters')
    .regex(
      new RegExp(`^[${VALID_CODE_CHARACTERS}]{6}$`), 
      'Code contains invalid characters'
    )
});