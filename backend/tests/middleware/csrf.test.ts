import crypto from 'node:crypto';

import type { NextFunction, Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { csrfProtection, generateCSRFToken } from '../../src/middleware/csrf';

describe('CSRF Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: typeof vi.fn;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      method: 'GET',
      headers: {},
      cookies: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateCSRFToken', () => {
    it('should generate a 64-character hex string', () => {
      const token = generateCSRFToken();

      expect(token).toMatch(/^[a-f0-9]{64}$/);
      expect(token.length).toBe(64);
    });

    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();

      expect(token1).not.toBe(token2);
    });

    it('should use crypto.randomBytes correctly', () => {
      const mockRandomBytes = vi.spyOn(crypto, 'randomBytes');
      mockRandomBytes.mockImplementation(() => Buffer.from('a'.repeat(32)));

      const token = generateCSRFToken();

      expect(mockRandomBytes).toHaveBeenCalledWith(32);
      expect(token).toBe('61'.repeat(32));
    });
  });

  describe('csrfProtection middleware', () => {
    describe('Safe HTTP methods (GET, HEAD, OPTIONS)', () => {
      ['GET', 'HEAD', 'OPTIONS'].forEach((method) => {
        it(`should pass through ${method} requests without CSRF validation`, () => {
          mockReq.method = method;

          csrfProtection(mockReq as Request, mockRes as Response, mockNext);

          expect(mockNext).toHaveBeenCalledWith();
          expect(mockRes.status).not.toHaveBeenCalled();
          expect(mockRes.json).not.toHaveBeenCalled();
        });
      });
    });

    describe('State-changing HTTP methods (POST, PUT, DELETE, PATCH)', () => {
      ['POST', 'PUT', 'DELETE', 'PATCH'].forEach((method) => {
        describe(`${method} requests`, () => {
          beforeEach(() => {
            mockReq.method = method;
          });

          it('should return 403 when no CSRF token in header', () => {
            mockReq.headers = {};
            mockReq.cookies = { csrfToken: 'valid-token' };

            csrfProtection(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' });
            expect(mockNext).not.toHaveBeenCalled();
          });

          it('should return 403 when no CSRF token in cookie', () => {
            mockReq.headers = { 'x-csrf-token': 'valid-token' };
            mockReq.cookies = {};

            csrfProtection(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' });
            expect(mockNext).not.toHaveBeenCalled();
          });

          it('should return 403 when tokens do not match', () => {
            mockReq.headers = { 'x-csrf-token': 'header-token' };
            mockReq.cookies = { csrfToken: 'cookie-token' };

            csrfProtection(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' });
            expect(mockNext).not.toHaveBeenCalled();
          });

          it('should call next() when tokens match', () => {
            const token = 'matching-token';
            mockReq.headers = { 'x-csrf-token': token };
            mockReq.cookies = { csrfToken: token };

            csrfProtection(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith();
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
          });

          it('should handle empty string tokens as invalid', () => {
            mockReq.headers = { 'x-csrf-token': '' };
            mockReq.cookies = { csrfToken: '' };

            csrfProtection(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' });
            expect(mockNext).not.toHaveBeenCalled();
          });

          it('should handle undefined tokens', () => {
            mockReq.headers = { 'x-csrf-token': undefined };
            mockReq.cookies = { csrfToken: undefined };

            csrfProtection(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' });
            expect(mockNext).not.toHaveBeenCalled();
          });

          it('should handle null tokens', () => {
            mockReq.headers = { 'x-csrf-token': void 0 };
            mockReq.cookies = { csrfToken: null };

            csrfProtection(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' });
            expect(mockNext).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('Edge cases', () => {
      it('should handle missing headers object', () => {
        mockReq.method = 'POST';
        mockReq.headers = undefined;
        mockReq.cookies = { csrfToken: 'token' };

        csrfProtection(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('should handle missing cookies object', () => {
        mockReq.method = 'POST';
        mockReq.headers = { 'x-csrf-token': 'token' };
        mockReq.cookies = undefined;

        csrfProtection(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('should be case-sensitive for header name', () => {
        mockReq.method = 'POST';
        mockReq.headers = { 'X-CSRF-TOKEN': 'token' }; // uppercase
        mockReq.cookies = { csrfToken: 'token' };

        csrfProtection(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('should handle whitespace in tokens', () => {
        mockReq.method = 'POST';
        mockReq.headers = { 'x-csrf-token': ' token ' };
        mockReq.cookies = { csrfToken: 'token' };

        csrfProtection(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('should handle numeric tokens', () => {
        const token = '12345';
        mockReq.method = 'POST';
        mockReq.headers = { 'x-csrf-token': token };
        mockReq.cookies = { csrfToken: token };

        csrfProtection(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
      });
    });

    describe('Integration scenarios', () => {
      it('should work with real generated tokens', () => {
        const token = generateCSRFToken();
        mockReq.method = 'POST';
        mockReq.headers = { 'x-csrf-token': token };
        mockReq.cookies = { csrfToken: token };

        csrfProtection(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
      });

      it('should reject when using different generated tokens', () => {
        const token1 = generateCSRFToken();
        const token2 = generateCSRFToken();

        mockReq.method = 'PUT';
        mockReq.headers = { 'x-csrf-token': token1 };
        mockReq.cookies = { csrfToken: token2 };

        csrfProtection(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' });
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
  });

  describe('CSRF constant validation', () => {
    it('should protect all state-changing methods', () => {
      // This test ensures we don't miss any HTTP methods that should be protected
      const protectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
      const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

      protectedMethods.forEach((method) => {
        mockReq.method = method;
        mockReq.headers = {};
        mockReq.cookies = {};

        const mockNextLocal = vi.fn();
        csrfProtection(mockReq as Request, mockRes as Response, mockNextLocal);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockNextLocal).not.toHaveBeenCalled();
      });

      safeMethods.forEach((method) => {
        mockReq.method = method;
        mockReq.headers = {};
        mockReq.cookies = {};

        const mockNextLocal = vi.fn();
        csrfProtection(mockReq as Request, mockRes as Response, mockNextLocal);

        expect(mockNextLocal).toHaveBeenCalledWith();
      });
    });
  });
});
