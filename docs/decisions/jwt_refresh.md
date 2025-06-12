# Design Decision: JWT Refresh Token Implementation

**Project:** HomeKeeper  
**Date:** June 11, 2025  
**Author:** Development Team Discussion
**Version:** 1.0
**Context:** Node.js Express/React application with JWT authentication in HTTP-only cookies

## Problem Statement

Current JWT implementation has a 10-minute expiration time (`JWT_EXPIRE_TIME_MS = 10 * 60 * 1000`) with no refresh mechanism. This results in users being logged out every 10 minutes, creating poor user experience. We need to implement a JWT refresh token system that maintains security while providing seamless user sessions.

## Current Authentication Architecture

- **JWT Access Tokens**: 10-minute expiration, stored in HTTP-only cookies
- **CSRF Tokens**: Session-based, stored in HTTP-only cookies  
- **Cookie-Based Transport**: All authentication handled via HTTP-only cookies for XSS protection
- **Stateless Design**: No server-side session storage

## Options Considered

### Option 1: Extend JWT Lifetime
- **Approach:** Increase JWT expiration to hours/days, eliminate refresh tokens
- **Pros:** Simple implementation, no additional complexity
- **Cons:** Security risk of long-lived tokens, no immediate revocation capability

### Option 2: Database-Stored Refresh Tokens
- **Approach:** Generate random refresh tokens, store in database with user mapping
- **Pros:** Immediate revocation, granular control, audit trail
- **Cons:** Introduces server state, database overhead, complexity

### Option 3: JWT-Based Refresh Tokens  
- **Approach:** Use JWTs for both access and refresh tokens, different expiration times
- **Pros:** Maintains stateless architecture, consistent token format, simple implementation
- **Cons:** No immediate revocation without blacklisting

## Decision: JWT-Based Refresh Tokens

**Selected Option 3** for the MVP implementation.

### Rationale

1. **Architectural Consistency**: Maintains existing stateless JWT architecture
2. **Implementation Simplicity**: Reuses existing JWT infrastructure and validation logic
3. **Cookie Alignment**: Consistent with current HTTP-only cookie strategy
4. **MVP Appropriate**: Balances security and implementation complexity for initial release
5. **Future Extensibility**: Can migrate to database-stored tokens later if needed

## Implementation Specification

### Token Types and Lifecycles

**Access Token (JWT)**
- **Purpose**: API authentication and authorization
- **Expiration**: 10 minutes (unchanged)
- **Claims**: `{id, email, expiration}`
- **Storage**: HTTP-only cookie named `jwt`

**Refresh Token (JWT)**  
- **Purpose**: Obtaining new access tokens
- **Expiration**: 7 days
- **Claims**: `{id, type: 'refresh', expiration}`
- **Storage**: HTTP-only cookie named `refresh_token`

### Endpoint Design

**`POST /auth/refresh`**

**Request Requirements:**
- JWT access token in `jwt` cookie (expired tokens acceptable)
- Refresh token in `refresh_token` cookie
- No request body required

**Success Response (200):**
```json
{
  "data": null,
  "message": "Token refreshed successfully"
}
```

**Response Actions:**
- Generate new JWT access token → set `jwt` cookie
- Generate new refresh token → set `refresh_token` cookie (token rotation)
- CSRF token remains unchanged

**Error Response (401):**
- Missing, invalid, or expired refresh token
- Clear all authentication cookies (`jwt`, `refresh_token`)
- Force client logout state

### Security Features

**Token Rotation**: Each refresh operation issues new refresh token (best practice for detecting token theft)

**Validation Chain**:
1. Verify refresh token exists in cookie
2. Validate JWT signature and expiration
3. Confirm token type is 'refresh'
4. Retrieve user and generate new token pair

**Error Handling**: Any refresh failure clears all auth cookies and forces logout

### Cookie Configuration

**Refresh Token Cookie:**
```javascript
{
  httpOnly: true,                               // XSS protection
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production  
  sameSite: 'Lax',                             // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000              // 7 days
}
```

### CSRF Token Handling

**Design Decision**: CSRF tokens remain unchanged during token refresh.

**Rationale**: CSRF tokens represent "trusted origin" rather than "authenticated user." Since the user session continues and the origin hasn't changed, CSRF token rotation is unnecessary and adds complexity.

### Frontend Integration

**ApiClient Responsibility**: Automatic 401 error handling with transparent token refresh and request retry.

**Implementation Pattern**:
- Response interceptor detects 401 errors
- Calls `/auth/refresh` endpoint automatically  
- Retries original request on successful refresh
- Clears auth state and redirects on refresh failure

### Logout Flow

**Enhanced Logout**: Clear all authentication cookies
```javascript
res.clearCookie('jwt');
res.clearCookie('refresh_token');
// CSRF cookie cleared on logout
```

## Implementation Phases

### Phase 1: Backend Refresh Infrastructure
1. Update login/register endpoints to issue refresh tokens
2. Implement `/auth/refresh` endpoint
3. Update logout to clear refresh token cookies

### Phase 2: Frontend Integration  
1. Add response interceptor to apiClient for 401 handling
2. Implement automatic refresh and retry logic
3. Add request queuing for concurrent API calls during refresh

### Phase 3: Testing and Refinement
1. Test token expiration scenarios
2. Validate concurrent request handling
3. Error flow testing (expired refresh tokens, network failures)

## Trade-offs Accepted

### Security Trade-offs
- **No Immediate Revocation**: JWT refresh tokens cannot be revoked without implementing blacklisting
- **Token Theft Window**: 7-day refresh token lifetime creates longer exposure window if stolen

### Complexity Trade-offs
- **Request Queuing**: Frontend must handle multiple simultaneous API calls during refresh
- **Error State Management**: Complex error scenarios when refresh fails mid-session

### Future Migration Path
- Database-stored refresh tokens can be implemented later for enhanced security
- Blacklisting infrastructure can be added for immediate revocation
- Token rotation detection can be enhanced for theft detection

## Success Metrics

- **User Experience**: Users remain logged in for extended periods without re-authentication
- **Security**: No increase in authentication-related security incidents
- **Performance**: Minimal impact on API response times from refresh logic
- **Reliability**: Graceful handling of token expiration scenarios

## Conclusion

JWT-based refresh tokens provide an optimal balance of security, user experience, and implementation complexity for the HomeKeeper MVP. This approach maintains architectural consistency while solving the immediate problem of frequent user logouts. The stateless design preserves scalability benefits while the HTTP-only cookie storage maintains strong XSS protection.

The implementation can be enhanced with additional security features as the application matures, making this a pragmatic foundation for long-term authentication strategy.