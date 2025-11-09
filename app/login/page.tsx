"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Try backend API first
      const { authApi } = await import("@/lib/api-client")
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })

      if (response.data?.requires2FA) {
        // Handle 2FA flow
        setError("2FA verification required")
        return
      }

      if (response.data?.user) {
        const user = response.data.user
        localStorage.setItem(
          "crowdaid_user",
          JSON.stringify({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            type: user.userType.toLowerCase(),
            loginTime: new Date().toISOString(),
          }),
        )
        
        // Redirect based on user type
        if (user.role === "ADMIN" || user.type === "admin") {
          router.push("/admin-dashboard")
        } else if (user.userType === "VOLUNTEER" || user.type === "volunteer") {
          router.push("/volunteer-dashboard")
        } else {
          router.push("/dashboard")
        }
        return
      }

      throw new Error("Login failed")
    } catch (err) {
      // Fallback to demo credentials if backend is not available
      if (formData.email === "admin@crowdaid.in" && formData.password === "admin123") {
        localStorage.setItem(
          "crowdaid_user",
          JSON.stringify({
            email: formData.email,
            name: "Admin User",
            type: "admin",
            role: "ADMIN",
            loginTime: new Date().toISOString(),
          }),
        )
        router.push("/admin-dashboard")
        return
      } else if (formData.email === "demo@crowdaid.in" && formData.password === "demo123") {
        localStorage.setItem(
          "crowdaid_user",
          JSON.stringify({
            email: formData.email,
            name: "Demo User",
            type: "user",
            loginTime: new Date().toISOString(),
          }),
        )
        router.push("/dashboard")
        return
      } else if (formData.email === "volunteer@crowdaid.in" && formData.password === "volunteer123") {
        localStorage.setItem(
          "crowdaid_user",
          JSON.stringify({
            email: formData.email,
            name: "Demo Volunteer",
            type: "volunteer",
            loginTime: new Date().toISOString(),
          }),
        )
        router.push("/volunteer-dashboard")
        return
      }
      
      setError(err instanceof Error ? err.message : "Login failed. Make sure backend is running.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = "http://localhost:3001/api/auth/google"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CrowdAid</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your emergency assistance account</p>
        </div>

        {/* Demo Credentials Info */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Demo Credentials</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>User:</strong> demo@crowdaid.in / demo123
              </p>
              <p>
                <strong>Volunteer:</strong> volunteer@crowdaid.in / volunteer123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full bg-transparent" disabled={isLoading}>
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up here
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Emergency Access */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Need immediate help?</p>
          <Link href="/">
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
              Emergency Access (No Login Required)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
