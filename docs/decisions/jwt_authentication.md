# Decision Record: JWT Authentication with User Data Caching

**Project:** HomeKeeper  
**Date:** May 31, 2025  
**Author:** Tom Joseph
**Version:** 1.1
**Context:** Node.js Express/React application using Passport.js for authentication

## Problem Statement

We need to decide how to handle user data retrieval for authenticated API requests in our authentication system. Key considerations include balancing performance (minimizing database calls) with data freshness and security.

## Options Considered

### Option 1: JWT with userId Only + Database Lookup
- **Approach:** JWT contains only userId, user data fetched from database on each API call
- **Pros:** Always fresh data, smaller JWT payload, more secure, easier session invalidation
- **Cons:** Database hit on every authenticated request, potentially higher latency

### Option 2: JWT with User Data Embedded
- **Approach:** JWT contains safe user model data, refreshed only on relevant updates
- **Pros:** Fewer database calls, faster API responses
- **Cons:** Stale data issues, larger JWT payload, complex refresh logic, security concerns

### Option 3: Dual Cookie Strategy
- **Approach:** Separate cookies for authentication and user data
- **Pros:** Flexibility in data management
- **Cons:** Increased complexity, multiple cookie management, still faces stale data issues

## Decision

**Selected: Option 1 with Caching Layer Enhancement**

Implement JWT tokens containing only the userId, and retrieve user data via database lookup enhanced by a Redis caching layer.

## Rationale

### Technical Benefits
- **Data Consistency:** Always serves current user data, critical for role-based access control
- **Security:** Minimal sensitive data in client-side storage
- **Performance:** Caching layer provides speed benefits without complexity of embedded data
- **Scalability:** Clean separation of concerns, easier to optimize independently
- **JWT Size:** Smaller tokens reduce network overhead and cookie size limits. Probably not a concern with the amount of data we're using, but still nice. 

### Implementation Approach
- JWT validation middleware extracts userId
- User data retrieval function checks Redis cache first
- Cache miss triggers database lookup and cache population
- Cache TTL set to 5 minutes for balance of performance and freshness
- Cache invalidation when user data updates

## Implementation Details

### Authentication Flow
```javascript
const getCachedUser = async (userId) => {
  let user = await cache.get(`user:${userId}`);
  if (!user) {
    user = await db.findUser(userId);
    await cache.set(`user:${userId}`, user, { ttl: 300 });
  }
  return user;
};
```

### Cache Management
- **Cache Key Pattern:** `user:{userId}`
- **TTL:** 300 seconds (5 minutes)
- **Invalidation:** Triggered on user profile updates, role changes, account status changes
- **Graceful Degradation:** Application continues to function if cache is unavailable

### Security Considerations
- Authentication and caching are separate concerns
- Cache stores non-sensitive user data only (NO PASSWORDS!)
- Logout doesn't require cache invalidation (JWT validation prevents access)
- Cache entries naturally expire, no session management required

## Consequences

### Positive
- **Performance:** Sub-millisecond user data retrieval for cached entries
- **Reliability:** Graceful degradation when cache is unavailable
- **Maintainability:** Clear separation between authentication and data retrieval
- **Security:** Reduced sensitive data exposure
- **Scalability:** Independent scaling of cache and database layers

### Negative
- **Infrastructure Complexity:** Requires Redis deployment and monitoring
- **Cache Management:** Need to implement proper invalidation strategies
- **Initial Implementation:** More complex than basic JWT-only approach