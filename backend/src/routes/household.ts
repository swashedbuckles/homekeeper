/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Router, type Request, type Response } from 'express';
import { body as validateBody, param as validateParams } from 'express-validator';
import { Types } from 'mongoose';

import { HouseholdPermissions } from '../config/permissions';
import { HTTP_STATUS } from '../constants';
import { requireAuth, assertHasUser } from '../middleware/auth';
import { isMemberOf, assertHasHouse } from '../middleware/isMemberOf';
import { requirePermission } from '../middleware/rbac';
import { handleValidation } from '../middleware/validation';
import { Household } from '../models/household';
import { User } from '../models/user';
import { removeKeysReducer } from '../utils/removeKeys';

import type { HouseReqBody, IdParam } from '../types/apiRequests';
import type { AddMemberRequest, HouseholdRoles, HouseResponse, InviteRequest } from '@homekeeper/shared';

export const router = Router();

/**
 * Returns a list of households of which user is a member. 
 * Looked up via household and not by User's role-map
 */
router.get('/', requireAuth, async (req: Request, res: Response) => {
  assertHasUser(req);
  const { id: userId } = req.user;

  try {
    const membership = await Household.findByMember(userId);
    const data = membership.map(house => {

      const data: HouseResponse = {
        memberCount: house.members.length,
        userRole: req.user.householdRoles[house._id.toString()],
        ...removeKeysReducer(house.serialize(), ['members'])
      };

      return data;
    });

    /** @todo currently all roles have household_view, but if we ever have a role that can't view household... */
    res
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        data,
      });
  } catch (e) {
    res.apiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, JSON.stringify(e));
  }
});

/** 
 * Household creation doesn't have permissions as... you become the owner once you've created one.
 */
router.post('/',
  validateBody('name').isString(),
  validateBody('description').optional().isString(),
  handleValidation,
  requireAuth,
  async (req: Request<{}, {}, HouseReqBody>, res: Response) => {
    assertHasUser<typeof req>(req);

    const { id: userId } = req.user;
    const { name, description } = req.body;

    try {
      const household = await Household.createHousehold(name, userId, description);

      res
        .status(HTTP_STATUS.OK)
        .apiSuccess({
          data: household
        });
    } catch (e) {
      res.apiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, JSON.stringify(e));
    }
  }
);


/**
 * Get details for an individual household
 */
router.get('/:id',
  requireAuth,
  isMemberOf,
  (req: Request<IdParam, {}, {}>, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);

    res
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        data: req.household
      });
  });

/**
 * Update a household
 */
router.put('/:id',
  validateBody('name').isString(),
  validateBody('description').optional().isString(),
  handleValidation,
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_UPDATE),
  async (req: Request<IdParam, object, HouseReqBody>, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);

    const userId = req.user.id;
    const isOwner = req.household.ownerId.equals(new Types.ObjectId(userId));

    if (!isOwner) {
      res
        .apiError(HTTP_STATUS.FORBIDDEN, 'User does not have privilege to edit household');
      return;
    }

    const update: HouseReqBody = { name: req.body.name };
    if (req.body.description) {
      update.description = req.body.description;
    }

    await req.household.updateOne(update).exec();

    res
      .status(HTTP_STATUS.OK)
      .apiSuccess({
        data: { /** @todo json representation for household */
          ownerId: req.household.ownerId,
          members: req.household.members,
          name: req.body.name,
          description: req.body.description ?? req.household.description,
        }
      });
  }
);

/**
 * Remove a household!
 */
router.delete('/:id',
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_DELETE),
  async (req: Request<IdParam, object, object>, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);

    const userId = req.user.id;
    const isOwner = req.household.ownerId.equals(new Types.ObjectId(userId));

    if (!isOwner) {
      res
        .apiError(HTTP_STATUS.FORBIDDEN, 'User does not have privilege to edit household');
      return;
    }

    await req.household.deleteOne().exec();

    // eslint-disable-next-line custom/enforce-api-response
    res
      .status(HTTP_STATUS.NO_CONTENT)
      .send();
  }
);


/**
 * Get everyone in a household
 */
router.get('/:id/members',
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_VIEW_MEMBERS),
  async (req: Request<IdParam, object, object>, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);

    try {
      const members = await req.household.getMembers();

      res.apiSuccess({
        data: {
          memberCount: members.length,
          members,
        }
      });
    } catch (error) {
      console.error(error);
      res.apiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to fetch members');
    }
  }
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
  async (req: Request<IdParam, object, AddMemberRequest>, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);

    if (!req.params.id) {
      res.apiError(HTTP_STATUS.BAD_REQUEST, 'Missing Household ID');
      return;
    }

    const { userId, role } = req.body;

    if (role === 'owner') {
      res.apiError(HTTP_STATUS.BAD_REQUEST, 'Role not allowed');
      return;
    }

    const id = new Types.ObjectId(userId);
    const alreadyAdded = req.household.members.some(member => member.equals(id));

    if (alreadyAdded) {
      res.apiError(HTTP_STATUS.CONFLICT, 'User already part of household');
      return;
    }

    await req.household.addMember(userId, role);

    res.apiSuccess({
      data: (await req.household.getMembers())
    });
  }
);

router.get('/:id/member/:userId',
  validateParams('id').isString().notEmpty(), 
  validateParams('userId').isString().notEmpty(),
  handleValidation,
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_VIEW_MEMBERS),
  async (req: Request, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);

    const user = await User.findById(req.params.userId);
    if(!user) {
      res.apiError(HTTP_STATUS.NOT_FOUND, 'User not found');
      return;
    }

    res.apiSuccess({
      data: {
        id: user._id.toString(),
        name: user.name,
        role: user.householdRoles.get(req.household._id.toString())
      }
    });
  }
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
  (req: Request<IdParam, object, InviteRequest>, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);

    if (!req.params.id) {
      res.apiError(HTTP_STATUS.BAD_REQUEST, 'Missing Household ID');
      return;
    }

    const { email, name, role } = req.body;

    if (role === 'owner') {
      res.apiError(HTTP_STATUS.BAD_REQUEST, 'Role not allowed');
      return;
    }

    console.log('Sending invitation to: ', name, ' ', email);

    res.status(HTTP_STATUS.ACCEPTED);
  }
);

/** 
 * Change a user's role
 */
type RoleChangeReqBody = { role: HouseholdRoles };
type RoleChangeParams = { id: string; userId: string };
router.put('/:id/members/:userId/role',
  validateBody('role').isString().matches(/owner|admin|member|guest/),
  validateParams('id').isString().notEmpty(),
  validateParams('userId').isString().notEmpty(),
  handleValidation,
  requireAuth,
  isMemberOf,
  requirePermission(HouseholdPermissions.HOUSEHOLD_UPDATE_MEMBER_ROLES),
  async (req: Request<RoleChangeParams, object, RoleChangeReqBody>, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);

    const { role } = req.body;
    const { userId } = req.params;

    if (role === 'owner') {
      res.apiError(HTTP_STATUS.BAD_REQUEST, 'Role not allowed');
      return;
    }

    const user = await User.findById(userId);
    if(!user) {
      res.apiError(HTTP_STATUS.NOT_FOUND, 'User not found');
      return;
    }

    await user.addHouseholdRole(req.household._id.toString(), role);
    await req.household.addMember(userId, role);

    res.apiSuccess({
      data: {
        id: user._id.toString(),
        name: user.name,
        role,
      }
    });
  }
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
  async (req: Request<RoleChangeParams, object, object>, res: Response) => {
    assertHasUser<typeof req>(req);
    assertHasHouse<typeof req>(req);
    const {userId} = req.params;
    const user = await User.findById(userId);

    if(!user) {
      res.apiError(HTTP_STATUS.NOT_FOUND, 'User not found');
      return;
    }

    await req.household.removeMember(userId);
    const members = await req.household.getMembers();

    res.apiSuccess({
      data: {
        memberCount: members.length,
        members
      }
    });
  }
);
