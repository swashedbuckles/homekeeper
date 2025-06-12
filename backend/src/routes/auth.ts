import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { body as validateBody } from 'express-validator';
import jwt from 'jsonwebtoken';

import { LoginRequest, RegisterRequest } from '@homekeeper/shared';

import { csrfCookie, jwtCookie } from '../config/cookies';
import type { JwtPayload } from '../config/passport';
import {
  CSRF_COOKIE_NAME,
  ERROR_MESSAGES,
  HTTP_STATUS,
  JWT_COOKIE_NAME,
  JWT_EXPIRE_TIME_MS,
  JWT_REFRESH_EXPIRE_TIME_MS,
  REFRESH_COOKIE_NAME,
  JWT_SECRET,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  RESPONSE_MESSAGES,
} from '../constants';

import { optionalAuth } from '../middleware/auth';
import { generateCSRFToken } from '../middleware/csrf';
import { login, register } from '../services/auth';
import { handleValidation } from '../middleware/validation';

export const router = Router();

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
});

router.get('/login', (_req, res) => {
  res
    .status(HTTP_STATUS.OK)
    .apiSuccess({
      message: 'GET Login',
    });
});

router.post(
  '/login',
  limiter,
  validateBody('email').isEmail(),
  validateBody('password').notEmpty(),
  handleValidation,
  async (req: Request<object, object, LoginRequest>, res: Response) => {
    try {
      const { email, password } = req.body;
      const { user } = await login(email, password);

      const payload: JwtPayload = {
        email: user.email,
        id: user.id,
        expiration: Date.now() + JWT_EXPIRE_TIME_MS,
        type: 'user',
      };

      const refreshPayload: JwtPayload = {
        id: user.id,
        expiration: Date.now() + JWT_REFRESH_EXPIRE_TIME_MS,
        type: 'refresh',
      };

      const token = jwt.sign(payload, JWT_SECRET);
      const refresh = jwt.sign(refreshPayload, JWT_SECRET);

      res
        .cookie(JWT_COOKIE_NAME, token, jwtCookie())
        .cookie(REFRESH_COOKIE_NAME, refresh, jwtCookie())
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
  },
);

router.get('/register', (_req, res) => {
  res.status(HTTP_STATUS.OK).apiSuccess({
    message: 'GET Register',
  });
});

router.post(
  '/register',
  limiter,
  validateBody('email').isEmail(),
  validateBody('name').isString().notEmpty(),
  validateBody('password').isString().notEmpty().isStrongPassword(),
  handleValidation,
  async (req: Request<object, object, RegisterRequest>, res: Response) => {
    const { email, password, name } = req.body;
    try {
      const newUser = await register({ email, password, name });

      /** @todo send verification email */
      res.status(HTTP_STATUS.CREATED).apiSuccess({
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

        res.status(HTTP_STATUS.CREATED).apiSuccess({
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
  },
);

router.post('/refresh', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const jwtToken = (req.cookies[JWT_COOKIE_NAME] ?? null) as string | null;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const refreshToken = (req.cookies[REFRESH_COOKIE_NAME] ?? null) as string | null;

  if (!jwtToken || !refreshToken) {
    // eslint-disable-next-line custom/enforce-api-response
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send();
    return;
  }

  const jwtPayload: JwtPayload = decodeJWT(jwtToken);
  const refreshPayload: JwtPayload = decodeJWT(refreshToken);

  try {

    const jwtIsExpired = jwtPayload.expiration < Date.now();
    const refreshIsValid = refreshPayload.expiration >= Date.now();

    console.log('Processing: ', {jwtIsExpired, refreshIsValid});

    if (!jwtIsExpired) {
      res
        .apiError(HTTP_STATUS.NOT_ACCEPTABLE, 'Token is not expired');
      return;
    }

    if (!refreshIsValid) {
      // eslint-disable-next-line custom/enforce-api-response
      res
        .clearCookie(JWT_COOKIE_NAME)
        .clearCookie(REFRESH_COOKIE_NAME)
        .clearCookie(CSRF_COOKIE_NAME)
        .status(HTTP_STATUS.RESET_CONTENT).send();
      return;
    }

    jwtPayload.expiration = Date.now() + JWT_EXPIRE_TIME_MS;
    refreshPayload.expiration = Date.now() + JWT_REFRESH_EXPIRE_TIME_MS;
    const newToken = jwt.sign(jwtPayload, JWT_SECRET);
    const newRefresh = jwt.sign(refreshPayload, JWT_SECRET);

    res
      .status(200)
      .cookie(JWT_COOKIE_NAME, newToken, jwtCookie())
      .cookie(REFRESH_COOKIE_NAME, newRefresh, jwtCookie())
      .apiSuccess({
        message: RESPONSE_MESSAGES.REFRESHED
      });
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line custom/enforce-api-response
    res
      .clearCookie(JWT_COOKIE_NAME)
      .clearCookie(REFRESH_COOKIE_NAME)
      .clearCookie(CSRF_COOKIE_NAME)
      .status(HTTP_STATUS.RESET_CONTENT).send();
  }
});

router.get('/csrf-token', optionalAuth, (_req, res) => {
  const token = generateCSRFToken();

  // eslint-disable-next-line custom/enforce-api-response
  res
    .cookie('csrfToken', token, csrfCookie())
    .json({ csrfToken: token });
});

router.get('/logout', (req, res) => {
  /** @todo fix typing for request object to have cookies setup correctly */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
});

router.get('/whoami', optionalAuth, (req, res) => {
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
});

function decodeJWT(token: string): JwtPayload {
  const result = jwt.verify(token, JWT_SECRET);
  if (typeof result === 'string') {
    return JSON.parse(result) as JwtPayload;
  }

  return result as JwtPayload;
}