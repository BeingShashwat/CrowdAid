# 🎉 CrowdAid is Running!

## ✅ Status

Your CrowdAid platform is now running!

## 🌐 Access Your Application

### Main Application
**Frontend:** http://localhost:3000

This is your main CrowdAid application where you can:
- Browse the homepage
- Register new users
- Login with existing accounts
- Use all features

### Backend API
**Backend API:** http://localhost:3001  
**API Documentation:** http://localhost:3001/api/docs

The backend provides:
- REST API endpoints
- Interactive API documentation (Swagger)
- Authentication endpoints
- All backend services

### Development Tools
**MailHog UI:** http://localhost:8025  
View all test emails sent during development

**MinIO Console:** http://localhost:9001  
Manage file storage (login: minioadmin / minioadmin)

## 👤 Demo Credentials

You can login with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@crowdaid.in | admin123 |
| User | demo@crowdaid.in | demo123 |
| Volunteer | volunteer@crowdaid.in | volunteer123 |

## 🚀 What to Do Now

1. **Open your browser** and go to: http://localhost:3000

2. **Try registering** a new account:
   - Go to http://localhost:3000/signup
   - Fill in the form
   - Check MailHog at http://localhost:8025 to see the verification email

3. **Try logging in** with demo credentials:
   - Go to http://localhost:3000/login
   - Use: demo@crowdaid.in / demo123

4. **Explore the API**:
   - Visit http://localhost:3001/api/docs
   - Try the "Authorize" button with your JWT token
   - Test endpoints interactively

## 🔍 Check Backend Status

The backend should be running in a **separate PowerShell window**. If you don't see it:

1. Check if port 3001 is responding: http://localhost:3001
2. If not, manually start the backend:
   ```powershell
   cd backend
   npm run start:dev
   ```

## 📝 Notes

- The warnings about "metadata viewport" are just Next.js warnings and don't affect functionality
- The frontend will automatically connect to the backend API
- All services (database, Redis, email, storage) are running in Docker

## 🛑 To Stop Everything

Press `Ctrl+C` in the frontend terminal, then:
```powershell
docker-compose -f backend/docker-compose.yml down
```

Or close all PowerShell windows.

---

**Enjoy building with CrowdAid!** 🎉

