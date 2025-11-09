"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Plus,
  User,
  Settings,
  Bell,
  Heart,
  Shield,
  LogOut,
} from "lucide-react"
import { authApi, emergencyApi, userApi } from "@/lib/api-client"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [emergencies, setEmergencies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    active: 0,
    resolved: 0,
    pending: 0,
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
        } else {
          setUser(JSON.parse(userData))
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
        setEmergencies(response.data)
        const active = response.data.filter((e: any) => e.status === "PENDING" || e.status === "ASSIGNED").length
        const resolved = response.data.filter((e: any) => e.status === "RESOLVED").length
        const pending = response.data.filter((e: any) => e.status === "PENDING").length
        setStats({ active, resolved, pending })
      }
    } catch (error) {
      console.error("Failed to load emergencies:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("crowdaid_user")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/")
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PENDING: "outline",
      ASSIGNED: "secondary",
      IN_PROGRESS: "default",
      RESOLVED: "default",
      CANCELLED: "destructive",
    }
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      ASSIGNED: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-purple-100 text-purple-800",
      RESOLVED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CrowdAid Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {user?.firstName || user?.name || "User"}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Active Requests</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.active}</div>
              <p className="text-xs text-blue-600 mt-1">Currently active emergencies</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-xs text-green-600 mt-1">Successfully resolved</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-yellow-600 mt-1">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="emergencies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emergencies">My Emergencies</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Emergencies Tab */}
          <TabsContent value="emergencies" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Emergency Requests</h2>
              <Button onClick={() => router.push("/support")}>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>

            {emergencies.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Emergency Requests</h3>
                  <p className="text-gray-600 mb-4">You haven't created any emergency requests yet.</p>
                  <Button onClick={() => router.push("/support")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {emergencies.map((emergency: any) => (
                  <Card key={emergency.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{emergency.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {emergency.type} • {new Date(emergency.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        {getStatusBadge(emergency.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{emergency.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {emergency.location?.address || "Location not specified"}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(emergency.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                      {emergency.assignedTo && (
                        <Alert className="mt-4 bg-blue-50 border-blue-200">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            Volunteer assigned and responding
                          </AlertDescription>
                        </Alert>
                      )}
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
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <p className="text-gray-900 mt-1">{user?.firstName || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <p className="text-gray-900 mt-1">{user?.lastName || "N/A"}</p>
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
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No new notifications</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

