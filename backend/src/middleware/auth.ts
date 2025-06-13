/* eslint-disable @typescript-eslint/no-unsafe-call */
import passport from 'passport';

import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';

import type { SafeUser } from '../types/user';
import type { NextFunction, Request, Response } from 'express';

/**
 * Assert that `req.user` exists on the request object -- primarily for 
 * Typescript to understand mutations occurring in middleware
 * @param req Request object
 */
export function assertHasUser<T extends Request>(req: T): asserts req is T & { user: NonNullable<Express.Request['user']> } {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
}

/**
 * Middleware to enforce auth requirements on endpoint
 * @todo redirect to login 
 *
 * @param req request object
 * @param res response
 * @param next call next middleware
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: unknown, user?: SafeUser, info?: { message: string }) => {
      if (err) {
        /** @todo internal vs. external status -- exposing Authentication Error vs. Server Error */
        // eslint-disable-next-line custom/enforce-api-response
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .json({error: ERROR_MESSAGES.AUTHENTICATION_ERROR});
      }

      if (!user) {
        // eslint-disable-next-line custom/enforce-api-response
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: ERROR_MESSAGES.UNAUTHORIZED,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          message: info?.message || ERROR_MESSAGES.AUTHENTICATION_REQUIRED,
        });
      }

      req.user = user;
      next();
    },
  )(req, res, next);
};

/**
 * Middleware to make auth optional -- will attach user to request if authenticated
 *
 * @param req request
 * @param res response
 * @param next call next middleware
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: unknown, user?: SafeUser) => {
    if (!err && user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
