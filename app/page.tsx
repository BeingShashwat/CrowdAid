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
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
    address: string
  } | null>(null)

  useEffect(() => {
    // Get user's location
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
          // Set default location (Delhi)
          setUserLocation({
            latitude: 28.6139,
            longitude: 77.209,
            address: "New Delhi, India",
          })
        },
      )
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PWABanner />
      <Navbar />
      <HeroSection userLocation={userLocation} />

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">Emergency Services Dashboard</h2>
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
