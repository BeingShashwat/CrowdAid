"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Mail, Phone, MapPin, Clock, MessageSquare, AlertTriangle, Users, Building } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Emergency Helpline",
      details: ["24/7 Emergency: 112", "CrowdAid Helpline: 1800-CROWDAID", "WhatsApp: +91 98765 43210"],
      color: "text-red-600",
    },
    {
      icon: Mail,
      title: "Email Support",
      details: [
        "General: help@crowdaid.in",
        "Volunteers: volunteers@crowdaid.in",
        "Partnerships: partners@crowdaid.in",
      ],
      color: "text-blue-600",
    },
    {
      icon: MapPin,
      title: "Head Office",
      details: ["CrowdAid Emergency Response Center", "Connaught Place, New Delhi - 110001", "India"],
      color: "text-green-600",
    },
    {
      icon: Clock,
      title: "Support Hours",
      details: ["Emergency: 24/7 Available", "General Support: 9 AM - 9 PM", "All days of the week"],
      color: "text-purple-600",
    },
  ]

  const inquiryTypes = [
    { value: "general", label: "General Inquiry", icon: MessageSquare },
    { value: "emergency", label: "Emergency Support", icon: AlertTriangle },
    { value: "volunteer", label: "Volunteer Program", icon: Users },
    { value: "partnership", label: "Business Partnership", icon: Building },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">Contact CrowdAid</h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in animation-delay-200">
            Get in touch with our team for support, partnerships, or to learn more about our services
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <info.icon className={`h-8 w-8 ${info.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-sm text-gray-600">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Brief subject of your inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map and Additional Info */}
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Us</h3>
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p>Interactive Map</p>
                      <p className="text-sm">Connaught Place, New Delhi</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      CrowdAid Emergency Response Center
                    </p>
                    <p className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Connaught Place, New Delhi - 110001
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Visitor Hours: 10 AM - 6 PM (Mon-Fri)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                      Report Emergency
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Users className="mr-2 h-4 w-4 text-blue-600" />
                      Volunteer Registration
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <MessageSquare className="mr-2 h-4 w-4 text-green-600" />
                      Live Chat Support
                    </Button>
                  </div>
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
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly can I get help in an emergency?",
                answer:
                  "Our average response time is under 2 minutes. Volunteers in your area receive instant notifications and can respond immediately.",
              },
              {
                question: "Is CrowdAid available 24/7?",
                answer:
                  "Yes, our emergency response system operates 24/7, 365 days a year. Our volunteer network is always active to provide assistance.",
              },
              {
                question: "How do I become a verified volunteer?",
                answer:
                  "Sign up through our volunteer program, complete background verification, attend training sessions, and start helping your community.",
              },
              {
                question: "What types of emergencies do you handle?",
                answer:
                  "We handle medical emergencies, vehicle breakdowns, personal safety issues, natural disasters, lost persons, and fire incidents.",
              },
            ].map((faq, index) => (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
