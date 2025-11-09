"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, User, Users, Loader2, AlertCircle, CheckCircle } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState<"user" | "volunteer">("user")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToEmergencyContact: false,
  })

  const validateForm = () => {
    if (!formData.firstName.trim()) throw new Error("First name is required")
    if (!formData.lastName.trim()) throw new Error("Last name is required")
    if (!formData.email.includes("@")) throw new Error("Please enter a valid email address")
    if (!formData.phone.trim()) throw new Error("Phone number is required")
    if (formData.password.length < 6) throw new Error("Password must be at least 6 characters")
    if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match")
    if (!formData.agreeToTerms) throw new Error("You must agree to the Terms of Service")
    if (!formData.agreeToEmergencyContact) throw new Error("Emergency contact consent is required")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      validateForm()

      // Try backend API
      try {
        const { authApi } = await import("@/lib/api-client")
        const response = await authApi.register({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          userType: userType.toUpperCase() as "USER" | "VOLUNTEER",
          phone: formData.phone,
          agreeToTerms: formData.agreeToTerms,
          emergencyContact: formData.agreeToEmergencyContact,
        })

        setSuccess(
          response.message || `Account created successfully! ${userType === "volunteer" ? "Please check your email for verification instructions." : "You can now sign in."}`,
        )

        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } catch (apiErr) {
        // Fallback if backend not available
        const userData = {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          type: userType,
          phone: formData.phone,
          registrationTime: new Date().toISOString(),
          verified: false,
        }

        localStorage.setItem("crowdaid_user", JSON.stringify(userData))

        setSuccess(
          `Account created successfully! ${userType === "volunteer" ? "Please check your email for verification instructions." : "You can now sign in."}`,
        )

        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
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

  const handleGoogleSignup = () => {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join CrowdAid</h1>
          <p className="text-gray-600">Create your emergency assistance account</p>
        </div>

        {/* User Type Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={userType === "user" ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setUserType("user")}
            >
              <User className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Get Help</div>
                <div className="text-xs opacity-70">Request assistance</div>
              </div>
            </Button>
            <Button
              type="button"
              variant={userType === "volunteer" ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setUserType("volunteer")}
            >
              <Users className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Volunteer</div>
                <div className="text-xs opacity-70">Help others</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Signup Form */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              {userType === "volunteer"
                ? "Join as a volunteer to help others in emergencies"
                : "Sign up to access emergency assistance services"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
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
                    placeholder="Create a strong password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToEmergencyContact"
                    name="agreeToEmergencyContact"
                    checked={formData.agreeToEmergencyContact}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreeToEmergencyContact: checked as boolean }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="agreeToEmergencyContact" className="text-sm">
                    I consent to being contacted during emergencies
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!formData.agreeToTerms || !formData.agreeToEmergencyContact || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : userType === "volunteer" ? (
                  "Join as Volunteer"
                ) : (
                  "Create Account"
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
                  onClick={handleGoogleSignup}
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
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in here
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Emergency Access */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Need immediate help?</p>
          <Link href="/">
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
              Emergency Access (No Registration Required)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
