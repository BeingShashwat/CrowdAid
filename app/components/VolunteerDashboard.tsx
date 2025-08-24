"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Star, Award, TrendingUp, MapPin, Phone, CheckCircle } from "lucide-react"

export function VolunteerDashboard() {
  const [volunteerStats, setVolunteerStats] = useState({
    totalHelped: 127,
    rating: 4.8,
    responseTime: "1.2 min",
    completionRate: 96,
    badgeProgress: 75,
    currentBadge: "Silver",
    nextBadge: "Gold",
  })

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "Medical Assistance",
      location: "Sector 18, Noida",
      status: "completed",
      rating: 5,
      timeAgo: "2 hours ago",
      description: "Helped elderly person with chest pain",
      responseTime: "1.5 min",
    },
    {
      id: 2,
      type: "Traffic Help",
      location: "Cyber City, Gurgaon",
      status: "completed",
      rating: 4,
      timeAgo: "1 day ago",
      description: "Assisted with vehicle breakdown",
      responseTime: "2.1 min",
    },
    {
      id: 3,
      type: "Emergency Transport",
      location: "Karol Bagh, Delhi",
      status: "completed",
      rating: 5,
      timeAgo: "3 days ago",
      description: "Provided emergency ride to hospital",
      responseTime: "0.8 min",
    },
  ])

  const [activeRequests, setActiveRequests] = useState([
    {
      id: 4,
      type: "Lost Child",
      location: "India Gate, Delhi",
      distance: "0.5 km",
      timePosted: "Just now",
      severity: "high",
      description: "5-year-old child separated from parents",
    },
    {
      id: 5,
      type: "Medical Emergency",
      location: "Lajpat Nagar, Delhi",
      distance: "1.8 km",
      timePosted: "3 min ago",
      severity: "high",
      description: "Elderly person fell, possible fracture",
    },
  ])

  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Simulate real-time updates for active requests
    const interval = setInterval(() => {
      setActiveRequests((prev) =>
        prev.map((request) => ({
          ...request,
          timePosted: updateTimePosted(request.timePosted),
        })),
      )
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const updateTimePosted = (timePosted: string) => {
    if (timePosted === "Just now") return "1 min ago"
    if (timePosted.includes("min ago")) {
      const minutes = Number.parseInt(timePosted.split(" ")[0])
      return `${minutes + 1} min ago`
    }
    return timePosted
  }

  const handleToggleOnline = () => {
    setIsOnline(!isOnline)
  }

  const handleRespondToRequest = (requestId: number) => {
    setActiveRequests((prev) => prev.filter((request) => request.id !== requestId))
    // Add to recent activities
    const respondedRequest = activeRequests.find((r) => r.id === requestId)
    if (respondedRequest) {
      setRecentActivities((prev) => [
        {
          id: requestId,
          type: respondedRequest.type,
          location: respondedRequest.location,
          status: "in-progress",
          rating: 0,
          timeAgo: "Responding now",
          description: respondedRequest.description,
          responseTime: "0.0 min",
        },
        ...prev.slice(0, 2),
      ])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  return (
    <Card className="h-full shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Volunteer Dashboard
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`}></div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleOnline}
              className={`text-xs ${isOnline ? "text-green-600 border-green-600" : "text-gray-600"}`}
            >
              {isOnline ? "Online" : "Offline"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{volunteerStats.totalHelped}</div>
                <div className="text-sm text-gray-600">People Helped</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 fill-current" />
                  {volunteerStats.rating}
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{volunteerStats.responseTime}</div>
                <div className="text-sm text-gray-600">Avg Response</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{volunteerStats.completionRate}%</div>
                <div className="text-sm text-gray-600">Completion</div>
              </div>
            </div>

            {/* Badge Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress to {volunteerStats.nextBadge} Badge</span>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{volunteerStats.currentBadge}</span>
                </div>
              </div>
              <Progress value={volunteerStats.badgeProgress} className="h-2" />
              <p className="text-xs text-gray-500">
                {100 - volunteerStats.badgeProgress} more helps needed for {volunteerStats.nextBadge} status
              </p>
            </div>

            <Button className="w-full bg-transparent" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Active Requests Near You</h4>
              <Badge className="bg-red-100 text-red-800">{activeRequests.length} urgent</Badge>
            </div>

            {activeRequests.length > 0 ? (
              <div className="space-y-3">
                {activeRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-red-50 to-orange-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(request.severity)}>{request.type}</Badge>
                          <span className="text-sm text-gray-500">{request.timePosted}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{request.location}</p>
                        <p className="text-xs text-gray-600 mb-2">{request.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>{request.distance} away</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => handleRespondToRequest(request.id)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Respond Now
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p>No active emergencies in your area</p>
                <p className="text-sm">Great job keeping the community safe!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            <h4 className="font-medium text-gray-900">Recent Activities</h4>
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                    {activity.status === "completed" && activity.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {[...Array(activity.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium">{activity.type}</p>
                  <p className="text-xs text-gray-500 mb-1">{activity.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{activity.location}</span>
                    <span>•</span>
                    <span>{activity.timeAgo}</span>
                    {activity.responseTime && (
                      <>
                        <span>•</span>
                        <span>Response: {activity.responseTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
