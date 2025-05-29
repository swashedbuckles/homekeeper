import type { Request, Response, NextFunction } from 'express';

import { login } from '../services/authentication';

/**
 * Handle login authentication, append user to locals.
 *
 * @param req Incoming Request
 * @param res Outgoing Response
 * @param next Pass execution to next mw callback
 * @returns
 */
export const loginMw = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await login(email, password);
    res.locals.user = user;
    next();
  } catch (error) {
    if (error === 'Invalid credentials') {
      res.status(400).json({
        error: 'Incorrect username or password',
      });
      return;
    }

    res.status(500).json({ error });
  }
};

export default login;
