# CrowdAid - Start Frontend & Backend Together

Write-Host "🚀 Starting CrowdAid (Frontend + Backend)..." -ForegroundColor Green
Write-Host ""

# Check Docker
Write-Host "📋 Checking Docker..." -ForegroundColor Cyan
$dockerRunning = docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Docker Desktop is not running!" -ForegroundColor Yellow
    Write-Host "   Starting Docker services may fail. Please start Docker Desktop manually." -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✅ Docker is running" -ForegroundColor Green
}

# Navigate to backend
Set-Location backend

# Check/create .env
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    @"
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crowdaid?schema=public
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=3600
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=30d
SESSION_SECRET=dev-session-secret-change-in-production
SESSION_MAX_AGE=604800000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:3001/api/auth/github/callback
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@crowdaid.in
STORAGE_ENDPOINT=localhost
STORAGE_PORT=9000
STORAGE_USE_SSL=false
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_BUCKET=crowdaid
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=100
BCRYPT_ROUNDS=10
TOTP_ISSUER=CrowdAid
"@ | Out-File -FilePath .env -Encoding utf8
}

# Start Docker services
Write-Host "🐳 Starting Docker services..." -ForegroundColor Cyan
docker-compose up -d 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker services started" -ForegroundColor Green
    Start-Sleep -Seconds 5
} else {
    Write-Host "⚠️  Docker services may not be running. Continuing anyway..." -ForegroundColor Yellow
}

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate 2>&1 | Out-Null

# Run migrations (only if database is available)
Write-Host "🗄️  Setting up database..." -ForegroundColor Cyan
$dbReady = $false
for ($i = 0; $i -lt 5; $i++) {
    $result = docker exec crowdaid-postgres pg_isready -U postgres 2>&1
    if ($LASTEXITCODE -eq 0) {
        $dbReady = $true
        break
    }
    Start-Sleep -Seconds 2
}

if ($dbReady) {
    npx prisma migrate deploy 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        npx prisma migrate dev --name init 2>&1 | Out-Null
    }
    npm run prisma:seed 2>&1 | Out-Null
    Write-Host "✅ Database setup complete" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database not ready. You may need to run migrations manually." -ForegroundColor Yellow
    Write-Host "   Run: cd backend && npx prisma migrate dev && npm run prisma:seed" -ForegroundColor Yellow
}

# Start backend in background
Write-Host ""
Write-Host "🚀 Starting backend server..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    npm run start:dev
}

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Navigate to root for frontend
Set-Location ..

# Start frontend
Write-Host "🚀 Starting frontend server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  🎉 CrowdAid is starting!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Access Points:" -ForegroundColor Yellow
Write-Host "  🌐 Frontend:      http://localhost:3000" -ForegroundColor White
Write-Host "  🔧 Backend API:   http://localhost:3001" -ForegroundColor White
Write-Host "  📖 API Docs:      http://localhost:3001/api/docs" -ForegroundColor White
Write-Host "  📧 MailHog UI:    http://localhost:8025" -ForegroundColor White
Write-Host "  📦 MinIO Console: http://localhost:9001" -ForegroundColor White
Write-Host ""
Write-Host "👤 Demo Credentials:" -ForegroundColor Yellow
Write-Host "  • Admin:    admin@crowdaid.in / admin123" -ForegroundColor White
Write-Host "  • User:     demo@crowdaid.in / demo123" -ForegroundColor White
Write-Host "  • Volunteer: volunteer@crowdaid.in / volunteer123" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Start frontend (this will block)
npm run dev

# Cleanup on exit
Stop-Job $backendJob -ErrorAction SilentlyContinue
Remove-Job $backendJob -ErrorAction SilentlyContinue

