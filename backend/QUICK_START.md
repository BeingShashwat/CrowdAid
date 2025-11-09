# Quick Start Guide

Get your CrowdAid backend up and running in 5 minutes!

## Prerequisites

- Node.js 20+
- Docker Desktop
- Git

## Steps

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Create environment file

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

### 3. Start Docker services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (database)
- Redis (cache)
- MailHog (email testing)
- MinIO (file storage)

### 4. Install dependencies

```bash
npm install
```

### 5. Setup database

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database (creates demo users)
npm run prisma:seed
```

### 6. Start development server

```bash
npm run start:dev
```

## Access Points

Once running, access:

- **API**: http://localhost:3001
- **API Docs (Swagger)**: http://localhost:3001/api/docs
- **MailHog UI** (view emails): http://localhost:8025
- **MinIO Console** (file storage): http://localhost:9001

## Demo Credentials

After seeding, you can login with:

- **Admin**: `admin@crowdaid.in` / `admin123`
- **User**: `demo@crowdaid.in` / `demo123`
- **Volunteer**: `volunteer@crowdaid.in` / `volunteer123`

## Test API

```bash
# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123",
    "userType": "USER",
    "agreeToTerms": true,
    "emergencyContact": true
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@crowdaid.in",
    "password": "demo123"
  }'
```

## Troubleshooting

### Port already in use

If port 3001 is taken, change `PORT` in `.env` file.

### Docker services not starting

```bash
# Check Docker status
docker ps

# View logs
docker-compose logs

# Restart services
docker-compose restart
```

### Database connection error

Make sure PostgreSQL container is running:
```bash
docker ps | grep postgres
```

### Prisma errors

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Then re-run migrations
npx prisma migrate dev
```

## Next Steps

1. Read [README.md](./README.md) for detailed documentation
2. Check [SETUP.md](./SETUP.md) for advanced configuration
3. Review [BACKEND_INTEGRATION.md](../BACKEND_INTEGRATION.md) to integrate with frontend

## Need Help?

- Check the logs: `docker-compose logs`
- Review API docs: http://localhost:3001/api/docs
- Open an issue on GitHub

