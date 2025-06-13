import { RegisterRequest } from '@homekeeper/shared';

import { 
  ERROR_MESSAGES,
  HTTP_STATUS, 
  RESPONSE_MESSAGES, 
} from '../../constants';
import { register } from '../../services/auth';

import type {Request, Response} from 'express';


export function getRegister(_req: Request, res: Response) {
  res.status(HTTP_STATUS.OK).apiSuccess({
    message: 'GET Register',
  });
}

export async function postRegister(req: Request<object, object, RegisterRequest>, res: Response) {
    const { email, password, name } = req.body;
    try {
      const newUser = await register({ email, password, name });

      /** @todo send verification email */
      res.status(HTTP_STATUS.CREATED).apiSuccess({
        message: RESPONSE_MESSAGES.REGISTRATION_SUCCESS,
        data: newUser.user,
      });

      console.log(`[AUTH_SUCCESS] Registration: ${newUser.user.email} from ${req.ip}`);
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        /** @todo send registration attempt notification */
        console.log(
          `[AUTH_INFO] Registration attempt for existing user: ${email} from ${req.ip}`,
        );

        res.status(HTTP_STATUS.CREATED).apiSuccess({
          message: RESPONSE_MESSAGES.REGISTRATION_SUCCESS,
        });
        return;
      }

      console.error('Registration error:', error);
      res.apiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }
  }
