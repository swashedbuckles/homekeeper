import { ALL_PERMISSIONS } from '../config/permissions';
import { ERROR_MESSAGES } from '../constants';
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '../services/permission';

import type {Request, Response, NextFunction, RequestHandler} from 'express';

export function requirePermission(permission: ALL_PERMISSIONS): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction) {
    const {user} = req;
    const householdId = req.params.id;

    if(!user || !householdId) {
      res.apiError(401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    if(!hasPermission(user, householdId, permission)) {
      res.apiError(403, ERROR_MESSAGES.FORBIDDEN);
      return;
    }

    next();
  };
}

export function requireAnyPermission(permissions: ALL_PERMISSIONS[]): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction) {
    const {user} = req;
    const householdId = req.params.id;

    if(!user || !householdId) {
      res.apiError(401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    if(!hasAnyPermission(user, householdId, permissions)) {
      res.apiError(403, ERROR_MESSAGES.FORBIDDEN);
      return;
    }

    next();
  };
}

export function requireAllPermissions(permissions: ALL_PERMISSIONS[]): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction) {
    const {user} = req;
    const householdId = req.params.id;

    if(!user || !householdId) {
      res.apiError(401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    if(!hasAllPermissions(user, householdId, permissions)) {
      res.apiError(403, ERROR_MESSAGES.FORBIDDEN);
      return;
    }

    next();
  };
}