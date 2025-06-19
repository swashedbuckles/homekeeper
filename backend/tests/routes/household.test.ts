/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from 'vitest';
import { Types } from 'mongoose';

import { HTTP_STATUS, JWT_COOKIE_NAME } from '../../src/constants';
import { Household } from '../../src/models/household';
import { createAuthToken } from '../../src/utils/createJwt';
import { request } from '../helpers/app';
import { createTestUserWithHousehold, insertTestUser } from '../helpers/testDataUtils';
import { User } from '../../src/models/user';

describe('Household Routes (Integration)', () => {
  describe('GET /', () => {
    it('should return households for authenticated user', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .get('/households')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send();

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(household._id.toString());

    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request.get('/households');

      expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return empty array when user has no households', async () => {
      const user = await insertTestUser({ email: 'nohouseholds@example.com' });
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .get('/households')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('POST /', () => {
    const validHouseholdData = {
      name: 'New Household',
      description: 'A new household'
    };

    it('should create a household with valid data', async () => {
      const user = await insertTestUser();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .post('/households')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send(validHouseholdData);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data.name).toBe(validHouseholdData.name);
      expect(response.body.data.description).toBe(validHouseholdData.description);
      expect(response.body.data.ownerId.toString()).toBe(user._id.toString());
      expect(response.body.data.members).toHaveLength(1);
      expect(response.body.data.members[0].toString()).toBe(user._id.toString());

      // Verify in database
      const savedHousehold = await Household.findById(response.body.data._id);
      expect(savedHousehold).toBeTruthy();
      expect(savedHousehold?.name).toBe(validHouseholdData.name);
    });

    it('should create a household without description', async () => {
      const user = await insertTestUser();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .post('/households')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({ name: 'Minimal Household' });

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data.name).toBe('Minimal Household');
      expect(response.body.data.description).toBeUndefined();
    });

    it('should return 400 when name is missing', async () => {
      const user = await insertTestUser();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .post('/households')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({ description: 'Missing name' });

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 400 when name is not a string', async () => {
      const user = await insertTestUser();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .post('/households')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({ name: 123, description: 'Invalid name type' });

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 400 when description is not a string', async () => {
      const user = await insertTestUser();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .post('/households')
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({ name: 'Valid Name', description: 123 });

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request
        .post('/households')
        .send(validHouseholdData);

      expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('GET /:id', () => {
    it('should return household when user is a member', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .get(`/households/${household._id}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data._id.toString()).toBe(household._id.toString());
      expect(response.body.data.name).toBe(household.name);
    });

    it('should return 404 when household does not exist', async () => {
      const user = await insertTestUser();
      const token = createAuthToken(user.toSafeObject());
      const nonExistentId = new Types.ObjectId();

      const response = await request
        .get(`/households/${nonExistentId}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Household not found');
    });

    it('should return 404 when user is not a member', async () => {
      const { household } = await createTestUserWithHousehold();
      const nonMemberUser = await insertTestUser({ email: 'nonmember@example.com' });
      const token = createAuthToken(nonMemberUser.toSafeObject());

      const response = await request
        .get(`/households/${household._id}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Household not found');
    });

    it('should return 401 when user is not authenticated', async () => {
      const { household } = await createTestUserWithHousehold();

      const response = await request.get(`/households/${household._id}`);

      expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('PUT /:id', () => {
    const updateData = {
      name: 'Updated Household',
      description: 'Updated description'
    };

    it('should update household when user is owner', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .put(`/households/${household._id}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send(updateData);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);

      // Verify in database
      const updatedHousehold = await Household.findById(household._id);
      expect(updatedHousehold?.name).toBe(updateData.name);
      expect(updatedHousehold?.description).toBe(updateData.description);
    });

    it('should update household without description', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .put(`/households/${household._id}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({ name: 'Updated Name Only' });

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data.name).toBe('Updated Name Only');
      expect(response.body.data.description).toBe(household.description);
    });

    it('should return 400 when name is missing', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .put(`/households/${household._id}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({ description: 'Missing name' });

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 400 when name is not a string', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .put(`/households/${household._id}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({ name: 123 });

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 401 when user is not authenticated', async () => {
      const { household } = await createTestUserWithHousehold();

      const response = await request
        .put(`/households/${household._id}`)
        .send(updateData);

      expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return 403 when user is not the owner', async () => {
      const { user: owner, household } = await createTestUserWithHousehold();
      const memberUser = await insertTestUser({ email: 'member@example.com' });

      // Add member to household with 'member' role
      await household.addMember(memberUser._id.toString(), 'member');
      const token = createAuthToken(memberUser.toSafeObject());

      const updateData = {
        name: 'Member trying to update',
        description: 'Should fail'
      };

      const response = await request
        .put(`/households/${household._id}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send(updateData);

      expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
      expect(response.body.error).toBe('Forbidden');
    });
  });

  describe('DELETE /:id', () => {
    it('should delete household when user is owner', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      const response = await request
        .delete(`/households/${household._id}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.NO_CONTENT);

      // Verify deletion in database
      const deletedHousehold = await Household.findById(household._id);
      expect(deletedHousehold).toBeNull();
    });

    it('should return 404 when household does not exist', async () => {
      const user = await insertTestUser();
      const token = createAuthToken(user.toSafeObject());
      const nonExistentId = new Types.ObjectId();

      const response = await request
        .delete(`/households/${nonExistentId}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.error).toBe('Household not found');
    });

    it('should return 401 when user is not authenticated', async () => {
      const { household } = await createTestUserWithHousehold();

      const response = await request.delete(`/households/${household._id}`);

      expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return 403 when user is not the owner', async () => {
      const { user: owner, household } = await createTestUserWithHousehold();
      const memberUser = await insertTestUser({ email: 'member@example.com' });

      // Add member to household with 'member' role
      await household.addMember(memberUser._id.toString(), 'member');
      const token = createAuthToken(memberUser.toSafeObject());

      const updateData = {
        name: 'Member trying to update',
        description: 'Should fail'
      };

      const response = await request
        .delete(`/households/${household._id}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send(updateData);

      expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
      expect(response.body.error).toBe('Forbidden');
    });
  });

  describe('ownership verification', () => {
    it('should correctly compare ObjectIds for ownership in PUT', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      // Ensure we're testing with actual ObjectIds
      expect(household.ownerId).toBeInstanceOf(Types.ObjectId);
      expect(user._id).toBeInstanceOf(Types.ObjectId);

      const response = await request
        .put(`/households/${household._id}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
        .send({ name: 'Ownership Test' });

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.data.name).toBe('Ownership Test');
    });

    it('should correctly compare ObjectIds for ownership in DELETE', async () => {
      const { user, household } = await createTestUserWithHousehold();
      const token = createAuthToken(user.toSafeObject());

      // Ensure we're testing with actual ObjectIds
      expect(household.ownerId).toBeInstanceOf(Types.ObjectId);
      expect(user._id).toBeInstanceOf(Types.ObjectId);

      const response = await request
        .delete(`/households/${household._id}`)
        .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

      expect(response.status).toBe(HTTP_STATUS.NO_CONTENT);
    });
  });

  describe('Household Membership Routes (Integration)', () => {
    describe('GET /:id/members', () => {
      it('should return all members when user has permission', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());

        // Add another member to make it more interesting
        const memberUser = await insertTestUser({ email: 'member@example.com' });
        await household.addMember(memberUser._id.toString(), 'member');

        const response = await request
          .get(`/households/${household._id}/members`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body.data.memberCount).toBe(2);
        expect(response.body.data.members).toHaveLength(2);

        const ownerMember = response.body.data.members.find(m => m.role === 'owner');
        const regularMember = response.body.data.members.find(m => m.role === 'member');

        expect(ownerMember).toBeDefined();
        expect(ownerMember.id).toBe(user._id.toString());
        expect(regularMember).toBeDefined();
        expect(regularMember.id).toBe(memberUser._id.toString());
      });

      it('should return 401 when user is not authenticated', async () => {
        const { household } = await createTestUserWithHousehold();

        const response = await request.get(`/households/${household._id}/members`);

        expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      });

      it('should return 404 when user is not a member of household', async () => {
        const { household } = await createTestUserWithHousehold();
        const outsideUser = await insertTestUser({ email: 'outside@example.com' });
        const token = createAuthToken(outsideUser.toSafeObject());

        const response = await request
          .get(`/households/${household._id}/members`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

        expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      });
    });

    describe('PUT /:id/members', () => {
      it('should add a new member with valid data', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());
        const newMember = await insertTestUser({ email: 'newmember@example.com' });

        const response = await request
          .put(`/households/${household._id}/members`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({
            userId: newMember._id.toString(),
            role: 'member'
          });

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body.data).toHaveLength(2);

        const addedMember = response.body.data.find(m => m.id === newMember._id.toString());
        expect(addedMember).toBeDefined();
        expect(addedMember.role).toBe('member');

        // Verify in database
        const updatedHousehold = await Household.findById(household._id);
        expect(updatedHousehold?.hasMember(newMember._id.toString())).toBe(true);
      });

      it('should return 400 when trying to add owner role', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());
        const newMember = await insertTestUser({ email: 'newmember@example.com' });

        const response = await request
          .put(`/households/${household._id}/members`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({
            userId: newMember._id.toString(),
            role: 'owner'
          });

        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.error).toBe('Role not allowed');
      });

      it('should return 409 when user is already a member', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());

        const response = await request
          .put(`/households/${household._id}/members`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({
            userId: user._id.toString(),
            role: 'member'
          });

        expect(response.status).toBe(HTTP_STATUS.CONFLICT);
        expect(response.body.error).toBe('User already part of household');
      });

      it('should return 400 with invalid validation data', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());

        const response = await request
          .put(`/households/${household._id}/members`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({
            userId: 'invalid-id',
            role: 'invalid-role'
          });

        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.error).toBe('Invalid input');
      });
    });

    describe('GET /:id/member/:userId', () => {
      it('should return member details when user exists', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());
        const memberUser = await insertTestUser({ email: 'member@example.com' });
        await household.addMember(memberUser._id.toString(), 'admin');

        const response = await request
          .get(`/households/${household._id}/member/${memberUser._id}`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body.data).toEqual({
          id: memberUser._id.toString(),
          name: memberUser.name,
          role: 'admin'
        });
      });

      it('should return 404 when user does not exist', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());
        const fakeUserId = new Types.ObjectId();

        const response = await request
          .get(`/households/${household._id}/member/${fakeUserId}`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

        expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
        expect(response.body.error).toBe('User not found');
      });
    });

    describe('PUT /:id/members/:userId/role', () => {
      it('should update member role successfully', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());
        const memberUser = await insertTestUser({ email: 'member@example.com' });
        await household.addMember(memberUser._id.toString(), 'member');

        const response = await request
          .put(`/households/${household._id}/members/${memberUser._id}/role`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({ role: 'admin' });

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body.data).toEqual({
          id: memberUser._id.toString(),
          name: memberUser.name,
          role: 'admin'
        });

        // Verify in database
        const updatedUser = await User.findById(memberUser._id);
        expect(updatedUser?.householdRoles.get(household._id.toString())).toBe('admin');
      });

      it('should return 400 when trying to set owner role', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());
        const memberUser = await insertTestUser({ email: 'member@example.com' });
        await household.addMember(memberUser._id.toString(), 'member');

        const response = await request
          .put(`/households/${household._id}/members/${memberUser._id}/role`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({ role: 'owner' });

        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.error).toBe('Role not allowed');
      });

      it('should return 404 when user does not exist', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());
        const fakeUserId = new Types.ObjectId();

        const response = await request
          .put(`/households/${household._id}/members/${fakeUserId}/role`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({ role: 'admin' });

        expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
        expect(response.body.error).toBe('User not found');
      });
    });

    describe('DELETE /:id/members/:userId', () => {
      it('should remove member successfully', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());
        const memberUser = await insertTestUser({ email: 'member@example.com' });
        await household.addMember(memberUser._id.toString(), 'member');

        // Verify member exists before removal
        expect(household.hasMember(memberUser._id.toString())).toBe(true);

        const response = await request
          .delete(`/households/${household._id}/members/${memberUser._id}`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body.data.memberCount).toBe(1); // Only owner remains
        expect(response.body.data.members).toHaveLength(1);
        expect(response.body.data.members[0].id).toBe(user._id.toString());

        // Verify in database
        const updatedHousehold = await Household.findById(household._id);
        expect(updatedHousehold?.hasMember(memberUser._id.toString())).toBe(false);

        const updatedUser = await User.findById(memberUser._id);
        expect(updatedUser?.householdRoles.get(household._id.toString())).toBeUndefined();
      });

      it('should return 404 when user does not exist', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());
        const fakeUserId = new Types.ObjectId();

        const response = await request
          .delete(`/households/${household._id}/members/${fakeUserId}`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

        expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
        expect(response.body.error).toBe('User not found');
      });
    });

    describe('POST /:id/members/invite', () => {
      it('should accept invitation request with valid data', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());

        const response = await request
          .post(`/households/${household._id}/members/invite`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({
            email: 'newuser@example.com',
            name: 'New User',
            role: 'member'
          });

        expect(response.status).toBe(HTTP_STATUS.ACCEPTED);
      });

      it('should return 400 when trying to invite as owner', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());

        const response = await request
          .post(`/households/${household._id}/members/invite`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({
            email: 'newuser@example.com',
            name: 'New User',
            role: 'owner'
          });

        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.error).toBe('Role not allowed');
      });

      it('should return 400 with invalid email', async () => {
        const { user, household } = await createTestUserWithHousehold();
        const token = createAuthToken(user.toSafeObject());

        const response = await request
          .post(`/households/${household._id}/members/invite`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({
            email: 'invalid-email',
            name: 'New User',
            role: 'member'
          });

        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.error).toBe('Invalid input');
      });
    });

    describe('Permission-based access control', () => {
      it('should return 403 when member tries to add other members', async () => {
        const { user: owner, household } = await createTestUserWithHousehold();
        const memberUser = await insertTestUser({ email: 'member@example.com' });
        await household.addMember(memberUser._id.toString(), 'member');

        const token = createAuthToken(memberUser.toSafeObject());
        const newUser = await insertTestUser({ email: 'new@example.com' });

        const response = await request
          .put(`/households/${household._id}/members`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
          .send({
            userId: newUser._id.toString(),
            role: 'member'
          });

        expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
        expect(response.body.error).toBe('Forbidden');
      });

      it('should return 403 when guest tries to view members', async () => {
        const { user: owner, household } = await createTestUserWithHousehold();
        const guestUser = await insertTestUser({ email: 'guest@example.com' });
        await household.addMember(guestUser._id.toString(), 'guest');

        const token = createAuthToken(guestUser.toSafeObject());

        const response = await request
          .get(`/households/${household._id}/members`)
          .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`]);

        expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
        expect(response.body.error).toBe('Forbidden');
      });
    });
  });
});