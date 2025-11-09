# Backend Integration Guide

This guide explains how to integrate the CrowdAid backend with your Next.js frontend.

## Overview

The backend is a complete NestJS API with:
- **Authentication**: JWT, Sessions, OAuth, 2FA
- **Database**: PostgreSQL with Prisma
- **Caching**: Redis
- **Storage**: MinIO (S3-compatible)
- **Email**: MailHog (dev) / SMTP (prod)
- **Security**: Rate limiting, CORS, Helmet, validation

## API Base URL

Development: `http://localhost:3001/api`
Production: `https://your-domain.com/api`

## Authentication Flow

### 1. Register

```typescript
// app/api/auth/register/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  const response = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  return Response.json(await response.json());
}
```

### 2. Login

```typescript
// app/api/auth/login/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify(body),
  });
  
  const data = await response.json();
  
  // Store tokens in httpOnly cookies via Next.js API route
  // Or use localStorage for client-side (less secure)
  return Response.json(data);
}
```

### 3. Protected Routes

```typescript
// lib/api-client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function apiRequest(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('accessToken'); // Or get from cookies
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// Usage
const user = await apiRequest('/users/me');
```

## Update Frontend Pages

### Login Page

Update `app/login/page.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.requires2FA) {
      // Show 2FA input
      setShow2FA(true);
      setTempToken(data.tempToken);
      return;
    }

    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      router.push('/dashboard');
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

### Signup Page

Update `app/signup/page.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        userType: userType.toUpperCase(),
      }),
    });

    const data = await response.json();

    if (data.message) {
      setSuccess(data.message);
      setTimeout(() => router.push('/login'), 2000);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

## Environment Variables

Add to your Next.js `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## API Routes (Next.js Proxy)

Create API routes to proxy requests:

### `app/api/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  const data = await response.json();
  
  const nextResponse = NextResponse.json(data);
  
  // Set cookie if session token provided
  if (data.accessToken) {
    nextResponse.cookies.set('session', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
  
  return nextResponse;
}
```

## OAuth Integration

### Google OAuth

```typescript
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:3001/api/auth/google';
};
```

### GitHub OAuth

```typescript
const handleGitHubLogin = () => {
  window.location.href = 'http://localhost:3001/api/auth/github';
};
```

## 2FA Setup

```typescript
// Setup 2FA
const setupResponse = await apiRequest('/auth/2fa/setup', {
  method: 'POST',
});

// Show QR code
const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupResponse.otpAuthUrl)}`;

// Enable 2FA
await apiRequest('/auth/2fa/enable', {
  method: 'POST',
  body: JSON.stringify({ code: userInput }),
});
```

## Error Handling

```typescript
async function handleApiError(response: Response) {
  if (response.status === 401) {
    // Refresh token or redirect to login
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const newTokens = await apiRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      localStorage.setItem('accessToken', newTokens.accessToken);
      return newTokens;
    } else {
      window.location.href = '/login';
    }
  }
  
  const error = await response.json();
  throw new Error(error.message || 'An error occurred');
}
```

## Testing

1. Start backend: `cd backend && npm run start:dev`
2. Start frontend: `npm run dev`
3. Test registration/login flows
4. Check API docs: http://localhost:3001/api/docs

## Security Notes

1. **Never expose secrets** in client-side code
2. **Use httpOnly cookies** for tokens when possible
3. **Validate all inputs** on both frontend and backend
4. **Use HTTPS** in production
5. **Implement CSRF protection** for state-changing operations

## Next Steps

1. Update all API calls in frontend to use backend
2. Implement token refresh logic
3. Add error boundaries
4. Set up monitoring and logging
5. Configure production environment variables

