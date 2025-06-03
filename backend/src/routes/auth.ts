import { Router } from 'express';
import { body as validateBody, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { JwtPayload } from '../config/passport';
import { optionalAuth } from '../middleware/auth';
import { register, login } from '../services/authentication';

const router = Router();

const JWT_EXPIRE_TIME_MS = 600000;
const JWT_SECRET = process.env.JWT_SECRET || '';

/* ------------ LOGIN ------------ */
router.get('/login', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'GET Login',
  });
});

router.post('/login', validateBody('email').isEmail(), validateBody('password').notEmpty(), async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Invalid input',
      details: errors.array(),
    });
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
      .cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .status(200)
      .json({
        status: 'ok',
        message: 'Login successful',
        user: user,
      });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});
/* ------------ /LOGIN ------------ */

/* ------------ REGISTRATION ------------ */
router.get('/register', (req, res) => {
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
  async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const newUser = await register({ email, password, name });

      res.status(201).json({
        status: 'ok',
        message: 'Registration successful',
        user: newUser.user,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        return res.status(409).json({
          error: 'User already exists' /** @todo is this an issue letting someone know an email exists? */,
        });
      }

      console.error('Registration error:', error);
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  },
);
/* ------------ /REGISTRATION------------ */

router.get('/logout', (req, res) => {
  if (req.cookies['jwt']) {
    return res.clearCookie('jwt').status(200).json({
      message: 'You have logged out',
    });
  }

  return res.status(200).json({
    message: 'You have logged out',
  });
});

router.get('/whoami', optionalAuth, (req, res) => {
  if (req.user) {
    return res.status(200).json({
      user: req.user,
    });
  }

  return res.status(204).send();
});

export default router;
