import type { Request } from 'express';
import passport from 'passport';
import { Strategy as JWTStrategy, StrategyOptionsWithoutRequest } from 'passport-jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'DEV_JWT_SECRET';

const jwtFromRequest = (req: Request) => req && req.cookies ? req.cookies['jwt'] : null;

const options: StrategyOptionsWithoutRequest = {
  jwtFromRequest,
  secretOrKey: JWT_SECRET,
};

const strategy = new JWTStrategy(options, (jwtPayload, done) => {
  const { expiration } = jwtPayload

  if (Date.now() > expiration) {
    done('Unauthorized', false)
  }

  done(null, jwtPayload)
});

passport.use('jwt', strategy);