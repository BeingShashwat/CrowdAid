"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Star,
  Award,
  TrendingUp,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
  Heart,
  Shield,
  LogOut,
  Navigation,
  Target,
} from "lucide-react"
import { authApi, emergencyApi, userApi } from "@/lib/api-client"

export default function VolunteerDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [volunteerProfile, setVolunteerProfile] = useState<any>(null)
  const [emergencies, setEmergencies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalResponses: 0,
    successfulHelps: 0,
    rating: 0,
    responseTime: "0 min",
  })

  useEffect(() => {
    loadUserData()
    loadEmergencies()
  }, [])

  const loadUserData = async () => {
    try {
      const userData = localStorage.getItem("crowdaid_user")
      if (!userData) {
        router.push("/login")
        return
      }

      try {
        const response = await userApi.getProfile()
        if (response.data) {
          setUser(response.data)
          if (response.data.volunteerProfiles) {
            setVolunteerProfile(response.data.volunteerProfiles[0])
            setStats({
              totalResponses: response.data.volunteerProfiles[0]?.totalResponses || 0,
              successfulHelps: response.data.volunteerProfiles[0]?.successfulHelps || 0,
              rating: response.data.volunteerProfiles[0]?.rating || 0,
              responseTime: "1.2 min",
            })
          }
        } else {
          const parsed = JSON.parse(userData)
          setUser(parsed)
        }
      } catch {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Failed to load user:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const loadEmergencies = async () => {
    try {
      const response = await emergencyApi.getAll()
      if (response.data) {
        // Filter for available emergencies (pending or assigned)
        const available = response.data.filter(
          (e: any) => e.status === "PENDING" || e.status === "ASSIGNED"
        )
        setEmergencies(available)
      }
    } catch (error) {
      console.error("Failed to load emergencies:", error)
    }
  }

  const handleRespond = async (emergencyId: string) => {
    try {
      await emergencyApi.respond(emergencyId, "I'm on my way to help!")
      alert("Response sent! The requester has been notified.")
      loadEmergencies()
    } catch (error: any) {
      alert(error.message || "Failed to respond")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("crowdaid_user")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/")
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      CRITICAL: "bg-red-100 text-red-800 border-red-300",
      HIGH: "bg-orange-100 text-orange-800 border-orange-300",
      MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-300",
      LOW: "bg-green-100 text-green-800 border-green-300",
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Volunteer Dashboard</h1>
                <p className="text-sm text-gray-500">
                  {user?.firstName || user?.name || "Volunteer"} • Ready to help
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push("/")}>
                <MapPin className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Total Helps</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalResponses}</div>
              <p className="text-xs text-purple-600 mt-1">People helped</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.totalResponses > 0
                  ? Math.round((stats.successfulHelps / stats.totalResponses) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-green-600 mt-1">Successful assists</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-900">Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats.rating > 0 ? stats.rating.toFixed(1) : "N/A"}
              </div>
              <p className="text-xs text-yellow-600 mt-1">Average rating</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.responseTime}</div>
              <p className="text-xs text-blue-600 mt-1">Average response</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="emergencies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emergencies">Available Emergencies</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Emergencies Tab */}
          <TabsContent value="emergencies" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Emergency Requests Near You</h2>
                <p className="text-gray-600 mt-1">Help those in need in your area</p>
              </div>
            </div>

            {emergencies.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Emergencies</h3>
                  <p className="text-gray-600 mb-4">
                    There are currently no emergency requests in your area.
                  </p>
                  <p className="text-sm text-gray-500">Check back soon or enable notifications!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {emergencies.map((emergency: any) => (
                  <Card
                    key={emergency.id}
                    className="hover:shadow-xl transition-all border-l-4 border-l-red-500"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className="text-xl">{emergency.title}</CardTitle>
                            <Badge className={getPriorityColor(emergency.priority)}>
                              {emergency.priority}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center space-x-4 mt-2">
                            <span className="flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {emergency.type}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(emergency.createdAt).toLocaleString()}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{emergency.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {emergency.location?.address || "Location not specified"}
                        </div>
                        {emergency.user?.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {emergency.user.phone}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleRespond(emergency.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Respond to Emergency
                        </Button>
                        <Button variant="outline">
                          <MapPin className="h-4 w-4 mr-2" />
                          View Location
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Volunteer Profile
                </CardTitle>
                <CardDescription>Your volunteer information and stats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <p className="text-gray-900 mt-1">
                          {user?.firstName || ""} {user?.lastName || ""}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900 mt-1">{user?.email || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-gray-900 mt-1">{user?.phone || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Volunteer Stats</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700">Verification Status</span>
                          <Badge variant={volunteerProfile?.isVerified ? "default" : "secondary"}>
                            {volunteerProfile?.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                      {volunteerProfile?.skills && volunteerProfile.skills.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Skills</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {volunteerProfile.skills.map((skill: string, idx: number) => (
                              <Badge key={idx} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Response History</CardTitle>
                <CardDescription>Your past emergency responses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No response history yet. Start helping to build your record!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

