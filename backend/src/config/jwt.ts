import type { CookieOptions } from 'express';

export const jwtConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};
