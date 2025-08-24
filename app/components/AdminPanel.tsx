"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Settings,
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  MapPin,
  Search,
  Download,
} from "lucide-react"

export function AdminPanel() {
  const [systemStats, setSystemStats] = useState({
    activeEmergencies: 23,
    totalVolunteers: 1247,
    onlineVolunteers: 847,
    responseRate: 94,
    avgResponseTime: "1.8 min",
    resolvedToday: 156,
    totalUsers: 45678,
  })

  const [emergencyLogs, setEmergencyLogs] = useState([
    {
      id: "EMG-001",
      user: "Priya Sharma",
      type: "Medical Emergency",
      location: "Rajouri Garden, Delhi",
      status: "resolved",
      volunteers: 3,
      timeAgo: "15 min ago",
      responseTime: "1.2 min",
      severity: "high",
      description: "Chest pain, ambulance dispatched",
    },
    {
      id: "EMG-002",
      user: "Rajesh Kumar",
      type: "Vehicle Breakdown",
      location: "Electronic City, Bangalore",
      status: "in-progress",
      volunteers: 2,
      timeAgo: "32 min ago",
      responseTime: "2.1 min",
      severity: "medium",
      description: "Car breakdown on highway",
    },
    {
      id: "EMG-003",
      user: "Anita Patel",
      type: "Lost Child",
      location: "Juhu Beach, Mumbai",
      status: "resolved",
      volunteers: 5,
      timeAgo: "45 min ago",
      responseTime: "0.8 min",
      severity: "high",
      description: "Child found safe with volunteers",
    },
    {
      id: "EMG-004",
      user: "Suresh Gupta",
      type: "Fire Emergency",
      location: "Connaught Place, Delhi",
      status: "resolved",
      volunteers: 8,
      timeAgo: "1 hour ago",
      responseTime: "1.5 min",
      severity: "high",
      description: "Kitchen fire, fire brigade called",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTimeRange, setSelectedTimeRange] = useState("today")

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemStats((prev) => ({
        ...prev,
        activeEmergencies: prev.activeEmergencies + Math.floor(Math.random() * 3) - 1,
        onlineVolunteers: prev.onlineVolunteers + Math.floor(Math.random() * 10) - 5,
        resolvedToday: prev.resolvedToday + Math.floor(Math.random() * 2),
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const filteredLogs = emergencyLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,User,Type,Location,Status,Volunteers,Time,Response Time,Severity\n" +
      filteredLogs
        .map(
          (log) =>
            `${log.id},${log.user},${log.type},${log.location},${log.status},${log.volunteers},${log.timeAgo},${log.responseTime},${log.severity}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `crowdaid-emergency-logs-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-600" />
          System Administration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="emergencies">Emergencies</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Real-time System Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{systemStats.activeEmergencies}</div>
                <div className="text-sm text-gray-600">Active Emergencies</div>
                <div className="text-xs text-red-600 mt-1">+3 in last hour</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{systemStats.onlineVolunteers}</div>
                <div className="text-sm text-gray-600">Online Volunteers</div>
                <div className="text-xs text-blue-600 mt-1">of {systemStats.totalVolunteers} total</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{systemStats.responseRate}%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
                <div className="text-xs text-green-600 mt-1">+2% this week</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{systemStats.avgResponseTime}</div>
                <div className="text-sm text-gray-600">Avg Response</div>
                <div className="text-xs text-purple-600 mt-1">-0.3 min improved</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-16 flex flex-col items-center justify-center">
                <BarChart3 className="h-6 w-6 mb-1" />
                <span className="text-sm">System Analytics</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center bg-transparent">
                <Settings className="h-6 w-6 mb-1" />
                <span className="text-sm">System Settings</span>
              </Button>
            </div>

            {/* System Health */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">System Health</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>API Status: Operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>GPS Services: Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>SMS Gateway: Degraded</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="emergencies" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search emergencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <Button variant="outline" onClick={exportData} className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Emergency Logs */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{log.id}</span>
                          <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                          <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>
                        </div>
                        <p className="text-sm font-medium">
                          {log.user} - {log.type}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">{log.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {log.location}
                          </span>
                          <span>{log.timeAgo}</span>
                          <span>Response: {log.responseTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600">{log.volunteers} volunteers</div>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3" />
                <p>No emergencies found matching your criteria</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Online Volunteers</h4>
                <div className="text-2xl font-bold text-blue-600">{systemStats.onlineVolunteers}</div>
                <p className="text-sm text-blue-700">Ready to respond</p>
                <div className="mt-2 text-xs text-blue-600">
                  {Math.round((systemStats.onlineVolunteers / systemStats.totalVolunteers) * 100)}% of total volunteers
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Active Responses</h4>
                <div className="text-2xl font-bold text-green-600">{systemStats.activeEmergencies * 2}</div>
                <p className="text-sm text-green-700">Currently helping</p>
                <div className="mt-2 text-xs text-green-600">Avg 2 volunteers per emergency</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">New Registrations</h4>
                <div className="text-2xl font-bold text-purple-600">47</div>
                <p className="text-sm text-purple-700">This week</p>
                <div className="mt-2 text-xs text-purple-600">+12% from last week</div>
              </div>
            </div>

            {/* Volunteer Performance */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Top Performing Volunteers</h4>
              {[
                { name: "Dr. Amit Singh", responses: 45, rating: 4.9, location: "Delhi", badge: "Gold" },
                { name: "Sneha Patel", responses: 38, rating: 4.8, location: "Mumbai", badge: "Silver" },
                { name: "Ravi Kumar", responses: 32, rating: 4.7, location: "Bangalore", badge: "Silver" },
              ].map((volunteer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{volunteer.name}</span>
                        <Badge className="bg-yellow-100 text-yellow-800">{volunteer.badge}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {volunteer.responses} responses • ⭐ {volunteer.rating} • {volunteer.location}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Time Range Selector */}
            <div className="flex gap-2 mb-4">
              {["today", "week", "month", "year"].map((range) => (
                <Button
                  key={range}
                  variant={selectedTimeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeRange(range)}
                  className={selectedTimeRange !== range ? "bg-transparent" : ""}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Response Efficiency</h4>
                <div className="text-3xl font-bold text-blue-600 mb-1">94.2%</div>
                <p className="text-sm text-blue-700">Success rate</p>
                <div className="mt-2 text-xs text-blue-600">+2.1% from last {selectedTimeRange}</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">User Satisfaction</h4>
                <div className="text-3xl font-bold text-green-600 mb-1">4.7/5</div>
                <p className="text-sm text-green-700">Average rating</p>
                <div className="mt-2 text-xs text-green-600">+0.2 from last {selectedTimeRange}</div>
              </div>
            </div>

            {/* Emergency Types Distribution */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Emergency Types ({selectedTimeRange})</h4>
              {[
                { type: "Medical", count: 45, percentage: 35 },
                { type: "Vehicle", count: 32, percentage: 25 },
                { type: "Safety", count: 28, percentage: 22 },
                { type: "Fire", count: 15, percentage: 12 },
                { type: "Other", count: 8, percentage: 6 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.type}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full bg-transparent" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
