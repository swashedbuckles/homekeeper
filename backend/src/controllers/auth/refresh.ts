import jwt from 'jsonwebtoken';
import type {Request, Response} from 'express';

import { JwtPayload } from '../../config/passport';
import { jwtCookie } from '../../config/cookies';

import { 
  CSRF_COOKIE_NAME, 
  HTTP_STATUS, 
  JWT_COOKIE_NAME, 
  JWT_EXPIRE_TIME_MS, 
  JWT_REFRESH_EXPIRE_TIME_MS, 
  JWT_SECRET, 
  REFRESH_COOKIE_NAME, 
  RESPONSE_MESSAGES } from '../../constants';


export function getRefresh(req: Request, res: Response) {
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
}

function decodeJWT(token: string): JwtPayload {
  const result = jwt.verify(token, JWT_SECRET);
  if (typeof result === 'string') {
    return JSON.parse(result) as JwtPayload;
  }

  return result as JwtPayload;
}