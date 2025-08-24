"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import {
  Search,
  Phone,
  MessageSquare,
  Book,
  AlertTriangle,
  Users,
  Settings,
  HelpCircle,
  FileText,
  Video,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const supportCategories = [
    {
      icon: AlertTriangle,
      title: "Emergency Help",
      description: "Immediate assistance for urgent situations",
      articles: 12,
      color: "text-red-600 bg-red-50",
    },
    {
      icon: Users,
      title: "Volunteer Guide",
      description: "Everything about becoming and being a volunteer",
      articles: 18,
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: Settings,
      title: "Account & Settings",
      description: "Manage your profile and app preferences",
      articles: 15,
      color: "text-green-600 bg-green-50",
    },
    {
      icon: Phone,
      title: "Technical Support",
      description: "App issues, bugs, and technical problems",
      articles: 22,
      color: "text-purple-600 bg-purple-50",
    },
  ]

  const popularArticles = [
    {
      title: "How to report an emergency quickly",
      category: "Emergency Help",
      readTime: "3 min read",
      views: "15.2k views",
      content:
        "Learn the fastest way to report emergencies using our SOS button, voice commands, or quick dial features.",
    },
    {
      title: "Volunteer verification process explained",
      category: "Volunteer Guide",
      readTime: "5 min read",
      views: "12.8k views",
      content:
        "Complete guide to our volunteer verification process including background checks and training requirements.",
    },
    {
      title: "Setting up emergency contacts",
      category: "Account & Settings",
      readTime: "2 min read",
      views: "9.5k views",
      content: "Configure your emergency contacts to ensure help reaches the right people when you need it most.",
    },
    {
      title: "Troubleshooting location services",
      category: "Technical Support",
      readTime: "4 min read",
      views: "8.1k views",
      content: "Fix common GPS and location issues to ensure accurate emergency response.",
    },
    {
      title: "Understanding response times",
      category: "Emergency Help",
      readTime: "3 min read",
      views: "7.9k views",
      content: "Learn about our response time metrics and what factors affect emergency response speed.",
    },
  ]

  const faqs = [
    {
      question: "How do I report an emergency?",
      answer:
        "You can report an emergency through our mobile app, website, or by calling 112. The app provides the fastest response with automatic location detection. Simply press the red SOS button, select your emergency type, and help will be dispatched immediately.",
      category: "emergency",
    },
    {
      question: "What information do I need to provide during an emergency?",
      answer:
        "Provide your location (automatically detected), type of emergency, number of people involved, and any immediate dangers. Our system will guide you through the process and connect you with the nearest volunteers and emergency services.",
      category: "emergency",
    },
    {
      question: "How are volunteers verified?",
      answer:
        "All volunteers undergo comprehensive background checks, identity verification, and complete emergency response training before being approved. We also conduct regular re-verification and performance reviews to maintain service quality.",
      category: "volunteer",
    },
    {
      question: "Is there a cost for using CrowdAid services?",
      answer:
        "CrowdAid's emergency response service is completely free for users. We believe emergency help should be accessible to everyone. Volunteers also participate without compensation as part of our community service mission.",
      category: "general",
    },
    {
      question: "What if I accidentally trigger an emergency alert?",
      answer:
        "You can cancel false alarms within 30 seconds through the app by tapping 'Cancel SOS'. After 30 seconds, contact our helpline immediately at 1800-CROWDAID to prevent unnecessary emergency response deployment.",
      category: "emergency",
    },
    {
      question: "How can I become a volunteer?",
      answer:
        "Sign up through our volunteer program, complete the application form, pass background verification, attend training sessions, and start helping your community. The entire process typically takes 5-7 business days.",
      category: "volunteer",
    },
    {
      question: "What types of emergencies do you handle?",
      answer:
        "We handle medical emergencies, vehicle breakdowns, personal safety issues, natural disasters, lost persons, fire incidents, and other crisis situations. Our volunteers are trained to provide appropriate first response for various emergency types.",
      category: "emergency",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Log into your account, go to Settings > Profile, and update your information. For security reasons, changes to phone number and email require verification. Emergency contact changes take effect immediately.",
      category: "account",
    },
  ]

  const resources = [
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video guides for using CrowdAid",
      link: "#",
      count: "25 videos",
    },
    {
      icon: Download,
      title: "Mobile App",
      description: "Download our app for faster emergency access",
      link: "#",
      count: "iOS & Android",
    },
    {
      icon: FileText,
      title: "Safety Guidelines",
      description: "Best practices for emergency situations",
      link: "#",
      count: "12 guides",
    },
    {
      icon: Book,
      title: "User Manual",
      description: "Complete guide to all CrowdAid features",
      link: "#",
      count: "50+ pages",
    },
  ]

  const filteredArticles = popularArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search functionality is handled by the filter above
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">How can we help you?</h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in animation-delay-200">
            Find answers, get support, and learn how to make the most of CrowdAid
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative animate-fade-in animation-delay-400">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-blue-500"
            />
            <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              Search
            </Button>
          </form>

          {searchQuery && (
            <p className="mt-4 text-gray-600">
              Found {filteredArticles.length + filteredFAQs.length} results for "{searchQuery}"
            </p>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency Support</h3>
                <p className="text-gray-600 mb-4">Need immediate help? Contact our 24/7 emergency line</p>
                <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => window.open("tel:112")}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call 112
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Chat with our support team for quick assistance</p>
                <Button variant="outline" className="w-full bg-transparent">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Help Center</h3>
                <p className="text-gray-600 mb-4">Browse our comprehensive knowledge base</p>
                <Button variant="outline" className="w-full bg-transparent">
                  <Book className="mr-2 h-4 w-4" />
                  Browse Articles
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Support Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportCategories.map((category, index) => (
                <Card
                  key={index}
                  className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer"
                  onClick={() => setSelectedCategory(category.title.toLowerCase().replace(/\s+/g, ""))}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${category.color}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    <Badge variant="outline">{category.articles} articles</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Articles and Resources */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {searchQuery ? "Search Results" : "Popular Articles"}
              </h2>
              <div className="space-y-4">
                {filteredArticles.map((article, index) => (
                  <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">{article.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <Badge className="bg-blue-100 text-blue-800">{article.category}</Badge>
                            <span>{article.readTime}</span>
                            <span>{article.views}</span>
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Resources Sidebar */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>
              <div className="space-y-4">
                {resources.map((resource, index) => (
                  <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <resource.icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{resource.title}</h3>
                          <p className="text-xs text-gray-600">{resource.description}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {resource.count}
                          </Badge>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Contact Card */}
              <Card className="shadow-soft mt-8">
                <CardHeader>
                  <CardTitle className="text-lg">Still need help?</CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Our support team is here to help.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/contact">
                    <Button className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Support
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => window.open("tel:1800-CROWDAID")}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    1800-CROWDAID
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to the most common questions</p>

            {/* Category Filter */}
            <div className="flex justify-center gap-2 mt-6">
              {["all", "emergency", "volunteer", "account", "general"].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory !== category ? "bg-transparent" : ""}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <HelpCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    </div>
                    {expandedFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {expandedFAQ === index && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No FAQs found</h3>
              <p className="text-gray-500">Try adjusting your search or browse different categories</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
