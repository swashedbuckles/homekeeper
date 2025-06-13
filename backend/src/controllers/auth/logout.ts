import {Request, Response} from 'express';

import { 
  CSRF_COOKIE_NAME,
  HTTP_STATUS, 
  JWT_COOKIE_NAME, 
  REFRESH_COOKIE_NAME, 
  RESPONSE_MESSAGES, 
} from '../../constants';

export function postLogout(req: Request, res: Response) {
  /** @todo fix typing for request object to have cookies setup correctly */
   
  if (req.cookies[JWT_COOKIE_NAME]) {
    console.log(`[AUTH_INFO] Logout from ${req.ip}`);
    res
      .clearCookie(JWT_COOKIE_NAME)
      .clearCookie(REFRESH_COOKIE_NAME)
      .clearCookie(CSRF_COOKIE_NAME)
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        message: RESPONSE_MESSAGES.LOGOUT_SUCCESS,
      });
    return;
  }

  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      message: RESPONSE_MESSAGES.LOGOUT_SUCCESS,
    });
}