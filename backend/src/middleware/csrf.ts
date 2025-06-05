import crypto from 'node:crypto';

import type { NextFunction, Request, Response } from 'express';

import {
  CSRF_PROTECTED_METHODS,
  CSRF_TOKEN_BYTES,
  ERROR_MESSAGES,
  HTTP_STATUS,
} from '../constants';

/**
 * Use crypto to generate a string for CSRF token -- locking down cross site forgery
 *
 * @returns csrf token -- random string
 */
export const generateCSRFToken = (): string =>
  crypto.randomBytes(CSRF_TOKEN_BYTES).toString('hex');

/**
 * Middleware that checks a token in the cookie against the one presented in
 * the header. Help prevent cross-site request forgery.
 *
 * @param req request
 * @param res response
 * @param next next function
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  if ((CSRF_PROTECTED_METHODS as string[]).includes(req.method)) {
    const tokenFromHeader = req?.headers?.['x-csrf-token'];
    const tokenFromCookie = req?.cookies?.csrfToken;

    const noTokens = !tokenFromCookie || !tokenFromHeader;
    const tokensDontMatch = tokenFromCookie !== tokenFromHeader;

    if (noTokens || tokensDontMatch) {
      res.status(HTTP_STATUS.FORBIDDEN).json({ error: ERROR_MESSAGES.FORBIDDEN });

      return;
    }
  }
  next();
};
