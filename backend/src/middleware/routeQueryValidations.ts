import {INVITATION_STATUSES} from '@homekeeper/shared';
import {query} from 'express-validator';

export const validateInvitationQuery = query('status')
      .optional()
      .isIn(INVITATION_STATUSES)
      .withMessage('Status must be one of: pending, accepted, declined, expired');

export const validateResponseLimit = query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100');