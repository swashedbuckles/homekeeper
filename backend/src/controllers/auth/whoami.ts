import {Request, Response} from 'express';

import { HTTP_STATUS } from '../../constants';

/**
 * Get current authenticated user information
 * @route GET /auth/whoami
 * @response {{ data: SafeUser | {} }} User data if authenticated, empty object if not
 */
export function getWhoami(req: Request, res: Response) {
  if (req.user) {
    res
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        data: req.user,
      });

    return;
  }

  res
    .status(HTTP_STATUS.NO_CONTENT)
    .apiSuccess({
      data: {},
    });
};