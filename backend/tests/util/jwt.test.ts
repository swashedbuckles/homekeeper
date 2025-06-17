import {describe, expect, it} from 'vitest';

import { createMockUser } from '../helpers/testDataUtils';
import {
  createAuthToken, 
  createRefreshToken, 
  updateTokenExpiration 
} from '../../src/utils/createJwt';
import { decodeJwt } from '../../src/utils/decodeJwt';


describe('JWT Utilities', () => {
  it('should be able to create an auth token', () => {
    const user  = createMockUser();
    const token = createAuthToken(user);

    expect(token).toBeTypeOf('string');
    const decoded = decodeJwt(token);

    expect(decoded.id).toEqual(user.id);
    expect(decoded.email).toEqual(user.email);
    expect(decoded.expiration).toBeTypeOf('number');
    expect(decoded.type).toEqual('user');
  });

  it('should be able to create a refresh token', () => {
    const user  = createMockUser();
    const token = createRefreshToken(user);

    expect(token).toBeTypeOf('string');
    const decoded = decodeJwt(token);

    expect(decoded.id).toEqual(user.id);
    expect(decoded.email).not.toBeDefined();
    expect(decoded.expiration).toBeTypeOf('number');
    expect(decoded.type).toEqual('refresh');
  });

  it('should be able to update expiration', async () => {
    const user    = createMockUser();
    const token   = createAuthToken(user);
    const refresh = createRefreshToken(user);

    const ogTokenExp = decodeJwt(token).expiration;
    const ogRefreshExp = decodeJwt(refresh).expiration;

    await new Promise(r => setTimeout(r, 50)); // too lazy for fake timers

    const newToken = updateTokenExpiration(token);
    expect(decodeJwt(newToken).expiration).toBeGreaterThan(ogTokenExp);

    const newRefresh = updateTokenExpiration(refresh);
    expect(decodeJwt(newRefresh).expiration).toBeGreaterThan(ogRefreshExp);
  });
});