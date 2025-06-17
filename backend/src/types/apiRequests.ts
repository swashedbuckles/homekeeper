import type core from 'express-serve-static-core';

export interface HouseReqBody {
  name: string;
  description?: string;
}

export type IdParam = core.ParamsDictionary & {
  id?: string;
}