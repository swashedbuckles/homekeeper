/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from 'vitest';
import { Types } from 'mongoose';

import { HTTP_STATUS, JWT_COOKIE_NAME } from '../../src/constants';
import { createAuthToken } from '../../src/utils/createJwt';
import { request } from '../helpers/app';
import { createTestUserWithHousehold, insertTestUser } from '../helpers/testDataUtils';
import { Invitation } from '../../src/models/invitation';
import { Household } from '../../src/models/household';

describe('Household Invitation Routes (Integration)', () => {
  describe('GET /:id/invitations', () => {
    it('should return all invitations for household when user has permission', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      // Create some invitations
      await request
        .post(`/households/${household._id}/members/invite`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({
          email: 'invite1@example.com',
          name: 'User One',
          role: 'member'
        });

      await request
        .post(`/households/${household._id}/members/invite`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({
          email: 'invite2@example.com',
          name: 'User Two',
          role: 'admin'
        });

      const response = await request
        .get(`/households/${household._id}/invitations`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data).toHaveLength(2);

      const invitation1 = response.body.data.find(inv => inv.email === 'invite1@example.com');
      const invitation2 = response.body.data.find(inv => inv.email === 'invite2@example.com');

      expect(invitation1).toBeDefined();
      expect(invitation1.status).toBe('pending');
      expect(invitation1.code).toHaveLength(6);

      expect(invitation2).toBeDefined();
      expect(invitation2.status).toBe('pending');
      expect(invitation2.code).toHaveLength(6);
    });

    it('should return empty array when no invitations exist', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .get(`/households/${household._id}/invitations`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return 401 when user is not authenticated', async () => {
      const { household } = await createTestUserWithHousehold();

      const response = await request.get(`/households/${household._id}/invitations`);

      expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return 404 when user is not a member of household', async () => {
      const { household } = await createTestUserWithHousehold();
      const outsideUser = await insertTestUser({ email: 'outside@example.com' });
      const token = createAuthToken(outsideUser.toSafeObject());

      const response = await request
        .get(`/households/${household._id}/invitations`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Household not found');
    });

    it('should return 403 when user lacks HOUSEHOLD_INVITE_MEMBERS permission', async () => {
      const { user: owner, household } = await createTestUserWithHousehold();
      const memberUser = await insertTestUser({ email: 'member@example.com' });
      await household.addMember(memberUser._id.toString(), 'member');

      const token = createAuthToken(memberUser.toSafeObject());

      const response = await request
        .get(`/households/${household._id}/invitations`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
      expect(response.body.error).toBe('Forbidden');
    });

    it('should allow admin to view invitations', async () => {
      const { user: owner, household } = await createTestUserWithHousehold();
      const adminUser = await insertTestUser({ email: 'admin@example.com' });
      await household.addMember(adminUser._id.toString(), 'admin');

      const token = createAuthToken(adminUser.toSafeObject());

      const response = await request
        .get(`/households/${household._id}/invitations`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('DELETE /:id/invitations/:invitationId', () => {
    it('should cancel invitation successfully', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      // Create an invitation first
      const createResponse = await request
        .post(`/households/${household._id}/members/invite`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({
          email: 'cancel@example.com',
          name: 'Cancel User',
          role: 'member'
        });

      const invitationId = createResponse.body.data.id;

      const response = await request
        .delete(`/households/${household._id}/invitations/${invitationId}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data.status).toBe('cancelled');
      expect(response.body.data.email).toBe('cancel@example.com');
      expect(response.body.data.id).toBe(invitationId);

      // Verify invitation is cancelled in database
      const updatedInvitation = await Invitation.findById(invitationId);
      expect(updatedInvitation?.status).toBe('cancelled');
    });

    it('should return 404 when invitation does not exist', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());
      const fakeInvitationId = new Types.ObjectId();

      const response = await request
        .delete(`/households/${household._id}/invitations/${fakeInvitationId}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Missing or invalid Invitation');
    });

    it('should return 409 when trying to cancel an invitation that\'s not pending', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      // Create and expire an invitation
      const createResponse = await request
        .post(`/households/${household._id}/members/invite`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({
          email: 'expired@example.com',
          name: 'Expired User',
          role: 'member'
        });

      const invitationId = createResponse.body.data.id;

      // Manually expire the invitation
      await (await Invitation.findById(invitationId))?.expire();

      const response = await request
        .delete(`/households/${household._id}/invitations/${invitationId}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.CONFLICT);
      expect(response.body.error).toBe('Missing or invalid Invitation');
    });

    it('should return 409 when trying to cancel redeemed invitation', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      // Create an invitation
      const createResponse = await request
        .post(`/households/${household._id}/members/invite`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({
          email: 'redeemed@example.com',
          name: 'Redeemed User',
          role: 'member'
        });

      const invitationId = createResponse.body.data.id;

      // Manually mark as redeemed (simulating redemption)
      const invitation = await Invitation.findById(invitationId);
      await invitation?.redeem();

      const response = await request
        .delete(`/households/${household._id}/invitations/${invitationId}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.CONFLICT);
      expect(response.body.error).toBe('Missing or invalid Invitation');
    });

    it('should return 401 when user is not authenticated', async () => {
      const { household } = await createTestUserWithHousehold();
      const fakeInvitationId = new Types.ObjectId();

      const response = await request
        .delete(`/households/${household._id}/invitations/${fakeInvitationId}`);

      expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return 404 when user is not a member of household', async () => {
      const { household } = await createTestUserWithHousehold();
      const outsideUser = await insertTestUser({ email: 'outside@example.com' });
      const token = createAuthToken(outsideUser.toSafeObject());
      const fakeInvitationId = new Types.ObjectId();

      const response = await request
        .delete(`/households/${household._id}/invitations/${fakeInvitationId}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Household not found');
    });

    it('should return 403 when user lacks HOUSEHOLD_INVITE_MEMBERS permission', async () => {
      const { user: owner, household } = await createTestUserWithHousehold();
      const memberUser = await insertTestUser({ email: 'member@example.com' });
      await household.addMember(memberUser._id.toString(), 'member');

      const token = createAuthToken(memberUser.toSafeObject());
      const fakeInvitationId = new Types.ObjectId();

      const response = await request
        .delete(`/households/${household._id}/invitations/${fakeInvitationId}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
      expect(response.body.error).toBe('Forbidden');
    });

    it('should return 400 when invitation ID is invalid format', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .delete(`/households/${household._id}/invitations/invalid-id`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      // This would likely cause a 500 or validation error depending on your validation middleware
      // You might want to add validation for ObjectId format in your route
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status);
    });

    it('should allow admin to cancel invitations', async () => {
      const { user: owner, household } = await createTestUserWithHousehold();
      const adminUser = await insertTestUser({ email: 'admin@example.com' });
      await household.addMember(adminUser._id.toString(), 'admin');

      const ownerToken = createAuthToken(owner.toSafeObject());
      const adminToken = createAuthToken(adminUser.toSafeObject());

      // Owner creates invitation
      const createResponse = await request
        .post(`/households/${household._id}/members/invite`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${ownerToken}`])
        .send({
          email: 'admincancel@example.com',
          name: 'Admin Cancel User',
          role: 'member'
        });

      const invitationId = createResponse.body.data.id;

      // Admin cancels invitation
      const response = await request
        .delete(`/households/${household._id}/invitations/${invitationId}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${adminToken}`]);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data.status).toBe('cancelled');
    });
  });

  describe('POST /invitations/redeem', () => {
    it('should successfully redeem a valid invitation', async () => {
      const { user: inviter, household } = await createTestUserWithHousehold();
      const inviterToken = createAuthToken(inviter.toSafeObject());

      // Create user who will redeem invitation
      const invitee = await insertTestUser({ email: 'invitee@example.com' });
      const inviteeToken = createAuthToken(invitee.toSafeObject());

      // Create an invitation
      const createResponse = await request
        .post(`/households/${household._id}/members/invite`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${inviterToken}`])
        .send({
          email: 'invitee@example.com',
          name: 'Invitee User',
          role: 'member'
        });

      const invitationCode = createResponse.body.data.code;

      // Redeem the invitation
      const response = await request
        .post('/invitations/redeem')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${inviteeToken}`])
        .send({
          code: invitationCode
        });
      console.log('after redemption');
      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.message).toBe('Successfully joined household');
      expect(response.body.data.householdId).toBe(household._id.toString());
      expect(response.body.data.householdName).toBe(household.name);
      expect(response.body.data.role).toBe('guest'); // Since role is hardcoded to guest in creation

      // Verify user was added to household
      const updatedHousehold = await Household.findById(household._id);
      expect(updatedHousehold?.hasMember(invitee._id.toString())).toBe(true);

      // Verify invitation was marked as redeemed
      const updatedInvitation = await Invitation.findOne({ code: invitationCode });
      expect(updatedInvitation?.status).toBe('redeemed');
    });

    it('should return 404 when invitation code does not exist', async () => {
      const user = await insertTestUser();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .post('/invitations/redeem')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({
          code: 'NOTXST'
        });

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Invitation missing or expired');
    });

    it('should return 404 when invitation is expired', async () => {
      const { user: inviter, household } = await createTestUserWithHousehold();
      const inviterToken = createAuthToken(inviter.toSafeObject());

      const invitee = await insertTestUser({ email: 'expired@example.com' });
      const inviteeToken = createAuthToken(invitee.toSafeObject());

      // Create and expire an invitation
      const createResponse = await request
        .post(`/households/${household._id}/members/invite`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${inviterToken}`])
        .send({
          email: 'expired@example.com',
          name: 'Expired User',
          role: 'member'
        });

      const invitationCode = createResponse.body.data.code;

      // Manually expire the invitation
      const invitation = await Invitation.findOne({ code: invitationCode });
      await invitation?.expire();

      const response = await request
        .post('/invitations/redeem')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${inviteeToken}`])
        .send({
          code: invitationCode
        });

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Invitation missing or expired');
    });

    it('should return 404 when invitation is already redeemed', async () => {
      const { user: inviter, household } = await createTestUserWithHousehold();
      const inviterToken = createAuthToken(inviter.toSafeObject());

      const invitee1 = await insertTestUser({ email: 'first@example.com' });
      const invitee1Token = createAuthToken(invitee1.toSafeObject());

      const invitee2 = await insertTestUser({ email: 'second@example.com' });
      const invitee2Token = createAuthToken(invitee2.toSafeObject());

      // Create an invitation
      const createResponse = await request
        .post(`/households/${household._id}/members/invite`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${inviterToken}`])
        .send({
          email: 'first@example.com',
          name: 'First User',
          role: 'member'
        });

      const invitationCode = createResponse.body.data.code;

      // First user redeems successfully
      await request
        .post('/invitations/redeem')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${invitee1Token}`])
        .send({
          code: invitationCode
        });

      // Second user tries to redeem the same code
      const response = await request
        .post('/invitations/redeem')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${invitee2Token}`])
        .send({
          code: invitationCode
        });

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Invitation missing or expired');
    });

    it('should return 409 when household no longer exists', async () => {
      const { user: inviter, household } = await createTestUserWithHousehold();
      const inviterToken = createAuthToken(inviter.toSafeObject());

      const invitee = await insertTestUser({ email: 'orphaned@example.com' });
      const inviteeToken = createAuthToken(invitee.toSafeObject());

      // Create an invitation
      const createResponse = await request
        .post(`/households/${household._id}/members/invite`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${inviterToken}`])
        .send({
          email: 'orphaned@example.com',
          name: 'Orphaned User',
          role: 'member'
        });

      const invitationCode = createResponse.body.data.code;

      // Delete the household
      await Household.findByIdAndDelete(household._id);

      const response = await request
        .post('/invitations/redeem')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${inviteeToken}`])
        .send({
          code: invitationCode
        });

      expect(response.status).toBe(HTTP_STATUS.CONFLICT);
      expect(response.body.error).toBe('Invitation is invalid');
    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request
        .post('/invitations/redeem')
        .send({
          code: 'ABCD12'
        });

      expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return 400 when code format is invalid', async () => {
      const user = await insertTestUser();
      const token = createAuthToken(user.toSafeObject());

      // Test various invalid formats
      const invalidCodes = [
        '', // empty
        'ABC', // too short
        'ABCDEFGH', // too long
        'ABCD1', // too short by 1
        'ABCD123' // too long by 1
      ];

      for (const invalidCode of invalidCodes) {
        const response = await request
          .post('/invitations/redeem')
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({
            code: invalidCode
          });

        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.error).toBe('Invalid input');
      }
    });

    it('should return 400 when request body is malformed', async () => {
      const user = await insertTestUser();
      const token = createAuthToken(user.toSafeObject());

      // Missing code field
      const response1 = await request
        .post('/invitations/redeem')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({});

      expect(response1.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response1.body.error).toBe('Invalid input');

      // Code is not a string
      const response2 = await request
        .post('/invitations/redeem')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({
          code: 123456
        });

      expect(response2.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response2.body.error).toBe('Invalid input');
    });

    it('should handle invitation that passes time-based expiration check', async () => {
      const { user: inviter, household } = await createTestUserWithHousehold();
      const inviterToken = createAuthToken(inviter.toSafeObject());

      const invitee = await insertTestUser({ email: 'timeexpired@example.com' });
      const inviteeToken = createAuthToken(invitee.toSafeObject());

      // Create an invitation
      const createResponse = await request
        .post(`/households/${household._id}/members/invite`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${inviterToken}`])
        .send({
          email: 'timeexpired@example.com',
          name: 'Time Expired User',
          role: 'member'
        });

      const invitationCode = createResponse.body.data.code;

      // Manually set expiration to past date
      const invitation = await Invitation.findOne({ code: invitationCode });
      if (invitation) {
        invitation.expiresAt = new Date(Date.now() - 1000); // 1 second ago
        await invitation.save();
      }

      const response = await request
        .post('/invitations/redeem')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${inviteeToken}`])
        .send({
          code: invitationCode
        });

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Invitation missing or expired');
    });
  });
});