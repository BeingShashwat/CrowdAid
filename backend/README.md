# CrowdAid Backend API

A secure, scalable backend API for the CrowdAid emergency assistance platform built with NestJS, PostgreSQL, Prisma, Redis, and more.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Cookie-based sessions (httpOnly, SameSite=Lax)
  - Two-Factor Authentication (TOTP)
  - OAuth integration (Google, GitHub)
  - Password reset flow
  - Email verification

- **Security**
  - Bcrypt password hashing
  - Rate limiting (Throttler)
  - CORS protection
  - Helmet security headers
  - Input validation (class-validator)
  - SQL injection protection (Prisma)
  - XSS protection

- **Database**
  - PostgreSQL with Prisma ORM
  - Migrations support
  - Database seeding

- **Caching & Performance**
  - Redis for caching and rate limiting
  - Connection pooling

- **File Storage**
  - MinIO (S3-compatible) for file uploads
  - Support for avatars, documents, etc.

- **Email**
  - MailHog for development (captures emails locally)
  - HTML email templates
  - Transactional emails (verification, password reset, etc.)

- **API Documentation**
  - Swagger/OpenAPI at `/api/docs`

- **Monitoring & Logging**
  - Audit logging
  - Request logging

## 📋 Prerequisites

- Node.js 20+ 
- Docker and Docker Compose
- npm or yarn or pnpm

## 🛠️ Installation

1. **Clone the repository and navigate to backend:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

4. **Start Docker services:**

```bash
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- MailHog (ports 1025, 8025)
- MinIO (ports 9000, 9001)

5. **Run database migrations:**

```bash
npx prisma migrate dev
```

6. **Seed the database (optional):**

```bash
npm run prisma:seed
```

This creates demo users:
- Admin: `admin@crowdaid.in` / `admin123`
- User: `demo@crowdaid.in` / `demo123`
- Volunteer: `volunteer@crowdaid.in` / `volunteer123`

7. **Start the development server:**

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`
API Documentation at `http://localhost:3001/api/docs`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/verify-email?token=...` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/2fa/setup` - Setup 2FA
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/disable` - Disable 2FA
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth

### Users

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `PUT /api/users/me/avatar` - Upload avatar
- `DELETE /api/users/me` - Delete account

### Emergencies

- `POST /api/emergencies` - Create emergency
- `GET /api/emergencies` - Get emergencies
- `GET /api/emergencies/:id` - Get emergency by ID
- `PUT /api/emergencies/:id` - Update emergency
- `POST /api/emergencies/:id/respond` - Respond to emergency
- `PUT /api/emergencies/:id/resolve` - Resolve emergency

### Volunteers

- `GET /api/volunteers/me` - Get volunteer profile
- `PUT /api/volunteers/me` - Update volunteer profile
- `PUT /api/volunteers/me/verification-doc` - Upload verification doc
- `GET /api/volunteers/nearby` - Get nearby volunteers

### Notifications

- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 🔐 Security Best Practices

1. **Change default secrets** in production:
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `SESSION_SECRET`

2. **Use environment variables** for sensitive data

3. **Enable HTTPS** in production

4. **Set secure cookie flags** in production:
   - `secure: true`
   - `sameSite: 'strict'`

5. **Implement rate limiting** (already configured)

6. **Keep dependencies updated**

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Database Management

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Seed database
npm run prisma:seed
```

## 🐳 Docker Services

### PostgreSQL
- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `postgres`
- Database: `crowdaid`

### Redis
- Host: `localhost`
- Port: `6379`

### MailHog
- SMTP: `localhost:1025`
- Web UI: `http://localhost:8025`

### MinIO
- API: `http://localhost:9000`
- Console: `http://localhost:9001`
- Access Key: `minioadmin`
- Secret Key: `minioadmin`

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Update all secrets
3. Configure production database
4. Set up proper email service (replace MailHog)
5. Configure production storage (replace MinIO or use proper S3)
6. Enable HTTPS
7. Set up reverse proxy (nginx)
8. Configure monitoring and logging
9. Set up backups

## 📝 Environment Variables

See `.env.example` for all available environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT

## 🆘 Support

For issues and questions, please open an issue on GitHub.

