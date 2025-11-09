"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Shield,
  AlertTriangle,
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  LogOut,
  Settings,
  BarChart3,
  UserCheck,
  UserX,
  Activity,
  Eye,
} from "lucide-react"
import { authApi, emergencyApi, userApi } from "@/lib/api-client"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVolunteers: 0,
    activeEmergencies: 0,
    resolvedToday: 0,
  })
  const [recentEmergencies, setRecentEmergencies] = useState<any[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])

  useEffect(() => {
    loadUserData()
    loadDashboardData()
  }, [])

  const loadUserData = async () => {
    try {
      const userData = localStorage.getItem("crowdaid_user")
      if (!userData) {
        router.push("/login")
        return
      }

      const parsed = JSON.parse(userData)
      if (parsed.type !== "admin" && parsed.role !== "ADMIN") {
        router.push("/dashboard")
        return
      }

      try {
        const response = await userApi.getProfile()
        if (response.data) {
          setUser(response.data)
        } else {
          setUser(parsed)
        }
      } catch {
        setUser(parsed)
      }
    } catch (error) {
      console.error("Failed to load user:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      // Load emergencies
      const emergenciesResponse = await emergencyApi.getAll()
      if (emergenciesResponse.data) {
        const emergencies = emergenciesResponse.data
        setRecentEmergencies(emergencies.slice(0, 10))
        
        const active = emergencies.filter((e: any) => 
          e.status === "PENDING" || e.status === "ASSIGNED" || e.status === "IN_PROGRESS"
        ).length
        const resolved = emergencies.filter((e: any) => e.status === "RESOLVED").length
        
        setStats(prev => ({
          ...prev,
          activeEmergencies: active,
          resolvedToday: resolved,
        }))
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("crowdaid_user")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/")
  }

  const getStatusBadge = (status: string) => {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">
                  System Overview & Management
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
          <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-indigo-900">Total Users</CardTitle>
              <Users className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</div>
              <p className="text-xs text-indigo-600 mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Volunteers</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalVolunteers}</div>
              <p className="text-xs text-purple-600 mt-1">Active volunteers</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-900">Active Emergencies</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.activeEmergencies}</div>
              <p className="text-xs text-red-600 mt-1">Requiring attention</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Resolved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.resolvedToday}</div>
              <p className="text-xs text-green-600 mt-1">Successfully resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="emergencies">Emergencies</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">System Health</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database Status</span>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Email Service</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Storage Service</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Emergency Response Rate</span>
                        <span className="text-sm font-semibold">94%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "94%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Volunteer Engagement</span>
                        <span className="text-sm font-semibold">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "87%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">User Satisfaction</span>
                        <span className="text-sm font-semibold">4.8/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "96%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Emergencies Tab */}
          <TabsContent value="emergencies" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">All Emergencies</h2>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>

            {recentEmergencies.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Emergencies</h3>
                  <p className="text-gray-600">No emergency requests in the system yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {recentEmergencies.map((emergency: any) => (
                  <Card key={emergency.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{emergency.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {emergency.type} • {new Date(emergency.createdAt).toLocaleString()}
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
                        {emergency.user && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {emergency.user.firstName} {emergency.user.lastName}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {emergency.status === "PENDING" && (
                          <Button variant="outline" size="sm" className="text-green-600">
                            Assign Volunteer
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </div>
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                <p className="text-gray-600 mb-4">View and manage all registered users and volunteers.</p>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Access User Panel
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">System Maintenance Mode</label>
                  <Button variant="outline" className="w-full">
                    Toggle Maintenance Mode
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                  <Button variant="outline" className="w-full">
                    Configure Email Settings
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Backup & Restore</label>
                  <Button variant="outline" className="w-full">
                    Manage Backups
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

