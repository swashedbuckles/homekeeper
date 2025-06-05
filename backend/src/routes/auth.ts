import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body as validateBody, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { csrfCookie, jwtCookie } from '../config/cookies';
import { JwtPayload } from '../config/passport';
import {
  CSRF_COOKIE_NAME,
  ERROR_MESSAGES,
  HTTP_STATUS,
  JWT_COOKIE_NAME,
  JWT_EXPIRE_TIME_MS,
  JWT_SECRET,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  RESPONSE_MESSAGES,
} from '../constants';
import { optionalAuth } from '../middleware/auth';
import { generateCSRFToken } from '../middleware/csrf';
import { register, login } from '../services/auth';

const router = Router();

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
});

/* ------------ LOGIN ------------ */
router.get('/login', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    message: 'GET Login',
  });
});

router.post(
  '/login',
  limiter,
  validateBody('email').isEmail(),
  validateBody('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Invalid input',
        details: errors.array(),
      });

      return;
    }

    try {
      const { email, password } = req.body;

      // Call login service directly
      const { user } = await login(email, password);

      // Create JWT payload
      const payload: JwtPayload = {
        email: user.email,
        id: user.id,
        expiration: Date.now() + JWT_EXPIRE_TIME_MS,
      };

      const token = jwt.sign(payload, JWT_SECRET);

      res
        .cookie(JWT_COOKIE_NAME, token, jwtCookie())
        .cookie(CSRF_COOKIE_NAME, generateCSRFToken(), csrfCookie())
        .status(HTTP_STATUS.OK)
        .json({
          message: RESPONSE_MESSAGES.LOGIN_SUCCESS,
          user: user,
        });
      console.log(`[AUTH_SUCCESS] Login: ${user.email} from ${req.ip}`);
    } catch (error) {
      console.log(`[AUTH_FAILED] Login attempt: ${req.body.email || 'unknown'} from ${req.ip}`);

      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
      return;
    }
  },
);
/* ------------ /LOGIN ------------ */

/* ------------ REGISTRATION ------------ */
router.get('/register', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    message: 'GET Register',
  });
});

router.post(
  '/register',
  limiter,
  validateBody('email').isEmail(),
  validateBody('name').isString().notEmpty(),
  validateBody('password').isString().notEmpty().isStrongPassword(),
  async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const newUser = await register({ email, password, name });

      /** @todo send verification email */
      res.status(HTTP_STATUS.CREATED).json({
        message: RESPONSE_MESSAGES.REGISTRATION_SUCCESS,
        user: newUser.user,
      });

      console.log(`[AUTH_SUCCESS] Registration: ${newUser.user.email} from ${req.ip}`);
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        /** @todo send registration attempt notification */
        console.log(
          `[AUTH_INFO] Registration attempt for existing user: ${email} from ${req.ip}`,
        );

        res.status(HTTP_STATUS.CREATED).json({
          message: RESPONSE_MESSAGES.REGISTRATION_SUCCESS,
        });
      }

      console.error('Registration error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  },
);
/* ------------ /REGISTRATION------------ */

router.get('/csrf-token', optionalAuth, (req, res) => {
  const token = generateCSRFToken();

  res.cookie('csrfToken', token, csrfCookie()).json({ csrfToken: token });
});

router.get('/logout', (req, res) => {
  if (req.cookies[JWT_COOKIE_NAME]) {
    console.log(`[AUTH_INFO] Logout from ${req.ip}`);
    res.clearCookie(JWT_COOKIE_NAME).status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.LOGOUT_SUCCESS,
    });
    return;
  }

  res.status(HTTP_STATUS.OK).json({
    message: RESPONSE_MESSAGES.LOGOUT_SUCCESS,
  });
});

router.get('/whoami', optionalAuth, (req, res) => {
  if (req.user) {
    res.status(HTTP_STATUS.OK).json({
      user: req.user,
    });
    return;
  }

  res.status(HTTP_STATUS.NO_CONTENT).json({
    user: {},
  });
});

export default router;
