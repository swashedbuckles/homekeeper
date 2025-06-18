import { describe, expect, it, vi } from 'vitest';
import { Types } from 'mongoose';

import { HTTP_STATUS, JWT_COOKIE_NAME } from '../../src/constants';
import { Household } from '../../src/models/household';
import { createAuthToken } from '../../src/utils/createJwt';
import { request } from '../helpers/app';
import { createTestUserWithHousehold, insertTestUser } from '../helpers/testDataUtils';

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
});