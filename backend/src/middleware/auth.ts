import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import type { SafeUser } from '../types/user';

/** @todo redirect to login */

/**
 * Middleware to enforce auth requirements on endpoint
 *
 * @param req request object
 * @param res response
 * @param next call next middleware
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: unknown, user: SafeUser, info: { message: string }) => {
    if (err) {
      /** @todo internal vs. external status -- exposing Authentication Error vs. Server Error */
      return res.status(500).json({ error: 'Authentication error' });
    }

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: info?.message || 'Authentication required',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Middleware to make auth optional -- will attach user to request if authenticated
 *
 * @param req request
 * @param res response
 * @param next call next middleware
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: unknown, user: SafeUser) => {
    if (!err && user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
