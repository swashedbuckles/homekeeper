import {Request, Response} from 'express';
import { HTTP_STATUS } from '../../constants';

export function getWhoami(req: Request, res: Response) {
  if (req.user) {
    res
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        data: req.user,
      });

    return;
  }

  res
    .status(HTTP_STATUS.NO_CONTENT)
    .apiSuccess({
      data: {},
    });
};