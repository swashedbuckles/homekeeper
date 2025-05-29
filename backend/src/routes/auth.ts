import { Router } from 'express';
import { body as validateBody } from 'express-validator';
import jwt from 'jsonwebtoken';

import { loginMw } from '../middleware/user';
import { register } from '../services/authentication';
const router = Router();

const JWT_EXPIRE_TIME_MS = 600000;
const JWT_SECRET = process.env.JWT_SECRET || '';

router.get('/login', (req, res, next) => {
  res.status(200).json({
    status: 'ok',
    message: 'GET Login',
  });
});

router.post('/login', loginMw, (req, res, next) => {
  const { user } = res.locals;

  /** @todo extract into separate function for testability */
  const payload = {
    /** @todo type for jwt payload */
    username: user.email,
    expiration: Date.now() + JWT_EXPIRE_TIME_MS,
  };

  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);

  res
    .cookie('jwt', token, {
      httpOnly: true,
      secure: false /** @todo set based on dev/production */,
    })
    .status(200)
    .json({
      status: 'ok',
      message: 'POST login',
      user: res.locals['user'] ?? {},
    });
});

router.get('/register', (req, res, next) => {
  res.status(200).json({
    status: 'ok',
    message: 'GET Register',
  });
});

router.post(
  '/register',
  validateBody('email').isEmail(),
  validateBody('name').isString().notEmpty(),
  validateBody('password').isString().notEmpty().isStrongPassword(),
  async (req, res, next) => {
    const { email, password, name } = req.body;
    const newUser = await register({ email, password, name });

    res.status(200).json({
      status: 'ok',
      message: 'POST Register',
      user: newUser,
    });
  },
);

router.get('/logout', (req, res, next) => {
  if (req.cookies['jwt']) {
    res.clearCookie('jwt').status(200).json({
      message: 'You have logged out',
    });
  } else {
    res.status(200).json({
      message: 'You have logged out',
    });
  }
});

export default router;
