# CrowdAid React Component Architecture

## Component Hierarchy

```
RootLayout (app/layout.tsx)
│
└── Home Page (app/page.tsx) - "use client"
    │
    ├── PWABanner
    │   └── [PWA Installation Logic]
    │
    ├── Navbar - "use client"
    │   ├── useState: isMenuOpen
    │   ├── Link (Next.js)
    │   ├── Button (UI Component)
    │   └── Mobile Menu (Conditional)
    │
    ├── HeroSection - "use client"
    │   ├── useState: selectedEmergency, sosActive, sosCountdown, nearbyVolunteers
    │   ├── useEffect: [Location Updates, Countdown Timer]
    │   ├── Emergency Type Selection
    │   ├── SOS Button (Interactive)
    │   ├── Location Status Card
    │   └── Stats Cards (3x)
    │
    ├── LocationCard - "use client"
    │   ├── useState: emergencies, isRefreshing, locationAccuracy
    │   ├── useEffect: [Real-time Updates]
    │   ├── Emergency List
    │   └── Refresh Controls
    │
    ├── VolunteerDashboard - "use client"
    │   ├── useState: volunteers, activeRequests, selectedFilter
    │   ├── Volunteer Stats
    │   ├── Active Requests
    │   └── Filter Controls
    │
    ├── AdminPanel - "use client"
    │   ├── useState: systemStats, alerts, selectedView
    │   ├── System Overview
    │   ├── Alert Management
    │   └── Analytics Dashboard
    │
    ├── Footer
    │   └── [Static Links and Info]
    │
    └── FloatingCallButton
        └── [Emergency Call Action]
```

## UI Component Library Structure

```
components/ui/
│
├── Form Components
│   ├── button.tsx        # CVA variants, forwardRef, Slot pattern
│   ├── input.tsx         # Controlled input with validation
│   ├── textarea.tsx      # Multi-line text input
│   ├── label.tsx         # Accessible form labels
│   ├── checkbox.tsx      # Radix UI checkbox primitive
│   ├── radio-group.tsx   # Radix UI radio primitive
│   ├── select.tsx        # Radix UI select primitive
│   ├── switch.tsx        # Radix UI switch primitive
│   ├── slider.tsx        # Radix UI slider primitive
│   └── form.tsx          # React Hook Form integration
│
├── Layout Components
│   ├── card.tsx          # Card, CardContent, CardHeader compound
│   ├── separator.tsx     # Visual dividers
│   ├── scroll-area.tsx   # Custom scrollbars
│   ├── resizable.tsx     # Resizable panels
│   ├── sidebar.tsx       # Collapsible sidebar
│   └── sheet.tsx         # Slide-out panels
│
├── Navigation Components
│   ├── breadcrumb.tsx    # Navigation breadcrumbs
│   ├── navigation-menu.tsx # Complex navigation
│   ├── menubar.tsx       # Menu bar component
│   ├── tabs.tsx          # Tabbed interface
│   └── pagination.tsx    # Data pagination
│
├── Feedback Components
│   ├── alert.tsx         # Alert messages
│   ├── badge.tsx         # Status badges
│   ├── progress.tsx      # Progress indicators
│   ├── skeleton.tsx      # Loading skeletons
│   ├── toast.tsx         # Toast notifications
│   ├── toaster.tsx       # Toast container
│   └── sonner.tsx        # Sonner toast library
│
├── Overlay Components
│   ├── dialog.tsx        # Modal dialogs
│   ├── alert-dialog.tsx  # Confirmation dialogs
│   ├── sheet.tsx         # Slide-out panels
│   ├── drawer.tsx        # Bottom drawer
│   ├── popover.tsx       # Floating popover
│   ├── tooltip.tsx       # Hover tooltips
│   ├── hover-card.tsx    # Hover preview cards
│   └── context-menu.tsx  # Right-click menus
│
├── Data Display
│   ├── avatar.tsx        # User avatars
│   ├── calendar.tsx      # Date picker calendar
│   ├── chart.tsx         # Chart components
│   ├── table.tsx         # Data tables
│   └── carousel.tsx      # Image/content carousel
│
└── Interactive Components
    ├── accordion.tsx     # Collapsible sections
    ├── collapsible.tsx   # Basic collapsible
    ├── command.tsx       # Command palette
    ├── dropdown-menu.tsx # Dropdown menus
    ├── toggle.tsx        # Toggle buttons
    ├── toggle-group.tsx  # Toggle button groups
    └── input-otp.tsx     # OTP input fields
```

## React Patterns in Components

### 1. **Compound Component Pattern**
```typescript
// Card component example
<Card className="bg-white/10 backdrop-blur-sm border-white/20">
  <CardHeader>
    <CardTitle>Emergency Status</CardTitle>
    <CardDescription>Real-time updates</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Content */}
    </div>
  </CardContent>
</Card>
```

### 2. **Render Props / Children Pattern**
```typescript
// Layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### 3. **Higher-Order Component Pattern** (via forwardRef)
```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
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
```

### 4. **Hook Pattern for Logic Reuse**
```typescript
// Custom hook
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

## State Management Flow

### 1. **Component-Level State**
```
HeroSection Component:
├── selectedEmergency (string | null)
├── sosActive (boolean)
├── sosCountdown (number)
└── nearbyVolunteers (number)
    │
    ├── useEffect: Location → nearbyVolunteers
    ├── useEffect: sosCountdown → countdown timer
    └── Event Handlers → state updates
```

### 2. **Props Down, Events Up**
```
Home Page
├── userLocation (state)
│   └── passed to → HeroSection, LocationCard
│
├── HeroSection
│   ├── receives: userLocation
│   └── handles: SOS events internally
│
└── LocationCard
    ├── receives: userLocation
    └── handles: emergency list updates
```

### 3. **Form State Management**
```
LoginPage Component:
├── formData (object state)
├── isLoading (boolean)
├── error (string)
├── showPassword (boolean)
│
├── handleChange → updates formData
├── handleSubmit → validates & submits
└── handleGoogleLogin → OAuth flow
```

## Component Communication Patterns

### 1. **Parent-Child Communication**
```typescript
// Parent passes props down
<HeroSection userLocation={userLocation} />

// Child receives props
interface HeroSectionProps {
  userLocation: LocationType | null
}
```

### 2. **Sibling Communication** (via Parent State)
```typescript
// Parent manages shared state
const [userLocation, setUserLocation] = useState(null)

// Both siblings receive same data
<HeroSection userLocation={userLocation} />
<LocationCard userLocation={userLocation} />
```

### 3. **Event Handling**
```typescript
// Button click handling
const handleSOS = () => {
  if (!selectedEmergency) {
    alert("Please select an emergency type first")
    return
  }
  setSosActive(true)
  setSosCountdown(180)
}

// Form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  // Handle form logic
}
```

## React Hooks Usage Pattern

### 1. **State Hooks**
```typescript
// Simple state
const [isMenuOpen, setIsMenuOpen] = useState(false)

// Complex state
const [formData, setFormData] = useState({
  email: "",
  password: "",
  rememberMe: false,
})
```

### 2. **Effect Hooks**
```typescript
// Component mount effect
useEffect(() => {
  // Get user's location on mount
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handlePosition)
  }
}, [])

// Cleanup effect
useEffect(() => {
  const interval = setInterval(updateData, 30000)
  return () => clearInterval(interval)
}, [])
```

### 3. **Custom Hook Pattern**
```typescript
// Hook definition
function useEmergencyData() {
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchEmergencies().then(setEmergencies).finally(() => setLoading(false))
  }, [])
  
  return { emergencies, loading }
}

// Hook usage
function EmergencyList() {
  const { emergencies, loading } = useEmergencyData()
  
  if (loading) return <div>Loading...</div>
  return <div>{emergencies.map(emergency => ...)}</div>
}
```

## Performance Optimization Patterns

### 1. **Conditional Rendering**
```typescript
// Only render when needed
{sosCountdown > 0 && (
  <div className="emergency-alert">
    Help arriving in: {formatTime(sosCountdown)}
  </div>
)}

// Mobile menu conditional
{isMenuOpen && (
  <div className="md:hidden">
    {/* Mobile navigation */}
  </div>
)}
```

### 2. **Effect Dependencies**
```typescript
// Optimized dependencies
useEffect(() => {
  if (userLocation) {
    updateNearbyVolunteers(userLocation)
  }
}, [userLocation]) // Only run when location changes

// Cleanup pattern
useEffect(() => {
  const interval = setInterval(updateCountdown, 1000)
  return () => clearInterval(interval)
}, [sosCountdown]) // Re-setup when countdown changes
```

### 3. **Component Memoization** (Recommended)
```typescript
// Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Complex rendering logic
  return <div>{/* Expensive render */}</div>
})

// Memoize callback functions
const handleSOS = useCallback(() => {
  // SOS handling logic
}, [selectedEmergency]) // Only recreate when dependency changes
```

This architecture demonstrates modern React patterns with proper separation of concerns, reusable components, and performance considerations.