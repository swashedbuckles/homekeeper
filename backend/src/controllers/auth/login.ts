
import { LoginRequest } from '@homekeeper/shared';

import { csrfCookie, jwtCookie } from '../../config/cookies';
import {
  CSRF_COOKIE_NAME,
  ERROR_MESSAGES,
  HTTP_STATUS,
  JWT_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  RESPONSE_MESSAGES,
} from '../../constants';
import { generateCSRFToken } from '../../middleware/csrf';
import { login } from '../../services/auth';
import { createAuthToken, createRefreshToken } from '../../utils/createJwt';

import type { Request, Response } from 'express';

export function getLogin(_req: Request, res: Response) {
  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      message: 'GET Login',
    });
}

export async function postLogin(req: Request<object, object, LoginRequest>, res: Response) {
  try {
    const { email, password } = req.body;
    const { user } = await login(email, password);

    res
      .cookie(JWT_COOKIE_NAME, createAuthToken(user), jwtCookie())
      .cookie(REFRESH_COOKIE_NAME, createRefreshToken(user), jwtCookie())
      .cookie(CSRF_COOKIE_NAME, generateCSRFToken(), csrfCookie())
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        message: RESPONSE_MESSAGES.LOGIN_SUCCESS,
        data: user,
      });

    console.log(`[AUTH_SUCCESS] Login: ${user.email} from ${req.ip}`);
  } catch (error) {
    console.log(`[AUTH_FAILED] Login attempt: ${req.body.email || 'unknown'} from ${req.ip}`);

    if (error instanceof Error && error.message === 'Invalid credentials') {
      res.apiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
      return;
    }

    res.apiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}
