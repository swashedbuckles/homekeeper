# Architecture Overview

**Project:** HomeKeeper  
**Date:** May 29, 2025  
**Author:** Tom Joseph  
**Version:** 1.0

## Purpose

This document provides a comprehensive overview of HomeKeeper's system architecture, including technology choices, deployment patterns, data flow, and integration points. It serves as the primary reference for understanding how all components work together.

## System Overview

HomeKeeper is a full-stack web application designed to help households organize maintenance documentation and schedules. The system follows a microservices-ready architecture with clear separation between frontend, backend API, and data layers.

### High-Level Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Mobile Client  │    │   Web Browser   │
│   (TypeScript)  │    │ (React Native)  │    │   (Any Device)  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Load Balancer       │
                    │    (Future: nginx)      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    Express.js API       │
                    │   (Node.js/TypeScript)  │
                    │                         │
                    │  ┌─────────────────┐    │
                    │  │   Auth Service  │    │
                    │  │  (JWT Cookies)  │    │
                    │  └─────────────────┘    │
                    │                         │
                    │  ┌─────────────────┐    │
                    │  │  File Service   │    │
                    │  │   (S3/Local)    │    │
                    │  └─────────────────┘    │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼───────┐    ┌─────────▼───────┐    ┌─────────▼───────┐
│    MongoDB      │    │  Elasticsearch  │    │     Redis       │
│  (Primary DB)   │    │   (Search)      │    │   (Sessions)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend Architecture

**Framework:** React 19.1.0 with TypeScript

- **Build Tool:** Vite 6.3.5 for fast development and optimized builds
- **Styling:** CSS with planned migration to Tailwind CSS
- **State Management:** React hooks (useState, useContext) for MVP, Redux Toolkit for complex state
- **HTTP Client:** Fetch API with planned upgrade to React Query
- **Authentication:** HTTP-only cookies with automatic inclusion

**Key Design Decisions:**

- TypeScript for type safety and better developer experience
- Vite for faster builds and hot module replacement
- Component-based architecture for reusability
- Mobile-first responsive design

### Backend Architecture

**Framework:** Express.js with TypeScript

- **Authentication:** Passport.js with JWT stored in HTTP-only cookies
- **Validation:** Zod for runtime type checking and input validation
- **Security:** Helmet.js for security headers, bcrypt for password hashing
- **File Processing:** Multer for uploads, planned OCR integration
- **Logging:** Morgan for HTTP request logging

**Key Design Decisions:**

- RESTful API design for simplicity and standards compliance
- JWT in HTTP-only cookies for XSS protection while maintaining stateless architecture
- Mongoose ODM for MongoDB integration with strong typing
- Service layer pattern for business logic separation

### Data Layer

**Primary Database:** MongoDB 8.0

- Document-oriented storage ideal for varied manual formats
- Mongoose ODM provides schema validation and type safety
- Supports flexible querying and indexing strategies

**Search Engine:** Elasticsearch 7.14.0

- Full-text search across manual content and metadata
- OCR text indexing for searchable document content
- Aggregations for analytics and filtering

**Cache Layer:** Redis (Optional)

- Session storage for future session-based features
- Rate limiting storage
- Temporary data caching

**File Storage:** AWS S3 (with LocalStack for development)

- Scalable storage for uploaded manuals and documents
- CDN-ready for fast global access
- Presigned URLs for secure direct uploads

## Authentication & Authorization Architecture

### JWT Cookie Authentication Flow

```
┌──────────┐    ┌─────────────┐    ┌──────────────┐
│  Client  │    │   API       │    │   Database   │
└─────┬────┘    └─────┬───────┘    └──────┬───────┘
      │               │                   │
      │ POST /login   │                   │
      │ {email, pass} │                   │
      ├──────────────►│                   │
      │               │ Hash & Compare    │
      │               ├──────────────────►│
      │               │ User Found        │
      │               │◄──────────────────┤
      │               │ Generate JWT      │
      │ Set Cookie    │ (HTTP-only)       │
      │◄──────────────┤                   │
      │               │                   │
      │ GET /api/data │                   │
      │ (Cookie Auto) │                   │
      ├──────────────►│ Verify JWT        │
      │               │ Extract User      │
      │               │ Check Permissions │
      │ Response      │                   │
      │◄──────────────┤                   │
```

### Role-Based Access Control (RBAC)

**Household-Centric Permissions:**

- Users belong to households with specific roles
- Roles: Owner > Admin > Member > Guest
- Capabilities are mapped to roles server-side
- Permission checks on every protected endpoint

**Implementation Pattern:**

```typescript
// Middleware for protected routes
const requireHouseholdCapability = (capability: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { householdId } = req.params;
    if (!hasHouseholdCapability(req.user, capability, householdId)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
```

## Data Architecture

### Data Models Overview

**Core Entities:**

- **User:** Authentication and preferences
- **Household:** Organizational container for all data
- **Asset:** Physical items requiring maintenance
- **Manual:** Uploaded documentation with OCR text
- **Task:** Maintenance activities with scheduling
- **CustomDocument:** User-created instructions

**Relationship Patterns:**

- **Household-Centric:** All major entities belong to a household
- **User-Asset Flexibility:** Users can belong to multiple households
- **Optional Associations:** Assets can reference manuals/tasks/documents
- **Audit Trail:** All entities track creation and modification

### Database Schema Design

**Indexing Strategy:**

```javascript
// Performance-critical indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.manuals.createIndex({ householdId: 1 });
db.manuals.createIndex({ title: "text", extractedText: "text" });
db.tasks.createIndex({ "schedule.nextOccurrence": 1 });
db.assets.createIndex({ householdId: 1 });
```

**Data Validation:**

- Mongoose schemas with TypeScript interfaces
- Zod validation for API inputs
- Client-side validation for user experience

## Development & Deployment Architecture

### Containerization Strategy

**Docker Compose Services:**

- **Frontend:** Node.js development server with hot reload
- **Backend:** Express.js API with TypeScript compilation
- **MongoDB:** Primary database with authentication
- **Elasticsearch:** Search engine with single-node configuration
- **Redis:** Optional caching layer
- **LocalStack:** AWS services simulation for development

**Volume Strategy:**

- Source code mounted for development hot reload
- Persistent volumes for database data
- Separate node_modules volumes for performance

### Environment Configuration

**Environment Separation:**

- `.env.example` for documentation
- `.env.test` for testing environment
- Production environment variables managed separately

**Configuration Management:**

- Environment-specific database connections
- AWS service endpoints (LocalStack vs. production)
- JWT secrets and security configurations

### CI/CD Pipeline (Planned)

**Testing Strategy:**

- Unit tests with Vitest for backend services
- Integration tests for API endpoints
- End-to-end tests for critical user flows

**Deployment Strategy:**

- Frontend: Static site deployment (Vercel/Netlify)
- Backend: Container deployment (Railway/Render)
- Database: Managed MongoDB Atlas
- File Storage: AWS S3 with CloudFront CDN

## Security Architecture

### Defense in Depth

**Transport Security:**

- HTTPS-only communication
- HTTP Strict Transport Security (HSTS)
- TLS 1.2+ with modern cipher suites

**Application Security:**

- JWT tokens in HTTP-only cookies (XSS protection)
- CSRF protection with SameSite cookies
- Input validation with Zod schemas
- Rate limiting on authentication endpoints

**Data Security:**

- Password hashing with bcrypt (work factor 12+)
- File access through authenticated endpoints
- Database authentication and network isolation

### Cookie Security Configuration

```javascript
const cookieConfig = {
  httpOnly: true,                               // XSS protection
  secure: process.env.NODE_ENV === 'production', // HTTPS only
  sameSite: 'Lax',                             // CSRF protection
  maxAge: 30 * 60 * 1000                       // 30 minutes
};
```

## Performance & Scalability Considerations

### Current Optimizations

**Database Performance:**

- Strategic indexing for common query patterns
- Connection pooling with Mongoose
- Query optimization for household-scoped data

**File Handling:**

- Direct S3 uploads to reduce server load
- Presigned URLs for secure access
- Planned CDN integration for global performance

**Frontend Performance:**

- Vite for fast development builds
- Code splitting preparation for production
- Lazy loading for non-critical components

### Scalability Roadmap

**Horizontal Scaling Preparation:**

- Stateless API design for load balancer compatibility
- Database design supports sharding by household
- File storage already cloud-native

**Caching Strategy:**

- Redis integration for session data
- Browser caching for static assets
- API response caching for expensive operations

## Integration Points

### File Processing Pipeline

```
Upload → Validation → S3 Storage → OCR Processing → Text Extraction → Elasticsearch Indexing
```

**OCR Integration (Planned):**

- AWS Textract for document text extraction
- Asynchronous processing for large files
- Error handling and retry mechanisms

### Search Architecture

**Multi-Source Search:**

- Manual content (OCR text)
- Asset metadata
- Custom document content
- Task descriptions

**Search Features:**

- Full-text search with relevance scoring
- Faceted search by category, date, tags
- Auto-complete for improved UX

### Notification System (Planned)

**Notification Channels:**

- Email notifications for task reminders
- Push notifications for mobile app
- In-app notifications for real-time updates

## Monitoring & Observability

### Logging Strategy

**Application Logs:**

- HTTP request logging with Morgan
- Error logging with stack traces
- Security event logging (failed auth attempts)

**Performance Monitoring:**

- Response time tracking
- Database query performance
- File upload/download metrics

### Health Checks

**Service Health:**

- API endpoint health checks
- Database connectivity monitoring
- External service availability (S3, Elasticsearch)

## Future Architecture Considerations

### Microservices Migration Path

**Service Boundaries:**

- User Management Service
- Document Processing Service
- Task Scheduling Service
- Notification Service

**Event-Driven Architecture:**

- Message queues for async processing
- Event sourcing for audit trails
- CQRS for read/write optimization

### Mobile App Integration

**API Consistency:**

- Same REST API for web and mobile
- JWT cookie authentication works with React Native
- File upload/download patterns mobile-friendly

**Offline Capabilities:**

- Local data synchronization
- Conflict resolution strategies
- Progressive web app features

## Technology Decision Rationale

### Why MongoDB?

- Flexible schema for varied manual formats
- Strong TypeScript integration with Mongoose
- Built-in full-text search capabilities
- Horizontal scaling capabilities

### Why JWT in Cookies?

- XSS protection through HTTP-only cookies
- Maintains stateless architecture benefits
- Mobile-friendly authentication pattern
- CSRF protection through SameSite attribute

### Why TypeScript?

- Type safety reduces runtime errors
- Better developer experience with IDE support
- Self-documenting code through interfaces
- Easier refactoring and maintenance

### Why React?

- Component-based architecture for reusability
- Strong ecosystem and community support
- Excellent TypeScript integration
- Mobile app path through React Native

## Conclusion

HomeKeeper's architecture balances simplicity for MVP development with flexibility for future growth. The technology choices prioritize security, developer experience, and scalability while maintaining a clear separation of concerns.

Key architectural strengths:

- **Security-First:** JWT cookies and comprehensive input validation
- **Type Safety:** End-to-end TypeScript for reliability
- **Scalable Data Model:** Household-centric design supports multi-tenancy
- **Mobile-Ready:** Authentication and API patterns work across platforms
- **Developer-Friendly:** Hot reload, strong typing, and clear service boundaries

The architecture supports the immediate MVP requirements while providing a solid foundation for planned features like OAuth integration, enhanced search capabilities, and mobile app development.