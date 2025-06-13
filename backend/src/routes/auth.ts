import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body as validateBody } from 'express-validator';

import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from '../constants';

import { optionalAuth }     from '../middleware/auth';
import { handleValidation } from '../middleware/validation';

import { getCsrfToken } from '../controllers/auth/csrf';
import { getLogin, postLogin } from '../controllers/auth/login';
import { getRegister, postRegister } from '../controllers/auth/register';
import { postLogout } from '../controllers/auth/logout';
import { getRefresh } from '../controllers/auth/refresh';
import { getWhoami } from '../controllers/auth/whoami';

export const router = Router();

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
});

router.get('/login', getLogin);
router.post(
  '/login',
  limiter,
  validateBody('email').isEmail(),
  validateBody('password').notEmpty(),
  handleValidation,
  postLogin
);

router.get('/register', getRegister);
router.post(
  '/register',
  limiter,
  validateBody('email').isEmail(),
  validateBody('name').isString().notEmpty(),
  validateBody('password').isString().notEmpty().isStrongPassword(),
  handleValidation,
  postRegister
);

router.post('/logout', postLogout);

router.get('/whoami', optionalAuth, getWhoami) ;

router.post('/refresh', getRefresh);

router.get('/csrf-token', optionalAuth, getCsrfToken);
