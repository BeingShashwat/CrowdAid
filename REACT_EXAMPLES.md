# React.js Implementation Examples from CrowdAid

## Real Implementation Examples

This document shows actual code examples from the CrowdAid project demonstrating React.js patterns and best practices.

## 1. Main App Component with State Management

```typescript
// app/page.tsx - Main application component
"use client"

import { useState, useEffect } from "react"
import { Navbar } from "./components/Navbar"
import { HeroSection } from "./components/HeroSection"
import { LocationCard } from "./components/LocationCard"
import { VolunteerDashboard } from "./components/VolunteerDashboard"
import { AdminPanel } from "./components/AdminPanel"
import { Footer } from "./components/Footer"
import { FloatingCallButton } from "./components/FloatingCallButton"
import { PWABanner } from "./components/PWABanner"

export default function Home() {
  // State for user's location
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
    address: string
  } | null>(null)

  // Effect to get user's location on component mount
  useEffect(() => {
    // Get user's location using browser geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Current Location", // In real app, would reverse geocode
          })
        },
        (error) => {
          console.log("Location access denied:", error)
          // Set default location (Delhi) as fallback
          setUserLocation({
            latitude: 28.6139,
            longitude: 77.209,
            address: "New Delhi, India",
          })
        },
      )
    }
  }, []) // Empty dependency array - run once on mount

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PWABanner />
      <Navbar />
      <HeroSection userLocation={userLocation} />

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
              Emergency Services Dashboard
            </h2>
            <p className="text-lg text-gray-600 animate-fade-in animation-delay-200">
              Real-time emergency assistance coordination across India
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="animate-fade-in animation-delay-400">
              <LocationCard userLocation={userLocation} />
            </div>
            <div className="animate-fade-in animation-delay-600">
              <VolunteerDashboard />
            </div>
          </div>

          <div className="animate-fade-in animation-delay-800">
            <AdminPanel />
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCallButton />
    </main>
  )
}
```

## 2. Complex Component with Multiple State Variables

```typescript
// app/components/HeroSection.tsx - Emergency SOS component
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Users, MapPin, Clock, Phone, Shield, Heart, Car, Flame, Home } from "lucide-react"

interface HeroSectionProps {
  userLocation: {
    latitude: number
    longitude: number
    address: string
  } | null
}

const emergencyTypes = [
  {
    id: "medical",
    label: "Medical Emergency",
    icon: Heart,
    color: "bg-red-500",
    description: "Heart attack, injury, illness",
  },
  { 
    id: "fire", 
    label: "Fire Emergency", 
    icon: Flame, 
    color: "bg-orange-500", 
    description: "Building fire, smoke" 
  },
  {
    id: "accident",
    label: "Vehicle Accident",
    icon: Car,
    color: "bg-yellow-500",
    description: "Road accident, breakdown",
  },
  { 
    id: "crime", 
    label: "Personal Safety", 
    icon: Shield, 
    color: "bg-purple-500", 
    description: "Harassment, theft" 
  },
  { 
    id: "disaster", 
    label: "Natural Disaster", 
    icon: Home, 
    color: "bg-green-500", 
    description: "Flood, earthquake" 
  },
  { 
    id: "other", 
    label: "Other Emergency", 
    icon: AlertTriangle, 
    color: "bg-blue-500", 
    description: "Any other crisis" 
  },
]

export function HeroSection({ userLocation }: HeroSectionProps) {
  // Multiple state variables for different UI concerns
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null)
  const [sosActive, setSosActive] = useState(false)
  const [sosCountdown, setSosCountdown] = useState(0)
  const [nearbyVolunteers, setNearbyVolunteers] = useState(0)

  // Effect to simulate nearby volunteers count based on location
  useEffect(() => {
    if (userLocation) {
      const count = Math.floor(Math.random() * 50) + 20
      setNearbyVolunteers(count)
    }
  }, [userLocation]) // Depend on userLocation prop

  // Effect for countdown timer with cleanup
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (sosCountdown > 0) {
      interval = setInterval(() => {
        setSosCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval) // Cleanup on unmount or dependency change
  }, [sosCountdown])

  // Event handler for SOS button
  const handleSOS = () => {
    // Validation before proceeding
    if (!selectedEmergency) {
      alert("Please select an emergency type first")
      return
    }

    setSosActive(true)
    setSosCountdown(180) // 3 minutes countdown

    // Simulate emergency dispatch (in real app, would call API)
    setTimeout(() => {
      setSosActive(false)
      setSosCountdown(0)
    }, 10000) // Reset after 10 seconds for demo
  }

  // Event handler for emergency call
  const handleEmergencyCall = () => {
    window.open("tel:112", "_self")
  }

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto">
        {/* Conditional rendering based on location state */}
        {userLocation && (
          <div className="text-center mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 inline-block">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Location: {userLocation.address}</span>
                  <Badge className="bg-green-500 text-white">
                    {nearbyVolunteers} volunteers nearby
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Emergency Help
            <span className="block text-yellow-400">When You Need It Most</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            Connect with verified volunteers and emergency services across India. 
            Fast, reliable assistance powered by community support.
          </p>

          {/* Emergency Type Selection - List rendering with event handling */}
          <div className="mb-12 animate-fade-in animation-delay-400">
            <h3 className="text-xl text-white mb-6">Select Emergency Type:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {emergencyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedEmergency(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedEmergency === type.id
                      ? "border-yellow-400 bg-yellow-400/20 scale-105"
                      : "border-white/30 bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <type.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white text-sm font-medium">{type.label}</div>
                  <div className="text-blue-100 text-xs mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* SOS Button with conditional styling */}
          <div className="mb-12 animate-fade-in animation-delay-600">
            <button
              onClick={handleSOS}
              disabled={!selectedEmergency || sosActive}
              className={`relative w-52 h-52 sm:w-60 sm:h-60 rounded-full font-bold text-3xl sm:text-4xl shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                sosActive
                  ? "bg-gradient-to-br from-green-500 to-green-600 text-white animate-pulse"
                  : "bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
              }`}
              style={{
                boxShadow: sosActive
                  ? "0 0 80px rgba(34, 197, 94, 0.7), 0 0 160px rgba(34, 197, 94, 0.4)"
                  : "0 25px 50px rgba(0, 0, 0, 0.15)",
              }}
              aria-label="Send SOS Emergency Alert"
            >
              <span className="relative z-10">{sosActive ? "HELP COMING" : "SEND SOS"}</span>
              {sosActive && <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>}
            </button>

            {/* Conditional rendering of countdown */}
            {sosCountdown > 0 && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
                <p className="font-semibold text-lg">🚨 Emergency Alert Sent!</p>
                <p className="text-sm">
                  Help arriving in: {Math.floor(sosCountdown / 60)}:
                  {(sosCountdown % 60).toString().padStart(2, "0")}
                </p>
                <p className="text-xs mt-1">{nearbyVolunteers} volunteers and emergency services notified</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in animation-delay-800">
            <Button
              onClick={handleEmergencyCall}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg"
            >
              <Phone className="mr-2 h-6 w-6" />
              Call 112 (Emergency)
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg"
            >
              <Users className="mr-2 h-6 w-6" />
              Become a Volunteer
            </Button>
          </div>
        </div>

        {/* Stats Cards - Static data display */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 animate-fade-in animation-delay-1000">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">1,247</h3>
              <p className="text-blue-100">Active Volunteers</p>
              <p className="text-xs text-blue-200 mt-1">Online now</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <MapPin className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">28</h3>
              <p className="text-blue-100">Cities Covered</p>
              <p className="text-xs text-blue-200 mt-1">Across India</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">2.3 min</h3>
              <p className="text-blue-100">Avg Response Time</p>
              <p className="text-xs text-blue-200 mt-1">Getting faster</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
```

## 3. Form Handling with Controlled Components

```typescript
// app/login/page.tsx - Login form with state management
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
  
  // Multiple state variables for form management
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Controlled form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Client-side validation
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields")
      }

      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      // Demo credentials check
      if (formData.email === "demo@crowdaid.in" && formData.password === "demo123") {
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
      } else {
        throw new Error("Invalid credentials. Try demo@crowdaid.in / demo123 or volunteer@crowdaid.in / volunteer123")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Input change handler for controlled components
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Google OAuth simulation
  const handleGoogleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem(
        "crowdaid_user",
        JSON.stringify({
          email: "user@gmail.com",
          name: "Google User",
          type: "user",
          loginTime: new Date().toISOString(),
        }),
      )
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Shield className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CrowdAid</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600">Sign in to your emergency assistance account</p>
        </div>

        <Card className="bg-white shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Alert - Conditional rendering */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>

                {/* Password Input with Toggle */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                    Remember me for 30 days
                  </Label>
                </div>
              </div>

              {/* Submit Button with Loading State */}
              <Button type="submit" className="w-full h-12" disabled={isLoading}>
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

            {/* OAuth Buttons */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
              {isLoading ? "Connecting..." : "Continue with Google"}
            </Button>

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p>User: demo@crowdaid.in / demo123</p>
                <p>Volunteer: volunteer@crowdaid.in / volunteer123</p>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

## 4. Custom Hook Implementation

```typescript
// hooks/use-mobile.tsx - Custom hook for responsive behavior
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // State to track mobile status
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create media query list
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handler for media query changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener
    mql.addEventListener("change", onChange)
    
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup function
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array - setup once

  return !!isMobile
}

// Usage example in component:
// const isMobile = useIsMobile()
// return isMobile ? <MobileView /> : <DesktopView />
```

## 5. UI Component with Variants (CVA Pattern)

```typescript
// components/ui/button.tsx - Button component with variants
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Class Variance Authority configuration
const buttonVariants = cva(
  // Base classes applied to all buttons
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      // Different visual styles
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Different sizes
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    // Default values when no variant is specified
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// TypeScript interface extending HTML button props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// Forward ref implementation for proper ref passing
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Use Slot for polymorphic behavior or regular button
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

// Usage examples:
// <Button>Default Button</Button>
// <Button variant="outline" size="lg">Large Outline Button</Button>
// <Button variant="destructive" size="sm">Small Destructive Button</Button>
// <Button asChild><Link to="/somewhere">Button as Link</Link></Button>
```

## 6. Real-time Data Updates Pattern

```typescript
// app/components/LocationCard.tsx - Component with live data updates
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, AlertTriangle, RefreshCw } from "lucide-react"

interface LocationCardProps {
  userLocation: {
    latitude: number
    longitude: number
    address: string
  } | null
}

export function LocationCard({ userLocation }: LocationCardProps) {
  // State for emergency data
  const [emergencies, setEmergencies] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      type: "Medical Emergency",
      location: "Connaught Place, New Delhi",
      distance: "0.8 km",
      volunteers: 12,
      timeAgo: "2 min ago",
      severity: "high",
      description: "Chest pain, needs immediate medical attention",
      status: "active",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      type: "Vehicle Breakdown",
      location: "MG Road, Bangalore",
      distance: "1.2 km",
      volunteers: 8,
      timeAgo: "5 min ago",
      severity: "medium",
      description: "Car breakdown on highway, family with children",
      status: "responding",
    },
    {
      id: 3,
      name: "Anita Patel",
      type: "Lost Person",
      location: "Marine Drive, Mumbai",
      distance: "2.1 km",
      volunteers: 15,
      timeAgo: "8 min ago",
      severity: "low",
      description: "Elderly person missing from family gathering",
      status: "active",
    },
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [locationAccuracy, setLocationAccuracy] = useState("High")

  // Effect for simulating real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEmergencies((prev) =>
        prev.map((emergency) => ({
          ...emergency,
          timeAgo: updateTimeAgo(emergency.timeAgo),
          volunteers:
            emergency.status === "active" 
              ? emergency.volunteers + Math.floor(Math.random() * 3) 
              : emergency.volunteers,
        })),
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval) // Cleanup
  }, [])

  // Helper function to update time
  const updateTimeAgo = (timeAgo: string) => {
    const minutes = Number.parseInt(timeAgo.split(" ")[0])
    return `${minutes + 1} min ago`
  }

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Simulate new data
    setEmergencies((prev) =>
      prev.map((emergency) => ({
        ...emergency,
        volunteers: Math.floor(Math.random() * 20) + 5,
        timeAgo: `${Math.floor(Math.random() * 10) + 1} min ago`,
      })),
    )
    
    setIsRefreshing(false)
  }

  // Severity color mapping
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-red-600 bg-red-50"
      case "responding":
        return "text-blue-600 bg-blue-50"
      case "resolved":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <Card className="bg-white shadow-lg border-0 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            Nearby Emergencies
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Updating..." : "Refresh"}
          </Button>
        </div>
        
        {/* Location status */}
        {userLocation && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>GPS: {locationAccuracy}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Range: 5km</span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* List rendering with conditional classes */}
          {emergencies.map((emergency) => (
            <div
              key={emergency.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{emergency.name}</h4>
                    <Badge className={getStatusColor(emergency.status)}>
                      {emergency.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{emergency.type}</p>
                  <p className="text-xs text-gray-500 mb-2">{emergency.description}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(emergency.severity)}`}></div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {emergency.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {emergency.volunteers} responding
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {emergency.timeAgo}
                </div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="h-7 text-xs flex-1">
                  Volunteer
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty state */}
        {emergencies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No emergencies in your area</p>
            <p className="text-xs">Check back later or expand search radius</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

These examples demonstrate the real React.js patterns used in the CrowdAid project, showing modern React development with proper TypeScript integration, component composition, state management, and user interaction handling.