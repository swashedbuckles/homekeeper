# Cache Management Strategy

**Status:** Accepted  
**Date:** 2025-01-26  
**Author:** Tom Joseph
**Version:** 1.0
**Context:** React front-end application using React (Tan Stack) Query for API request handling.

## Context

Manual cache management in React Query was causing cache consistency bugs, particularly when API mutations updated server state but failed to properly update the frontend cache. This led to stale UI states and required manual page refreshes to see updated data.

**Root Problem:** Components were responsible for both UI logic and cache management, leading to:
- Inconsistent cache updates across different components
- Easy-to-miss cache management when adding new API calls
- Cache update logic scattered throughout the codebase
- Type safety issues with manual cache operations

## Decision

**Centralize all cache management in the API layer** using a hybrid approach:

### Strategy 1: Simple Cache Updates
For operations that return complete, updated objects:
- **Direct cache replacement** for single object updates
- **Direct array operations** (add/remove) for list updates

### Strategy 2: Strategic Cache Invalidation  
For complex operations affecting multiple resources:
- **Cache invalidation** to trigger fresh data fetches
- **Global cache clearing** for auth state changes

## Implementation

### Cache Helper Architecture
```typescript
// /src/lib/util/cacheHelpers.ts
export const cacheHelpers = {
  // Simple updates
  updateMemberInList: (householdId, memberData) => { /* direct replacement */ },
  addInvitationToList: (householdId, invitationData) => { /* array append */ },
  
  // Strategic invalidation
  invalidateMembers: (householdId) => { /* invalidate query */ },
  clearAllCaches: () => { /* global clear */ }
};
```

### API Function Pattern
```typescript
export function updateResource(id, data) {
  return apiRequest(url, options).then(response => {
    if (response.data) {
      // Automatic cache management happens here
      cacheHelpers.updateResourceInCache(response.data);
    }
    return response;
  });
}
```

### Classification Rules

| Operation Type | Cache Strategy | Examples |
|---------------|----------------|----------|
| **Simple Updates** | Direct cache update | `setMemberRole()`, `createInvitation()`, `cancelInvitation()` |
| **Complex Multi-Resource** | Cache invalidation | `addMember()`, `removeMember()`, `redeemInvitation()` |
| **Resource Deletion** | Cache invalidation | `deleteHousehold()` |
| **Auth State Changes** | Global cache clear | `login()`, `logout()`, `register()` |

## Benefits

### Developer Experience
- **Components focus on UI only** - No cache management logic in components
- **Consistent pattern** - All API mutations follow the same cache management approach
- **Type safety** - Centralized helpers with proper TypeScript types
- **Easier testing** - Mock API functions, cache updates are automatic

### User Experience  
- **Real-time UI updates** - Changes appear immediately without refreshes
- **Consistent state** - Cache always matches server state
- **Faster perceived performance** - Instant feedback on simple operations

### Maintenance
- **Bug prevention** - Eliminates entire class of cache consistency bugs
- **Future-proof** - New API functions automatically follow established patterns
- **Centralized logic** - Cache behavior defined in one place

## Trade-offs

### Accepted Trade-offs
- **Slightly more complex API functions** - Each mutation includes cache management
- **Additional network requests** - Complex operations trigger fresh fetches instead of optimistic updates

### Rejected Alternatives
- **Manual cache management in components** - Too error-prone, poor separation of concerns
- **Optimistic updates for complex operations** - High complexity, difficult to maintain consistency
- **No cache management** - Poor user experience, constant loading states

## Implementation Status

### Completed
- Cache helper utilities (`/src/lib/util/cacheHelpers.ts`)
- Household management (`updateHousehold`, `createHousehold`, `deleteHousehold`)
- Member management (`setMemberRole`, `addMember`, `removeMember`)
- Invitation management (`createInvitation`, `cancelInvitation`, `redeemInvitation`)
- Auth operations (`login`, `register`, `logout`)

### Future Considerations
- **Offline support** - Consider adding optimistic updates with rollback for offline scenarios
- **Real-time updates** - WebSocket integration could complement this cache strategy
- **Performance monitoring** - Track cache hit rates and invalidation frequency

## Guidelines for New API Functions

1. **Determine complexity**: Does the operation affect multiple resources or have side effects?
2. **Choose strategy**:
   - **Simple response = Direct cache update**
   - **Complex/Multi-resource = Cache invalidation**
3. **Use existing helpers**: Leverage `cacheHelpers` for consistent implementation
4. **Document edge cases**: Note any special cache handling requirements

## References

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Cache Invalidation Strategies](https://web.dev/cache-invalidation/)
- Related ADR: `authentication.md` (auth state management)