import { Router } from 'express';
import { body as validateBody, param as validateParams } from 'express-validator';

import { HouseholdPermissions } from '../config/permissions';
import {
  deleteHousehold,
  getHouseholdById,
  getHouseholds,
  postHouseholds,
  putHousehold,
} from '../controllers/household/household';

import  { 
  cancelInvitation,
  deleteMember,
  getInvitations,
  getMemberById,
  getMembers,
  postInvitation,
  putMember,
  putMemberRole,
} from '../controllers/household/membership';

import { requireAuth } from '../middleware/auth';
import { isMemberOf } from '../middleware/isMemberOf';
import { requirePermission } from '../middleware/rbac';
import { handleValidation } from '../middleware/validation';

export const router = Router();

/**
 * Returns a list of households of which user is a member. 
 * Looked up via household and not by User's role-map
 */
router.get('/', requireAuth, getHouseholds);

/** 
 * Household creation doesn't have permissions as... you become the owner once you've created one.
 */
router.post('/',
  validateBody('name').isString(),
  validateBody('description').optional().isString(),
  handleValidation,
  requireAuth,
  postHouseholds
);


/**
 * Get details for an individual household
 */
router.get('/:id',
  validateParams('id').isString().notEmpty(), 
  handleValidation,
  requireAuth,
  isMemberOf,
  getHouseholdById
);

/**
 * Update a household
 */
router.put('/:id',
  validateParams('id').isString().notEmpty(), 
  validateBody('name').isString(),
  validateBody('description').optional().isString(),
  handleValidation,
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_UPDATE),
  putHousehold
);

/**
 * Remove a household!
 */
router.delete('/:id',
  validateParams('id').isString().notEmpty(), 
  handleValidation,
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_DELETE),
  deleteHousehold
);


/**
 * Get everyone in a household
 */
router.get('/:id/members',
  validateParams('id').isString().notEmpty(), 
  handleValidation,
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_VIEW_MEMBERS),
  getMembers
);

/**
 * Add someone (who exists) to a household
 */
router.put('/:id/members',
  validateBody('userId').isString(),
  validateBody('role').isString().matches(/owner|admin|member|guest/),
  handleValidation,
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS),
  putMember
);

router.get('/:id/member/:userId',
  validateParams('userId').isString().notEmpty(),
  validateParams('id').isString().notEmpty(), 
  handleValidation,
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_VIEW_MEMBERS),
  getMemberById
);

/**
 * Send an invitation to a member
 */
router.post('/:id/members/invite',
  validateBody('name').isString(),
  validateBody('email').isString().isEmail(),
  validateBody('role').isString().matches(/owner|admin|member|guest/),
  handleValidation,
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS),
  postInvitation
);

/** 
 * Change a user's role
 */
router.put('/:id/members/:userId/role',
  validateBody('role').isString().matches(/owner|admin|member|guest/),
  validateParams('id').isString().notEmpty(),
  validateParams('userId').isString().notEmpty(),
  handleValidation,
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_UPDATE_MEMBER_ROLES),
  putMemberRole
);

/**
 * Remove a user from the household
 */
router.delete('/:id/members/:userId/', 
  validateParams('id').isString().notEmpty(),
  validateParams('userId').isString().notEmpty(),
  handleValidation,
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_REMOVE_MEMBERS),
  deleteMember
);


/**
 * Fetch a list of invitations to a hosuehold
 */
router.get('/:id/invitations',
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS),
  getInvitations
);

/**
 * Fetch a list of invitations to a hosuehold
 */
router.delete('/:id/invitations/:invitationId',
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS),
  cancelInvitation
);
