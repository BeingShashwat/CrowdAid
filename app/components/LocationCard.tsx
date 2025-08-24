"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, AlertTriangle, RefreshCw, Navigation, Phone } from "lucide-react"

interface LocationCardProps {
  userLocation: {
    latitude: number
    longitude: number
    address: string
  } | null
}

export function LocationCard({ userLocation }: LocationCardProps) {
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

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setEmergencies((prev) =>
        prev.map((emergency) => ({
          ...emergency,
          timeAgo: updateTimeAgo(emergency.timeAgo),
          volunteers:
            emergency.status === "active" ? emergency.volunteers + Math.floor(Math.random() * 3) : emergency.volunteers,
        })),
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const updateTimeAgo = (timeAgo: string) => {
    const minutes = Number.parseInt(timeAgo.split(" ")[0])
    return `${minutes + 1} min ago`
  }

  const handleRefreshLocation = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setLocationAccuracy("High")
    }, 2000)
  }

  const handleRespondToEmergency = (emergencyId: number) => {
    setEmergencies((prev) =>
      prev.map((emergency) =>
        emergency.id === emergencyId
          ? { ...emergency, status: "responding", volunteers: emergency.volunteers + 1 }
          : emergency,
      ),
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800"
      case "responding":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="h-full shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Nearby Emergencies
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefreshLocation} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        {userLocation && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Navigation className="h-4 w-4" />
            <span>Your location: {userLocation.address}</span>
            <Badge variant="outline" className="text-green-600 border-green-600">
              GPS: {locationAccuracy}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {emergencies.map((emergency) => (
          <div key={emergency.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getSeverityColor(emergency.severity)}>{emergency.type}</Badge>
                  <Badge className={getStatusColor(emergency.status)}>{emergency.status}</Badge>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {emergency.timeAgo}
                  </span>
                </div>
                <p className="font-medium text-gray-900">{emergency.name}</p>
                <p className="text-sm text-gray-600 mb-2">{emergency.location}</p>
                <p className="text-xs text-gray-500 bg-gray-50 rounded p-2">{emergency.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {emergency.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {emergency.volunteers} volunteers
                  </span>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              className="w-full"
              onClick={() => handleRespondToEmergency(emergency.id)}
              disabled={emergency.status === "responding"}
            >
              {emergency.status === "responding" ? "Response En Route" : "Respond to Emergency"}
            </Button>
          </div>
        ))}

        <Button variant="outline" className="w-full mt-4 bg-transparent">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report New Emergency
        </Button>

        {/* Emergency Services Quick Dial */}
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-medium text-red-900 mb-3">Emergency Services</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button className="flex items-center gap-2 p-2 bg-white rounded hover:bg-red-50 transition-colors">
              <Phone className="h-4 w-4 text-red-600" />
              <span>Police: 100</span>
            </button>
            <button className="flex items-center gap-2 p-2 bg-white rounded hover:bg-red-50 transition-colors">
              <Phone className="h-4 w-4 text-red-600" />
              <span>Fire: 101</span>
            </button>
            <button className="flex items-center gap-2 p-2 bg-white rounded hover:bg-red-50 transition-colors">
              <Phone className="h-4 w-4 text-red-600" />
              <span>Ambulance: 102</span>
            </button>
            <button className="flex items-center gap-2 p-2 bg-white rounded hover:bg-red-50 transition-colors">
              <Phone className="h-4 w-4 text-red-600" />
              <span>Emergency: 112</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
