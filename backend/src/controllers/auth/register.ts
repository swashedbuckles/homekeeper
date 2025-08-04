import { type RegisterRequest } from '@homekeeper/shared';

import { jwtCookie, csrfCookie } from '../../config/cookies';
import { 
  CSRF_COOKIE_NAME,
  ERROR_MESSAGES,
  HTTP_STATUS, 
  JWT_COOKIE_NAME, 
  REFRESH_COOKIE_NAME, 
  RESPONSE_MESSAGES, 
} from '../../constants';

import { generateCSRFToken } from '../../middleware/csrf';
import { register } from '../../services/auth';
import { createAuthToken, createRefreshToken } from '../../utils/createJwt';

import type {Request, Response} from 'express';


/**
 * Get registration page information
 * @route GET /auth/register
 * @response {{ message: string }} Registration page message
 */
export function getRegister(_req: Request, res: Response) {
  res.status(HTTP_STATUS.OK).apiSuccess({
    message: 'GET Register',
  });
}

/**
 * Register new user account
 * @route POST /auth/register
 * @body {RegisterRequest} User registration data (email, password, name)
 * @response {{ message: string, data?: SafeUser }} Success message and optional user data with auth cookies
 */
export async function postRegister(req: Request<object, object, RegisterRequest>, res: Response) {
    const { email, password, name } = req.body;
    try {
      const newUser = await register({ email, password, name });

      /** @todo send verification email */
      res
        .status(HTTP_STATUS.CREATED)
        .cookie(JWT_COOKIE_NAME, createAuthToken(newUser.user), jwtCookie())
        .cookie(REFRESH_COOKIE_NAME, createRefreshToken(newUser.user), jwtCookie())
        .cookie(CSRF_COOKIE_NAME, generateCSRFToken(), csrfCookie())
        .apiSuccess({
        message: RESPONSE_MESSAGES.REGISTRATION_SUCCESS,
        data: newUser.user,
      });

      console.log(`[AUTH_SUCCESS] Registration: ${newUser.user.email} from ${req.ip}`);
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        /** @todo send registration attempt notification */
        console.log(
          `[AUTH_INFO] Registration attempt for existing user: ${email} from ${req.ip}`,
        );

        res
          .status(HTTP_STATUS.CREATED)
          .apiSuccess({
            message: RESPONSE_MESSAGES.REGISTRATION_SUCCESS,
          });
        return;
      }

      console.error('Registration error:', error);
      res.apiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }
  }
