# Backend Architecture

## Overview

The CrowdAid backend is built with **NestJS**, following a modular architecture with clear separation of concerns.

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Storage**: MinIO (S3-compatible)
- **Email**: MailHog (dev) / SMTP (prod)
- **Auth**: JWT, Sessions, OAuth (Google, GitHub), TOTP 2FA
- **Security**: Helmet, CORS, Rate Limiting, Input Validation

## Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication & Authorization
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── guards/        # Route guards
│   │   ├── strategies/    # Passport strategies
│   │   ├── decorators/    # Custom decorators
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/             # User management
│   ├── emergencies/       # Emergency requests
│   ├── volunteers/        # Volunteer management
│   ├── notifications/      # Notifications
│   ├── email/             # Email service
│   ├── storage/           # File storage (MinIO)
│   ├── redis/             # Redis service
│   ├── prisma/            # Database service
│   ├── audit/             # Audit logging
│   ├── config/            # Configuration
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── docker-compose.yml     # Docker services
└── package.json
```

## Modules

### 1. Auth Module

Handles all authentication and authorization:

- **Registration**: Email/password, email verification
- **Login**: Email/password with optional 2FA
- **OAuth**: Google and GitHub
- **2FA**: TOTP-based two-factor authentication
- **Password Reset**: Secure token-based reset
- **Sessions**: Cookie and JWT-based sessions

**Guards:**
- `JwtAuthGuard`: Validates JWT tokens
- `LocalAuthGuard`: Validates email/password
- `GoogleAuthGuard`: Google OAuth
- `GitHubAuthGuard`: GitHub OAuth

**Strategies:**
- JWT Strategy
- Local Strategy
- Google Strategy
- GitHub Strategy

### 2. Users Module

User profile management:

- Get/update profile
- Avatar upload
- Account deletion

### 3. Emergencies Module

Emergency request management:

- Create emergency requests
- View emergencies
- Respond to emergencies (volunteers)
- Resolve emergencies

### 4. Volunteers Module

Volunteer-specific features:

- Volunteer profile management
- Verification document upload
- Skills and availability
- Location-based matching

### 5. Notifications Module

Notification system:

- Create notifications
- Email notifications
- Mark as read
- Notification history

### 6. Core Services

**Prisma Service**: Database access
**Redis Service**: Caching and rate limiting
**Email Service**: Transactional emails
**Storage Service**: File uploads (MinIO)

## Database Schema

### Key Models

- **User**: Users, volunteers, admins
- **Account**: OAuth accounts
- **Session**: Active sessions
- **Emergency**: Emergency requests
- **EmergencyResponse**: Volunteer responses
- **VolunteerProfile**: Volunteer details
- **Notification**: User notifications
- **AuditLog**: Activity logs
- **VerificationToken**: Email verification
- **PasswordResetToken**: Password reset

## Security Features

### 1. Authentication

- Bcrypt password hashing (10 rounds)
- JWT tokens with expiration
- Refresh tokens
- HTTP-only cookies for sessions
- 2FA with TOTP

### 2. Authorization

- Role-based access control (USER, VOLUNTEER, ADMIN)
- Route guards
- Resource ownership checks

### 3. Input Validation

- class-validator DTOs
- Type-safe validation
- SQL injection prevention (Prisma)

### 4. Rate Limiting

- Throttler module
- Configurable limits
- Redis-backed

### 5. Security Headers

- Helmet middleware
- CORS configuration
- XSS protection
- CSRF protection (via SameSite cookies)

## API Design

### RESTful Endpoints

- `GET /api/...` - Retrieve resources
- `POST /api/...` - Create resources
- `PUT /api/...` - Update resources
- `DELETE /api/...` - Delete resources

### Response Format

```json
{
  "data": {...},
  "message": "Success",
  "statusCode": 200
}
```

### Error Format

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## Configuration

Configuration is managed through:

1. **Environment Variables** (`.env`)
2. **Config Module** (`src/config/configuration.ts`)
3. **Type-safe access** via `ConfigService`

## Docker Services

All services run in Docker:

- **PostgreSQL**: Database
- **Redis**: Cache
- **MailHog**: Email testing
- **MinIO**: File storage

## Development Workflow

1. Start Docker: `docker-compose up -d`
2. Run migrations: `npx prisma migrate dev`
3. Seed database: `npm run prisma:seed`
4. Start dev server: `npm run start:dev`

## Testing

- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Coverage: `npm run test:cov`

## Production Considerations

1. **Secrets**: Change all default secrets
2. **HTTPS**: Enable SSL/TLS
3. **Database**: Use managed PostgreSQL
4. **Redis**: Use managed Redis
5. **Storage**: Use production S3 or MinIO cluster
6. **Email**: Use production SMTP (SendGrid, AWS SES, etc.)
7. **Monitoring**: Add logging and monitoring
8. **Backups**: Database backups
9. **Scaling**: Consider horizontal scaling
10. **CDN**: Use CDN for static assets

## Best Practices

1. **Error Handling**: Consistent error responses
2. **Logging**: Structured logging
3. **Validation**: Validate all inputs
4. **Type Safety**: Use TypeScript strictly
5. **Documentation**: Keep API docs updated
6. **Testing**: Write tests for critical paths
7. **Security**: Regular dependency updates
8. **Performance**: Optimize queries, use caching

## Extension Points

To add new features:

1. Create new module: `nest generate module feature-name`
2. Create service: `nest generate service feature-name`
3. Create controller: `nest generate controller feature-name`
4. Add to `app.module.ts`
5. Update Prisma schema if needed
6. Add to API documentation

## Support

For questions or issues:
- Check API docs: `/api/docs`
- Review logs: `docker-compose logs`
- Open GitHub issue

