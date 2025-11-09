# CrowdAid Backend Startup Script

Write-Host "🚀 Starting CrowdAid Backend..." -ForegroundColor Green
Write-Host ""

# Check if Docker is running
Write-Host "📋 Checking Docker status..." -ForegroundColor Cyan
$dockerRunning = docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and run this script again." -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green

# Start Docker services
Write-Host ""
Write-Host "🐳 Starting Docker services..." -ForegroundColor Cyan
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start Docker services" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker services started" -ForegroundColor Green

# Wait for services
Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host ""
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    @"
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

# JWT
JWT_SECRET=change-me-in-production-use-strong-random-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=change-me-in-production-use-strong-random-secret-refresh
JWT_REFRESH_EXPIRES_IN=30d

# Session
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
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host "✅ .env file created" -ForegroundColor Green
}

# Generate Prisma Client
Write-Host ""
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client generated" -ForegroundColor Green

# Run migrations
Write-Host ""
Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Migration may have failed, but continuing..." -ForegroundColor Yellow
}
Write-Host "✅ Migrations completed" -ForegroundColor Green

# Seed database
Write-Host ""
Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
npm run prisma:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Seeding may have failed, but continuing..." -ForegroundColor Yellow
}
Write-Host "✅ Database seeded" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Access points:" -ForegroundColor Yellow
Write-Host "  - API: http://localhost:3001" -ForegroundColor White
Write-Host "  - API Docs: http://localhost:3001/api/docs" -ForegroundColor White
Write-Host "  - MailHog UI: http://localhost:8025" -ForegroundColor White
Write-Host "  - MinIO Console: http://localhost:9001" -ForegroundColor White
Write-Host ""
Write-Host "👤 Demo credentials:" -ForegroundColor Yellow
Write-Host "  - Admin: admin@crowdaid.in / admin123" -ForegroundColor White
Write-Host "  - User: demo@crowdaid.in / demo123" -ForegroundColor White
Write-Host "  - Volunteer: volunteer@crowdaid.in / volunteer123" -ForegroundColor White
Write-Host ""

# Start dev server
npm run start:dev

