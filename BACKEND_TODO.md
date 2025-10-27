# Backend Development Plan - Jankee Manager API

> Comprehensive backend implementation plan for the Jankee Manager application
>
> **Tech Stack**: Node.js + TypeScript + PostgreSQL + Drizzle ORM + Express
>
> **Total Phases**: 8 | **Estimated Tasks**: 92

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Principles](#architecture-principles)
4. [Development Phases](#development-phases)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Testing Strategy](#testing-strategy)

---

## Overview

This document outlines the complete backend development roadmap for the Jankee Manager application. The backend will provide a RESTful API to support all frontend operations including site management, client management, activity tracking, and reporting.

### Goals

- **Type Safety**: Full TypeScript coverage with strict mode
- **Performance**: Optimized queries with proper indexing and caching
- **Security**: JWT authentication, role-based access control, input validation
- **Maintainability**: Clean architecture with separation of concerns
- **Scalability**: Designed to handle growing data and concurrent users
- **Developer Experience**: Comprehensive API documentation and error handling

---

## Technology Stack

### Core Framework
- **Node.js** (v20+) - JavaScript runtime
- **TypeScript** (v5+) - Type-safe development
- **Express** (v4+) - Web framework

### Database
- **PostgreSQL** (v16+) - Relational database
- **Drizzle ORM** - Type-safe SQL ORM (NOT Prisma)
- **Drizzle Kit** - Migration management

### Authentication & Security
- **JWT** - JSON Web Tokens for stateless auth
- **bcrypt** - Password hashing
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting

### Validation & Data Processing
- **Zod** - Schema validation
- **express-validator** - Request validation middleware
- **date-fns** - Date manipulation

### Development Tools
- **tsx** - TypeScript execution for development
- **nodemon** - Auto-restart on file changes
- **ts-node** - TypeScript execution
- **eslint** - Code linting
- **prettier** - Code formatting

### Testing
- **Vitest** - Unit and integration testing
- **Supertest** - HTTP endpoint testing
- **@faker-js/faker** - Test data generation

### Logging & Monitoring
- **pino** - High-performance logging
- **pino-pretty** - Pretty-print logs in development

### Documentation
- **Swagger/OpenAPI** - API documentation

---

## Architecture Principles

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Routes (HTTP Layer)              │
│  - Request/Response handling             │
│  - Route definitions                     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Controllers (Business Logic)        │
│  - Request validation                    │
│  - Service orchestration                 │
│  - Response formatting                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Services (Domain Logic)          │
│  - Business rules                        │
│  - Data transformation                   │
│  - Transaction management                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Repositories (Data Access)          │
│  - Database queries                      │
│  - Drizzle ORM operations                │
│  - Query optimization                    │
└─────────────────────────────────────────┘
```

### Directory Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # Database connection
│   │   ├── env.ts           # Environment variables
│   │   └── constants.ts     # App constants
│   │
│   ├── db/                  # Database layer
│   │   ├── schema/          # Drizzle schema definitions
│   │   │   ├── sites.ts
│   │   │   ├── clients.ts
│   │   │   ├── activities.ts
│   │   │   └── users.ts
│   │   ├── migrations/      # SQL migration files
│   │   └── index.ts         # Database instance
│   │
│   ├── repositories/        # Data access layer
│   │   ├── site.repository.ts
│   │   ├── client.repository.ts
│   │   ├── activity.repository.ts
│   │   └── user.repository.ts
│   │
│   ├── services/            # Business logic layer
│   │   ├── site.service.ts
│   │   ├── client.service.ts
│   │   ├── activity.service.ts
│   │   ├── auth.service.ts
│   │   └── dashboard.service.ts
│   │
│   ├── controllers/         # Request handlers
│   │   ├── site.controller.ts
│   │   ├── client.controller.ts
│   │   ├── activity.controller.ts
│   │   ├── auth.controller.ts
│   │   └── dashboard.controller.ts
│   │
│   ├── routes/              # Route definitions
│   │   ├── site.routes.ts
│   │   ├── client.routes.ts
│   │   ├── activity.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── dashboard.routes.ts
│   │   └── index.ts
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── logger.middleware.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── api.types.ts     # API request/response types
│   │   ├── database.types.ts # Database types
│   │   └── common.types.ts  # Shared types
│   │
│   ├── utils/               # Utility functions
│   │   ├── errors.ts        # Custom error classes
│   │   ├── validation.ts    # Validation schemas
│   │   ├── jwt.ts           # JWT utilities
│   │   └── logger.ts        # Logger configuration
│   │
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
│
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── helpers/
│
├── scripts/                 # Utility scripts
│   ├── seed.ts              # Database seeding
│   └── migrate.ts           # Migration runner
│
├── drizzle.config.ts        # Drizzle configuration
├── tsconfig.json            # TypeScript config
├── package.json
├── .env.example
└── README.md
```

---

## Development Phases

### Phase 1: Project Setup & Configuration
**Estimated Time**: 2-3 hours

- [ ] Initialize Node.js project with TypeScript
- [ ] Install core dependencies (Express, TypeScript, etc.)
- [ ] Configure TypeScript (strict mode, paths, etc.)
- [ ] Set up ESLint and Prettier
- [ ] Create environment configuration (.env, env.ts)
- [ ] Set up Git and .gitignore
- [ ] Configure npm scripts (dev, build, test, lint)
- [ ] Create basic Express app structure
- [ ] Set up logging with Pino
- [ ] Create README with setup instructions

**Deliverables**: Fully configured TypeScript Node.js project with development tooling

---

### Phase 2: Database Setup & Schema Design
**Estimated Time**: 4-5 hours

#### Database Connection
- [ ] Install PostgreSQL and Drizzle ORM dependencies
- [ ] Create database connection configuration
- [ ] Set up Drizzle config file (drizzle.config.ts)
- [ ] Create database instance with connection pooling
- [ ] Add health check endpoint for database

#### Schema Definitions (Drizzle)
- [ ] Create users table schema (id, email, password, role, timestamps)
- [ ] Create sites table schema (id, siteNo, location, type, size, etc.)
- [ ] Create clients table schema (id, clientNo, name, contactPerson, etc.)
- [ ] Create activities table schema (id, action, siteId, clientId, dates, rates, etc.)
- [ ] Define relationships and foreign keys
- [ ] Add indexes for performance (siteNo, clientNo, dates, etc.)
- [ ] Create enums for types (SiteType, ActivityAction, UserRole)

#### Migrations
- [ ] Generate initial migration from schema
- [ ] Create migration runner script
- [ ] Test migration up/down
- [ ] Add migration documentation

**Deliverables**: Complete database schema with migrations and connection setup

---

### Phase 3: Data Access Layer (Repositories)
**Estimated Time**: 5-6 hours

#### Base Repository Pattern
- [ ] Create generic BaseRepository interface
- [ ] Implement common CRUD operations (findAll, findById, create, update, delete)
- [ ] Add pagination helper methods
- [ ] Add filtering and sorting utilities

#### Site Repository
- [ ] Implement SiteRepository with Drizzle queries
- [ ] Add getSites() with filters (type, location, status, search)
- [ ] Add getSiteById() with related data
- [ ] Add createSite(), updateSite(), deleteSite()
- [ ] Add getSiteActivities() for activity history
- [ ] Add getSitesWithStatus() for occupancy tracking

#### Client Repository
- [ ] Implement ClientRepository with Drizzle queries
- [ ] Add getClients() with filters (search, status)
- [ ] Add getClientById() with related data
- [ ] Add createClient(), updateClient(), deleteClient()
- [ ] Add getClientActivities() for activity history
- [ ] Add getClientSites() for current/past sites

#### Activity Repository
- [ ] Implement ActivityRepository with Drizzle queries
- [ ] Add getActivities() with filters (action, date range, site, client)
- [ ] Add getActivityById() with full details (site, client, previous client)
- [ ] Add createActivity(), updateActivity(), deleteActivity()
- [ ] Add getRecentActivities() for dashboard
- [ ] Add complex queries for reports (revenue, occupancy, etc.)

#### User Repository
- [ ] Implement UserRepository with Drizzle queries
- [ ] Add getUserByEmail() for authentication
- [ ] Add getUserById() for profile
- [ ] Add createUser(), updateUser()
- [ ] Add password hash handling

**Deliverables**: Complete data access layer with type-safe database queries

---

### Phase 4: Business Logic Layer (Services)
**Estimated Time**: 6-7 hours

#### Site Service
- [ ] Implement SiteService with business logic
- [ ] Add getSites() with filtering and pagination
- [ ] Add getSiteById() with validation
- [ ] Add createSite() with duplicate check (siteNo uniqueness)
- [ ] Add updateSite() with conflict detection
- [ ] Add deleteSite() with dependency check (active activities)
- [ ] Add validation logic (site number format, size validation, etc.)

#### Client Service
- [ ] Implement ClientService with business logic
- [ ] Add getClients() with filtering
- [ ] Add getClientById() with validation
- [ ] Add createClient() with duplicate check (clientNo uniqueness)
- [ ] Add updateClient() with conflict detection
- [ ] Add deleteClient() with dependency check (active activities)
- [ ] Add validation logic (contact info, email format, etc.)

#### Activity Service
- [ ] Implement ActivityService with complex business rules
- [ ] Add getActivities() with multi-field filtering
- [ ] Add getActivityById() with full context
- [ ] Add createActivity() with validation:
  - Site availability check
  - Date overlap detection
  - Previous client validation (for shift/flex_change)
  - Rate calculation and validation
- [ ] Add updateActivity() with conflict resolution
- [ ] Add deleteActivity() with cascade effects
- [ ] Add business rule: shift requires previousClientId
- [ ] Add business rule: flex_change requires rate change
- [ ] Add calculateActivityDuration() helper
- [ ] Add calculateMonthlyRevenue() helper

#### Auth Service
- [ ] Implement AuthService with authentication logic
- [ ] Add register() with password hashing
- [ ] Add login() with credential validation
- [ ] Add generateTokens() (access + refresh)
- [ ] Add verifyToken() with expiry check
- [ ] Add refreshToken() logic
- [ ] Add password reset flow
- [ ] Add email verification (optional)

#### Dashboard Service
- [ ] Implement DashboardService with aggregations
- [ ] Add getDashboardMetrics() combining multiple queries:
  - Total sites, active sites, available sites
  - Total clients, active clients
  - Total revenue (sum of activity rates)
  - Occupancy rate calculation
- [ ] Add getRecentActivities() with limit
- [ ] Add getRevenueByMonth() for charts
- [ ] Add getTopClients() by revenue
- [ ] Add cache layer for expensive queries (optional)

**Deliverables**: Complete business logic with validation and complex rules

---

### Phase 5: Controllers & Request Handling
**Estimated Time**: 5-6 hours

#### Base Controller Pattern
- [ ] Create base controller with common error handling
- [ ] Add response formatting utilities (success, error)
- [ ] Add pagination response helper

#### Site Controller
- [ ] Implement SiteController endpoints:
  - `GET /sites` - List sites with filters
  - `GET /sites/:id` - Get site details
  - `POST /sites` - Create new site
  - `PUT /sites/:id` - Update site
  - `DELETE /sites/:id` - Delete site
  - `GET /sites/:id/activities` - Get site activity history
- [ ] Add request validation middleware
- [ ] Add error handling for each endpoint

#### Client Controller
- [ ] Implement ClientController endpoints:
  - `GET /clients` - List clients with filters
  - `GET /clients/:id` - Get client details
  - `POST /clients` - Create new client
  - `PUT /clients/:id` - Update client
  - `DELETE /clients/:id` - Delete client
  - `GET /clients/:id/activities` - Get client activity history
  - `GET /clients/:id/sites` - Get client's current sites
- [ ] Add request validation middleware
- [ ] Add error handling for each endpoint

#### Activity Controller
- [ ] Implement ActivityController endpoints:
  - `GET /activities` - List activities with complex filters
  - `GET /activities/:id` - Get activity details
  - `POST /activities` - Create new activity
  - `PUT /activities/:id` - Update activity
  - `DELETE /activities/:id` - Delete activity
- [ ] Add request validation middleware
- [ ] Add error handling for each endpoint

#### Auth Controller
- [ ] Implement AuthController endpoints:
  - `POST /auth/register` - User registration
  - `POST /auth/login` - User login
  - `POST /auth/refresh` - Refresh access token
  - `POST /auth/logout` - User logout
  - `GET /auth/me` - Get current user profile
  - `POST /auth/forgot-password` - Password reset request
  - `POST /auth/reset-password` - Password reset confirmation
- [ ] Add rate limiting for auth endpoints
- [ ] Add login attempt tracking

#### Dashboard Controller
- [ ] Implement DashboardController endpoints:
  - `GET /dashboard/metrics` - Get dashboard statistics
  - `GET /dashboard/recent-activities` - Get recent activity feed
  - `GET /dashboard/revenue` - Get revenue data by month
  - `GET /dashboard/top-clients` - Get top clients by revenue
  - `GET /dashboard/occupancy` - Get occupancy trends
- [ ] Add caching for expensive queries
- [ ] Add error handling for each endpoint

**Deliverables**: Complete API controllers with request/response handling

---

### Phase 6: Middleware & Security
**Estimated Time**: 4-5 hours

#### Authentication Middleware
- [ ] Create JWT verification middleware
- [ ] Add token extraction from Authorization header
- [ ] Add token validation and decoding
- [ ] Add user context injection (req.user)
- [ ] Add refresh token handling
- [ ] Add optional authentication (for public endpoints)

#### Authorization Middleware
- [ ] Create role-based access control middleware
- [ ] Add requireRole() middleware (admin, manager, user)
- [ ] Add resource ownership check
- [ ] Add permission matrix configuration

#### Validation Middleware
- [ ] Create Zod schema validation middleware
- [ ] Add request body validation
- [ ] Add query parameter validation
- [ ] Add URL parameter validation
- [ ] Add file upload validation (for future image uploads)

#### Error Handling Middleware
- [ ] Create global error handler
- [ ] Add custom error classes (NotFoundError, ValidationError, etc.)
- [ ] Add error response formatting
- [ ] Add development vs production error details
- [ ] Add error logging with stack traces

#### Request Logging Middleware
- [ ] Create request logger with Pino
- [ ] Add request ID generation
- [ ] Add request/response logging
- [ ] Add performance timing
- [ ] Add sensitive data masking (passwords, tokens)

#### Security Middleware
- [ ] Add Helmet for security headers
- [ ] Add CORS configuration
- [ ] Add rate limiting (express-rate-limit)
- [ ] Add request size limits
- [ ] Add SQL injection protection (via Drizzle parameterized queries)
- [ ] Add XSS protection

**Deliverables**: Complete middleware stack with security and validation

---

### Phase 7: Testing Infrastructure
**Estimated Time**: 6-7 hours

#### Test Setup
- [ ] Configure Vitest for unit and integration tests
- [ ] Set up test database configuration
- [ ] Create test database seeding utilities
- [ ] Add test helpers and factories
- [ ] Configure code coverage reporting

#### Repository Tests
- [ ] Write unit tests for SiteRepository (CRUD operations)
- [ ] Write unit tests for ClientRepository (CRUD operations)
- [ ] Write unit tests for ActivityRepository (complex queries)
- [ ] Write unit tests for UserRepository (auth queries)
- [ ] Test pagination, filtering, and sorting

#### Service Tests
- [ ] Write unit tests for SiteService (business logic)
- [ ] Write unit tests for ClientService (validation)
- [ ] Write unit tests for ActivityService (complex rules)
- [ ] Write unit tests for AuthService (token generation)
- [ ] Write unit tests for DashboardService (aggregations)
- [ ] Mock repository dependencies

#### Controller Tests (Integration)
- [ ] Write integration tests for Site endpoints
- [ ] Write integration tests for Client endpoints
- [ ] Write integration tests for Activity endpoints
- [ ] Write integration tests for Auth endpoints
- [ ] Write integration tests for Dashboard endpoints
- [ ] Test authentication and authorization
- [ ] Test error handling and validation

#### End-to-End Scenarios
- [ ] Test complete user registration and login flow
- [ ] Test create site → create activity → update activity flow
- [ ] Test shift activity with previous client
- [ ] Test delete site with dependency check
- [ ] Test dashboard metrics calculation

**Deliverables**: Comprehensive test suite with >80% code coverage

---

### Phase 8: API Documentation & Deployment Prep
**Estimated Time**: 3-4 hours

#### API Documentation
- [ ] Install and configure Swagger/OpenAPI
- [ ] Document all API endpoints with examples
- [ ] Add request/response schemas
- [ ] Add authentication documentation
- [ ] Add error code documentation
- [ ] Create Postman collection export

#### Database Seeding
- [ ] Create seed script for development data
- [ ] Add sample users (admin, manager, regular user)
- [ ] Add sample sites (10-20 sites)
- [ ] Add sample clients (10-15 clients)
- [ ] Add sample activities (20-30 activities)
- [ ] Add seed command to package.json

#### Environment Configuration
- [ ] Create .env.example with all required variables
- [ ] Document environment variables
- [ ] Add validation for required env vars on startup
- [ ] Create separate configs for dev/staging/production

#### Performance Optimization
- [ ] Add database query optimization (explain analyze)
- [ ] Add database indexes for common queries
- [ ] Add response compression (gzip)
- [ ] Add caching layer for dashboard metrics (Redis - optional)
- [ ] Add query result pagination limits

#### Deployment Preparation
- [ ] Create production build script
- [ ] Add health check endpoint (`/health`)
- [ ] Add readiness check endpoint (`/ready`)
- [ ] Create Docker configuration (Dockerfile)
- [ ] Create docker-compose.yml for local dev
- [ ] Add process manager config (PM2 or similar)
- [ ] Add migration strategy documentation

#### Documentation
- [ ] Update README with:
  - Setup instructions
  - Development workflow
  - Testing instructions
  - Deployment guide
  - API documentation link
  - Environment variables
  - Database migration guide

**Deliverables**: Production-ready API with documentation and deployment configs

---

## Database Schema

### Users Table
```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'), // admin, manager, user
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### Sites Table
```typescript
export const sites = pgTable('sites', {
  id: uuid('id').primaryKey().defaultRandom(),
  siteNo: varchar('site_no', { length: 50 }).notNull().unique(),
  location: varchar('location', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // unipole, hoarding
  size: varchar('size', { length: 100 }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  address: text('address'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  siteNoIdx: index('site_no_idx').on(table.siteNo),
  locationIdx: index('location_idx').on(table.location),
  typeIdx: index('type_idx').on(table.type),
}));
```

### Clients Table
```typescript
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientNo: varchar('client_no', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  gstNumber: varchar('gst_number', { length: 50 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clientNoIdx: index('client_no_idx').on(table.clientNo),
  nameIdx: index('name_idx').on(table.name),
}));
```

### Activities Table
```typescript
export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  action: varchar('action', { length: 50 }).notNull(), // new, shift, flex_change
  siteId: uuid('site_id').notNull().references(() => sites.id),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  previousClientId: uuid('previous_client_id').references(() => clients.id),

  startDate: date('start_date').notNull(),
  endDate: date('end_date'),

  ratePerMonth: decimal('rate_per_month', { precision: 10, scale: 2 }).notNull(),
  totalMonths: integer('total_months'),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }),

  printingCost: decimal('printing_cost', { precision: 10, scale: 2 }),
  mountingCost: decimal('mounting_cost', { precision: 10, scale: 2 }),

  notes: text('notes'),

  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  siteIdIdx: index('activity_site_id_idx').on(table.siteId),
  clientIdIdx: index('activity_client_id_idx').on(table.clientId),
  actionIdx: index('activity_action_idx').on(table.action),
  startDateIdx: index('activity_start_date_idx').on(table.startDate),
  endDateIdx: index('activity_end_date_idx').on(table.endDate),
  // Composite index for date range queries
  dateRangeIdx: index('activity_date_range_idx').on(table.startDate, table.endDate),
}));
```

### Relationships
```typescript
export const sitesRelations = relations(sites, ({ many }) => ({
  activities: many(activities),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  activities: many(activities),
  previousActivities: many(activities, { relationName: 'previousClient' }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  site: one(sites, { fields: [activities.siteId], references: [sites.id] }),
  client: one(clients, { fields: [activities.clientId], references: [clients.id] }),
  previousClient: one(clients, {
    fields: [activities.previousClientId],
    references: [clients.id],
    relationName: 'previousClient',
  }),
  creator: one(users, { fields: [activities.createdBy], references: [users.id] }),
}));
```

---

## API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
POST   /api/auth/refresh           # Refresh access token
POST   /api/auth/logout            # Logout user
GET    /api/auth/me                # Get current user
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
```

### Site Endpoints
```
GET    /api/sites                  # List sites (with filters)
GET    /api/sites/:id              # Get site by ID
POST   /api/sites                  # Create new site
PUT    /api/sites/:id              # Update site
DELETE /api/sites/:id              # Delete site
GET    /api/sites/:id/activities   # Get site activities
```

### Client Endpoints
```
GET    /api/clients                # List clients (with filters)
GET    /api/clients/:id            # Get client by ID
POST   /api/clients                # Create new client
PUT    /api/clients/:id            # Update client
DELETE /api/clients/:id            # Delete client
GET    /api/clients/:id/activities # Get client activities
GET    /api/clients/:id/sites      # Get client's current sites
```

### Activity Endpoints
```
GET    /api/activities             # List activities (with filters)
GET    /api/activities/:id         # Get activity by ID
POST   /api/activities             # Create new activity
PUT    /api/activities/:id         # Update activity
DELETE /api/activities/:id         # Delete activity
```

### Dashboard Endpoints
```
GET    /api/dashboard/metrics         # Get dashboard statistics
GET    /api/dashboard/recent-activities # Get recent activities
GET    /api/dashboard/revenue         # Get revenue by month
GET    /api/dashboard/top-clients     # Get top clients
GET    /api/dashboard/occupancy       # Get occupancy trends
```

### Health Check Endpoints
```
GET    /health                     # Health check
GET    /ready                      # Readiness check
```

---

## Testing Strategy

### Unit Tests
- **Repositories**: Test all CRUD operations with mock database
- **Services**: Test business logic with mocked repositories
- **Utilities**: Test helper functions and validators

### Integration Tests
- **Controllers**: Test HTTP endpoints with real database (test DB)
- **Middleware**: Test authentication, validation, error handling
- **Database**: Test migrations and schema changes

### End-to-End Tests
- **User Flows**: Test complete workflows (registration → activity creation)
- **Business Scenarios**: Test complex business rules
- **Error Scenarios**: Test error handling and recovery

### Performance Tests
- **Query Performance**: Test slow queries with EXPLAIN ANALYZE
- **Load Testing**: Test concurrent request handling
- **Stress Testing**: Test database connection limits

### Coverage Goals
- **Overall**: >80% code coverage
- **Critical Paths**: 100% coverage (auth, activity creation)
- **Edge Cases**: Comprehensive error scenario testing

---

## Development Workflow

### 1. Development
```bash
npm run dev          # Start development server with auto-reload
npm run db:studio    # Open Drizzle Studio for database management
npm run db:push      # Push schema changes to database
```

### 2. Testing
```bash
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### 3. Database Management
```bash
npm run db:generate  # Generate migration from schema changes
npm run db:migrate   # Run pending migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database (drop + migrate + seed)
```

### 4. Code Quality
```bash
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run type-check   # Run TypeScript compiler check
```

### 5. Production
```bash
npm run build        # Build for production
npm start            # Start production server
```

---

## Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_PREFIX=/api

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/jankee_manager
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_PRETTY=true

# Email (for password reset - optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=password
SMTP_FROM=noreply@jankeemanager.com
```

---

## Next Steps After Completion

1. **Frontend Integration**
   - Connect frontend API service to backend endpoints
   - Test all CRUD operations
   - Handle authentication flow
   - Test error scenarios

2. **Production Deployment**
   - Set up hosting (AWS, DigitalOcean, Render, etc.)
   - Configure PostgreSQL database
   - Set up environment variables
   - Configure reverse proxy (Nginx)
   - Set up SSL certificates
   - Configure monitoring and logging

3. **Future Enhancements**
   - File upload for site images
   - Advanced reporting and analytics
   - Export to Excel/PDF
   - Email notifications
   - Audit logging
   - Multi-tenancy support

---

## Success Criteria

✅ All 92 tasks completed across 8 phases
✅ TypeScript compilation with zero errors
✅ All tests passing with >80% coverage
✅ API documentation complete
✅ Database migrations working
✅ Authentication and authorization functional
✅ All business rules implemented
✅ Production-ready deployment configuration

---

**Happy Coding! 🚀**
