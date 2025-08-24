import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { AlertTriangle, Users, MapPin, Clock, Shield, Phone, CheckCircle, ArrowRight } from "lucide-react"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: AlertTriangle,
      title: "Report Emergency",
      description: "Quickly report your emergency through our app, website, or by calling our helpline.",
      details: [
        "One-click emergency button",
        "Voice-activated reporting",
        "SMS emergency alerts",
        "Location auto-detection",
      ],
    },
    {
      icon: MapPin,
      title: "Location Detection",
      description: "Our system automatically detects your location and identifies nearby verified volunteers.",
      details: ["GPS-based location", "Indoor positioning", "Manual location entry", "Landmark-based reporting"],
    },
    {
      icon: Users,
      title: "Volunteer Dispatch",
      description: "Verified volunteers in your area receive instant notifications and can respond immediately.",
      details: [
        "Real-time notifications",
        "Skill-based matching",
        "Distance optimization",
        "Multi-volunteer coordination",
      ],
    },
    {
      icon: CheckCircle,
      title: "Help Arrives",
      description: "Get connected with volunteers and emergency services for immediate assistance.",
      details: ["Live tracking", "Direct communication", "Professional backup", "Follow-up support"],
    },
  ]

  const features = [
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Emergency assistance available round the clock, every day of the year.",
    },
    {
      icon: Shield,
      title: "Verified Volunteers",
      description: "All volunteers undergo background checks and emergency response training.",
    },
    {
      icon: Phone,
      title: "Multi-Channel Access",
      description: "Access help through mobile app, website, SMS, or voice calls.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">How CrowdAid Works</h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in animation-delay-200">
            Understanding our emergency response system - from crisis to resolution in minutes
          </p>
          <Button size="lg" className="animate-fade-in animation-delay-400">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Try Emergency Demo
          </Button>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Emergency Response Process</h2>
            <p className="text-lg text-gray-600">Four simple steps to get help when you need it most</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full shadow-soft hover:shadow-medium transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CrowdAid?</h2>
            <p className="text-lg text-gray-600">Built for reliability, speed, and community support</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Types */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Types of Emergencies We Handle</h2>
            <p className="text-lg text-gray-600">Comprehensive emergency response across multiple categories</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Medical Emergencies", description: "Heart attacks, accidents, injuries, medical crises" },
              { title: "Vehicle Breakdowns", description: "Car troubles, flat tires, mechanical failures" },
              { title: "Personal Safety", description: "Harassment, threats, unsafe situations" },
              { title: "Natural Disasters", description: "Floods, earthquakes, severe weather events" },
              { title: "Lost Persons", description: "Missing children, elderly, disoriented individuals" },
              { title: "Fire Incidents", description: "Building fires, electrical hazards, smoke emergencies" },
            ].map((emergency, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{emergency.title}</h3>
                  <p className="text-gray-600 text-sm">{emergency.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join CrowdAid?</h2>
          <p className="text-xl text-blue-100 mb-8">Be part of India's largest emergency response community</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Users className="mr-2 h-5 w-5" />
                Become a Volunteer
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <Shield className="mr-2 h-5 w-5" />
                Get Protected
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
