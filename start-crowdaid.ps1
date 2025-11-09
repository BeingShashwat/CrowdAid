# CrowdAid - Complete Startup Script
# This script starts everything: Docker, Backend, and Frontend

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Starting CrowdAid - Complete Platform" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend")) {
    Write-Host "ERROR: backend directory not found!" -ForegroundColor Red
    Write-Host "Please run this script from the CrowdAid root directory." -ForegroundColor Yellow
    exit 1
}

# Step 1: Setup backend environment
Write-Host "Step 1: Setting up backend environment..." -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path .env)) {
    Write-Host "   Creating .env file..." -ForegroundColor Gray
    $envContent = @"
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crowdaid?schema=public
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=3600
JWT_SECRET=dev-secret-change-in-production-$(Get-Random)
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production-$(Get-Random)
JWT_REFRESH_EXPIRES_IN=30d
SESSION_SECRET=dev-session-secret-change-in-production-$(Get-Random)
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
"@
    $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
}

# Step 2: Start Docker services
Write-Host ""
Write-Host "Step 2: Starting Docker services..." -ForegroundColor Yellow
$dockerResult = docker-compose up -d 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   Docker services started" -ForegroundColor Green
    Write-Host "   Waiting for services to be ready..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
} else {
    Write-Host "   WARNING: Docker services may not be running" -ForegroundColor Yellow
    Write-Host "   Make sure Docker Desktop is running!" -ForegroundColor Yellow
}

# Step 3: Setup database
Write-Host ""
Write-Host "Step 3: Setting up database..." -ForegroundColor Yellow

# Generate Prisma Client
npx prisma generate 2>&1 | Out-Null

# Try to connect and run migrations
$dbReady = $false
for ($i = 0; $i -lt 10; $i++) {
    $pgResult = docker exec crowdaid-postgres pg_isready -U postgres 2>&1
    if ($LASTEXITCODE -eq 0) {
        $dbReady = $true
        break
    }
    Write-Host "   Waiting for database... ($i/10)" -ForegroundColor Gray
    Start-Sleep -Seconds 2
}

if ($dbReady) {
    Write-Host "   Database is ready!" -ForegroundColor Green
    Write-Host "   Running migrations..." -ForegroundColor Gray
    npx prisma migrate deploy 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        npx prisma migrate dev --name init --skip-generate 2>&1 | Out-Null
    }
    
    Write-Host "   Seeding database..." -ForegroundColor Gray
    npm run prisma:seed 2>&1 | Out-Null
    Write-Host "   Database setup complete" -ForegroundColor Green
} else {
    Write-Host "   WARNING: Database not ready. You may need to:" -ForegroundColor Yellow
    Write-Host "      1. Start Docker Desktop" -ForegroundColor Yellow
    Write-Host "      2. Run: cd backend && npx prisma migrate dev && npm run prisma:seed" -ForegroundColor Yellow
}

# Step 4: Start backend server in background
Write-Host ""
Write-Host "Step 4: Starting backend server..." -ForegroundColor Yellow

# Check if backend dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installing backend dependencies..." -ForegroundColor Gray
    npm install 2>&1 | Out-Null
}

# Start backend in a new PowerShell window
$backendScript = @"
cd `"$(Get-Location)`"
`$env:PORT = 3001
npm run start:dev
"@
$backendScriptPath = Join-Path $env:TEMP "start-backend.ps1"
$backendScript | Out-File -FilePath $backendScriptPath -Encoding utf8

$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-File", $backendScriptPath -PassThru

# Wait for backend to start
Write-Host "   Waiting for backend to start..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# Check if backend is responding
$backendReady = $false
for ($i = 0; $i -lt 15; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/docs" -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}

if ($backendReady) {
    Write-Host "   Backend is running on http://localhost:3001" -ForegroundColor Green
} else {
    Write-Host "   Backend may still be starting (check the new window)" -ForegroundColor Yellow
}

# Step 5: Navigate to root and start frontend
Write-Host ""
Write-Host "Step 5: Starting frontend server..." -ForegroundColor Yellow
Set-Location ..

# Check if frontend dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installing frontend dependencies..." -ForegroundColor Gray
    npm install
}

# Create .env.local if it doesn't exist
if (-not (Test-Path .env.local)) {
    "NEXT_PUBLIC_API_URL=http://localhost:3001/api" | Out-File -FilePath .env.local -Encoding utf8
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  CrowdAid is starting up!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "   Frontend:      http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API:   http://localhost:3001" -ForegroundColor White
Write-Host "   API Docs:      http://localhost:3001/api/docs" -ForegroundColor White
Write-Host "   MailHog UI:    http://localhost:8025" -ForegroundColor White
Write-Host "   MinIO Console: http://localhost:9001" -ForegroundColor White
Write-Host ""
Write-Host "Demo Credentials:" -ForegroundColor Cyan
Write-Host "   Admin:      admin@crowdaid.in / admin123" -ForegroundColor White
Write-Host "   User:       demo@crowdaid.in / demo123" -ForegroundColor White
Write-Host "   Volunteer:  volunteer@crowdaid.in / volunteer123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Start frontend (this blocks)
npm run dev

# Cleanup on exit
Write-Host ""
Write-Host "Stopping services..." -ForegroundColor Yellow
if ($backendProcess -and -not $backendProcess.HasExited) {
    Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
}
if (Test-Path $backendScriptPath) {
    Remove-Item $backendScriptPath -Force -ErrorAction SilentlyContinue
}
docker-compose -f backend/docker-compose.yml down 2>&1 | Out-Null
Write-Host "All services stopped" -ForegroundColor Green
