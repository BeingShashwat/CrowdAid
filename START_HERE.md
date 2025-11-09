# 🚀 CrowdAid - Quick Start Guide

## ✅ Everything is Set Up!

Your CrowdAid platform is ready to run with integrated frontend and backend.

## 🎯 How to Start Everything

### Option 1: One-Command Start (Recommended)

Simply run this command from the project root:

```powershell
.\start-crowdaid.ps1
```

This script will:
- ✅ Start Docker services (PostgreSQL, Redis, MailHog, MinIO)
- ✅ Set up the database
- ✅ Start the backend server
- ✅ Start the frontend server
- ✅ Show you all access links

### Option 2: Manual Start

If you prefer manual control:

```powershell
# Terminal 1: Start Docker & Backend
cd backend
docker-compose up -d
npm run start:dev

# Terminal 2: Start Frontend
cd ..
npm run dev
```

## 🌐 Access Links

Once everything is running, access your application at:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Your main application |
| **Backend API** | http://localhost:3001 | REST API |
| **API Documentation** | http://localhost:3001/api/docs | Swagger/OpenAPI docs |
| **MailHog UI** | http://localhost:8025 | View test emails |
| **MinIO Console** | http://localhost:9001 | File storage console |

## 👤 Demo Credentials

After the database is seeded, you can login with:

- **Admin**: `admin@crowdaid.in` / `admin123`
- **User**: `demo@crowdaid.in` / `demo123`
- **Volunteer**: `volunteer@crowdaid.in` / `volunteer123`

## 🔧 Prerequisites

Make sure you have:
- ✅ Node.js 20+ installed
- ✅ Docker Desktop installed and running
- ✅ npm or yarn installed

## 📝 First Time Setup

If this is your first time:

1. **Start Docker Desktop** (if not already running)

2. **Run the startup script**:
   ```powershell
   .\start-crowdaid.ps1
   ```

3. **Wait for everything to start** (about 30-60 seconds)

4. **Open your browser** to http://localhost:3000

## 🎨 Features

- ✅ User Registration & Login
- ✅ Email Verification
- ✅ Password Reset
- ✅ OAuth (Google, GitHub)
- ✅ Two-Factor Authentication (2FA)
- ✅ Emergency Request System
- ✅ Volunteer Management
- ✅ Notifications
- ✅ File Uploads
- ✅ Real-time Updates

## 🐛 Troubleshooting

### Docker not starting?
- Make sure Docker Desktop is running
- Check if ports 3000, 3001, 5432, 6379, 8025, 9000, 9001 are available

### Database errors?
- Wait a few seconds for PostgreSQL to fully start
- Run manually: `cd backend && npx prisma migrate dev && npm run prisma:seed`

### Port already in use?
- Change `PORT` in `backend/.env` for backend
- Change port in `package.json` scripts for frontend

### Backend not connecting?
- Check if backend is running: http://localhost:3001/api/docs
- Verify Docker services: `docker ps`

## 📚 Documentation

- **Backend README**: `backend/README.md`
- **API Documentation**: http://localhost:3001/api/docs
- **Architecture Guide**: `backend/ARCHITECTURE.md`
- **Integration Guide**: `BACKEND_INTEGRATION.md`

## 🎉 You're All Set!

Everything is integrated and ready to go. Just run `.\start-crowdaid.ps1` and start building!

---

**Need Help?** Check the logs or open an issue on GitHub.

