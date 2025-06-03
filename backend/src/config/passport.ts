import type { Request } from 'express';
import passport from 'passport';
import {
  Strategy as JWTStrategy,
  StrategyOptionsWithoutRequest,
  JwtFromRequestFunction,
  VerifyCallback,
} from 'passport-jwt';
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local';

import { User } from '../models/user';
import { login } from '../services/authentication';
import { UserDocument } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'DEV_JWT_SECRET';

export type JwtPayload = {
  expiration: number;
  email: string;
  id: string;
};

export const jwtFromRequest: JwtFromRequestFunction = (req: Request) => {
  return req && req.cookies ? (req.cookies['jwt'] ?? null) : null;
};

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest,
  secretOrKey: JWT_SECRET,
  // issuer: 'tomseph.dev',
  // audience: 'tomseph.dev',
};

export const jwtVerifyCallback: VerifyCallback = async (jwtPayload: JwtPayload | null, done) => {
  if (!jwtPayload) {
    return done(null, false, { message: 'No JWT payload' });
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
};

export const localVerifyFn: VerifyFunction = async (email, password, done) => {
  try {
    const { user: result } = await login(email, password);
    return done(null, result);
  } catch (error) {
    return done(null, false, { message: 'Invalid credentials' });
  }
};

const jwtStrategy = new JWTStrategy(jwtOptions, jwtVerifyCallback);
const localStrategy = new LocalStrategy({ usernameField: 'email' }, localVerifyFn);

passport.use('jwt', jwtStrategy);
passport.use('local', localStrategy);
