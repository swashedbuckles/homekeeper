import type { Request } from 'express';
import passport from 'passport';
import {
  Strategy as JWTStrategy,
  type JwtFromRequestFunction,
  type StrategyOptionsWithoutRequest,
  type VerifyCallback,
} from 'passport-jwt';
import { Strategy as LocalStrategy, type VerifyFunction } from 'passport-local';

import { ERROR_MESSAGES, JWT_COOKIE_NAME, JWT_SECRET } from '../constants';
import { User } from '../models/user';
import { login } from '../services/auth';
import type { UserDocument } from '../types/user';

/**
 * Used for authentication and user lookup
 */
export type JwtPayload = {
  expiration: number;
  email: string;
  id: string;
};

export const jwtFromRequest: JwtFromRequestFunction = (req: Request) => {
  return req?.cookies ? (req.cookies[JWT_COOKIE_NAME] ?? null) : null;
};

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest,
  secretOrKey: JWT_SECRET,
};

/**
 * Verify that the JWT's token has not expired. If the token time is still valid,
 * then we'll also check that the user exists and append it to the req object
 * (req.user: SafeUser)
 *
 * @todo cache the user so we don't hit the db every time.
 *
 * @param jwtPayload json web token payload
 * @param done next callback
 * @returns nothing
 */
export const jwtVerifyCallback: VerifyCallback = async (
  jwtPayload: JwtPayload | null,
  done,
) => {
  if (!jwtPayload) {
    return done(null, false, { message: ERROR_MESSAGES.NO_JWT_PAYLOAD });
  }

  const { expiration, id } = jwtPayload;

  if (Date.now() > expiration) {
    return done(null, false, { message: ERROR_MESSAGES.TOKEN_EXPIRED });
  }

  try {
    const user = (await User.findById(id)) as UserDocument;
    if (!user) {
      return done(null, false, { message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    done(null, user.toSafeObject());
  } catch (error) {
    done(error, false);
  }
};

/**
 * Local strategy -- attempt to log the user in. If it works, return the user
 * which will get appended to the request object (req.user: SafeUser).
 *
 * If it fails, err out.
 *
 * @param email user's email
 * @param password user's password
 * @param done callback to proceed
 * @returns nothing
 */
export const localVerifyFn: VerifyFunction = async (email, password, done) => {
  try {
    const { user: result } = await login(email, password);
    return done(null, result);
  } catch (_error) {
    return done(null, false, { message: ERROR_MESSAGES.INVALID_CREDENTIALS });
  }
};

/**
 * Configure passport to use the authentication strategies for JWT and Cookies
 */
export const configurePassport = (): void => {
  const jwtStrategy = new JWTStrategy(jwtOptions, jwtVerifyCallback);
  const localStrategy = new LocalStrategy({ usernameField: 'email' }, localVerifyFn);

  passport.use('jwt', jwtStrategy);
  passport.use('local', localStrategy);
};
