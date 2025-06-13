/* eslint-disable @typescript-eslint/no-misused-promises */
/** @todo reconcile "misused promises" with typings of passport */

import passport from 'passport';
import {
  Strategy as JWTStrategy,
  type VerifiedCallback,
  type JwtFromRequestFunction,
  type StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { IVerifyOptions, Strategy as LocalStrategy, type VerifyFunction } from 'passport-local';

import { ERROR_MESSAGES, JWT_COOKIE_NAME, JWT_SECRET } from '../constants';
import { User } from '../models/user';
import { login } from '../services/auth';

import type { UserDocument } from '../types/user';
import type { Request } from 'express';

type asyncVerifyCallback<T> = (payload: T, done: VerifiedCallback) => Promise<void>
interface asyncVerifyFunction extends VerifyFunction {
  (
    username: string,
    password: string,
    done: (error: unknown, user?: Express.User | false, options?: IVerifyOptions) => void,
  ): Promise<void>;
}

/**
 * Used for authentication and user lookup
 */
export type JwtPayload = {
  expiration: number;
  id: string;
  email?: string;
  type?: 'user' | 'refresh';
};

export const jwtFromRequest: JwtFromRequestFunction = (req: Request) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (req?.cookies?.[JWT_COOKIE_NAME] ?? null) as string | null; 
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
export const jwtVerifyCallback: asyncVerifyCallback<JwtPayload | null> = async (jwtPayload: JwtPayload | null, done) => {
  if (!jwtPayload) {
    done(null, false, { message: ERROR_MESSAGES.NO_JWT_PAYLOAD });
    return;
  }

  const { expiration, id } = jwtPayload;

  if (Date.now() > expiration) {
    done(null, false, { message: ERROR_MESSAGES.TOKEN_EXPIRED });
    return;
  }

  try {
    const user = (await User.findById(id)) as UserDocument;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!user) {
      done(null, false, { message: ERROR_MESSAGES.USER_NOT_FOUND });
      return;
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
export const localVerifyFn: asyncVerifyFunction = async (email, password, done) => {
  try {
    const { user: result } = await login(email, password);
    done(null, result);
  } catch {
    done(null, false, { message: ERROR_MESSAGES.INVALID_CREDENTIALS });
  }
};

/**
 * Configure passport to use the authentication strategies for JWT and Cookies
 */
export const configurePassport = (): void => {
  const jwtStrategy = new JWTStrategy(jwtOptions, jwtVerifyCallback);
  const localStrategy = new LocalStrategy({ usernameField: 'email' }, localVerifyFn );

  passport.use('jwt', jwtStrategy);
  passport.use('local', localStrategy);
};
