import type { Request } from 'express';
import passport from 'passport';
import { Strategy as JWTStrategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { User } from '../models/user';
import { UserDocument } from '../types/user';
import { login } from '../services/authentication';

const JWT_SECRET = process.env.JWT_SECRET || 'DEV_JWT_SECRET';

export type JwtPayload = {
  expiration: number;
  email: string;
  id: string;
};

const jwtFromRequest = (req: Request) => (req && req.cookies ? req.cookies['jwt'] : null);

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest,
  secretOrKey: JWT_SECRET,
  // issuer: 'tomseph.dev',
  // audience: 'tomseph.dev',
};

const jwtStrategy = new JWTStrategy(jwtOptions, async (jwtPayload: JwtPayload | null, done) => {
  if (!jwtPayload) {
    return done(null, false, { message: 'No JWT payload' });
    return;
  }

  const { expiration, id } = jwtPayload;

  if (Date.now() > expiration) {
    return done(null, false, { message: 'Token expired' });
  }

  try {
    const user = (await User.findById(id)) as UserDocument;
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    done(null, user.toSafeObject());
  } catch (error) {
    done(error, false);
  }
});

const localStrategy = new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const result = await login(email, password);
    return done(null, result);
  } catch (error) {
    return done(null, false, { message: 'Invalid credentials' });
  }
});

passport.use('jwt', jwtStrategy);
passport.use('local', localStrategy);
