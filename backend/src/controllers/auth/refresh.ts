import { jwtCookie } from '../../config/cookies';
import { JwtPayload } from '../../config/passport';
import { 
  CSRF_COOKIE_NAME, 
  HTTP_STATUS, 
  JWT_COOKIE_NAME, 
  REFRESH_COOKIE_NAME, 
  RESPONSE_MESSAGES 
} from '../../constants';

import { updateTokenExpiration } from '../../utils/createJwt';
import { decodeJwt } from '../../utils/decodeJwt';

import type {Request, Response} from 'express';

/**
 * Refresh expired JWT token using refresh token
 * @route POST /auth/refresh
 * @response {{ message: string }} Success message with new JWT and refresh cookies
 */
export function getRefresh(req: Request, res: Response) {
  const jwtToken = (req.cookies[JWT_COOKIE_NAME] ?? null) as string | null;
  const refreshToken = (req.cookies[REFRESH_COOKIE_NAME] ?? null) as string | null;

  if (!jwtToken || !refreshToken) {
    // eslint-disable-next-line custom/enforce-api-response
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send();
    return;
  }

  const jwtPayload: JwtPayload = decodeJwt(jwtToken);
  const refreshPayload: JwtPayload = decodeJwt(refreshToken);

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

    const newToken = updateTokenExpiration(jwtPayload);
    const newRefresh = updateTokenExpiration(refreshPayload);

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