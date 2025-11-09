#!/bin/bash

echo "🚀 Setting up CrowdAid Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration!"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Seed database
echo "🌱 Seeding database..."
npm run prisma:seed

echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run: npm run start:dev"
echo ""
echo "🌐 Access points:"
echo "- API: http://localhost:3001"
echo "- API Docs: http://localhost:3001/api/docs"
echo "- MailHog UI: http://localhost:8025"
echo "- MinIO Console: http://localhost:9001"

