# 🚀 How to Run CrowdAid

## Quick Start

**You need to be in the CrowdAid directory!**

### Step 1: Navigate to the project

```powershell
cd D:\CrowdAid
```

### Step 2: Make sure Docker Desktop is running

Open Docker Desktop application and wait until it's fully started (green icon).

### Step 3: Run the startup script

```powershell
.\start-crowdaid.ps1
```

## Alternative: Manual Steps

If the script doesn't work, you can start everything manually:

### Terminal 1 - Backend:

```powershell
cd D:\CrowdAid\backend
docker-compose up -d
npm run start:dev
```

### Terminal 2 - Frontend:

```powershell
cd D:\CrowdAid
npm run dev
```

## ⚠️ Common Issues

### "Script not found" error
- Make sure you're in `D:\CrowdAid` directory
- Check: `dir start-crowdaid.ps1` should show the file

### "Execution policy" error
Run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Docker not starting
- Make sure Docker Desktop is running
- Check: `docker ps` should work without errors

## 📍 Your Current Location

You're currently in: `C:\Users\as823\projects`

You need to be in: `D:\CrowdAid`

## ✅ Quick Fix

Just copy and paste these commands:

```powershell
cd D:\CrowdAid
.\start-crowdaid.ps1
```

---

**Once running, access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

