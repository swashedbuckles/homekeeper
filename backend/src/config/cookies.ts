import type { CookieOptions } from 'express';

export const jwtCookie = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
};

export const csrfCookie = (): CookieOptions => {
  return {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
};
