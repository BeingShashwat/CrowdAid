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
  { id: "fire", label: "Fire Emergency", icon: Flame, color: "bg-orange-500", description: "Building fire, smoke" },
  {
    id: "accident",
    label: "Vehicle Accident",
    icon: Car,
    color: "bg-yellow-500",
    description: "Road accident, breakdown",
  },
  { id: "crime", label: "Personal Safety", icon: Shield, color: "bg-purple-500", description: "Harassment, theft" },
  { id: "disaster", label: "Natural Disaster", icon: Home, color: "bg-green-500", description: "Flood, earthquake" },
  { id: "other", label: "Other Emergency", icon: AlertTriangle, color: "bg-blue-500", description: "Any other crisis" },
]

export function HeroSection({ userLocation }: HeroSectionProps) {
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null)
  const [sosActive, setSosActive] = useState(false)
  const [sosCountdown, setSosCountdown] = useState(0)
  const [nearbyVolunteers, setNearbyVolunteers] = useState(0)

  useEffect(() => {
    // Simulate nearby volunteers count based on location
    if (userLocation) {
      const count = Math.floor(Math.random() * 50) + 20
      setNearbyVolunteers(count)
    }
  }, [userLocation])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (sosCountdown > 0) {
      interval = setInterval(() => {
        setSosCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [sosCountdown])

  const handleSOS = () => {
    if (!selectedEmergency) {
      alert("Please select an emergency type first")
      return
    }

    setSosActive(true)
    setSosCountdown(180) // 3 minutes countdown

    // Simulate emergency dispatch
    setTimeout(() => {
      setSosActive(false)
      setSosCountdown(0)
    }, 10000) // Reset after 10 seconds for demo
  }

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
        {/* Location Status */}
        {userLocation && (
          <div className="text-center mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 inline-block">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Location: {userLocation.address}</span>
                  <Badge className="bg-green-500 text-white">{nearbyVolunteers} volunteers nearby</Badge>
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
            Connect with verified volunteers and emergency services across India. Fast, reliable assistance powered by
            community support.
          </p>

          {/* Emergency Type Selection */}
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

          {/* SOS Button */}
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

            {sosCountdown > 0 && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
                <p className="font-semibold text-lg">🚨 Emergency Alert Sent!</p>
                <p className="text-sm">
                  Help arriving in: {Math.floor(sosCountdown / 60)}:{(sosCountdown % 60).toString().padStart(2, "0")}
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

        {/* Stats Cards */}
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
