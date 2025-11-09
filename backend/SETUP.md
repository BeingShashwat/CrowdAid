# Setup Guide

## Quick Start

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Start Docker services:**
```bash
docker-compose up -d
```

3. **Install dependencies:**
```bash
npm install
```

4. **Run migrations:**
```bash
npx prisma migrate dev --name init
```

5. **Seed database:**
```bash
npm run prisma:seed
```

6. **Start development server:**
```bash
npm run start:dev
```

## Environment Variables

Create a `.env` file in the backend directory with the following:

```env
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crowdaid?schema=public

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=3600

# JWT (CHANGE IN PRODUCTION!)
JWT_SECRET=change-me-in-production-use-strong-random-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=change-me-in-production-use-strong-random-secret-refresh
JWT_REFRESH_EXPIRES_IN=30d

# Session (CHANGE IN PRODUCTION!)
SESSION_SECRET=change-me-in-production-use-strong-random-session-secret
SESSION_MAX_AGE=604800000

# OAuth - Google (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# OAuth - GitHub (optional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:3001/api/auth/github/callback

# Email (MailHog for development)
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@crowdaid.in

# Storage (MinIO)
STORAGE_ENDPOINT=localhost
STORAGE_PORT=9000
STORAGE_USE_SSL=false
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_BUCKET=crowdaid

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=100

# Security
BCRYPT_ROUNDS=10
TOTP_ISSUER=CrowdAid
```

## Access Points

- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **MailHog UI**: http://localhost:8025
- **MinIO Console**: http://localhost:9001

## Default Credentials

After seeding:
- **Admin**: admin@crowdaid.in / admin123
- **User**: demo@crowdaid.in / demo123
- **Volunteer**: volunteer@crowdaid.in / volunteer123

