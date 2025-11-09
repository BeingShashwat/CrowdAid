# PowerShell setup script for Windows

Write-Host "🚀 Setting up CrowdAid Backend..." -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  Please update .env with your configuration!" -ForegroundColor Yellow
}

# Start Docker services
Write-Host "🐳 Starting Docker services..." -ForegroundColor Cyan
docker-compose up -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Run migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
npx prisma migrate dev --name init

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
npm run prisma:seed

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Yellow
Write-Host "1. Update .env file with your configuration"
Write-Host "2. Run: npm run start:dev"
Write-Host ""
Write-Host "🌐 Access points:" -ForegroundColor Cyan
Write-Host "- API: http://localhost:3001"
Write-Host "- API Docs: http://localhost:3001/api/docs"
Write-Host "- MailHog UI: http://localhost:8025"
Write-Host "- MinIO Console: http://localhost:9001"

