import crypto from 'crypto';

import type { Request, Response, NextFunction } from 'express';

const FILTERED_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

export const generateCSRFToken = (): string => crypto.randomBytes(32).toString('hex');

export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  if (FILTERED_METHODS.includes(req.method)) {
    const tokenFromHeader = req?.headers?.['x-csrf-token'];
    const tokenFromCookie = req?.cookies?.csrfToken;

    const noTokens = !tokenFromCookie || !tokenFromHeader;
    const tokensDontMatch = tokenFromCookie !== tokenFromHeader;

    if (noTokens || tokensDontMatch) {
      res.status(403).json({ error: 'Forbidden' });

      return;
    }
  }
  next();
};
