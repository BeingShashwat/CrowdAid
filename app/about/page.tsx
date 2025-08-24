import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Shield, Users, Heart, Award, MapPin, Clock, Target, Lightbulb, Globe } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Active Volunteers", value: "50,000+" },
    { icon: MapPin, label: "Cities Covered", value: "500+" },
    { icon: Clock, label: "Average Response", value: "<2 min" },
    { icon: Heart, label: "Lives Impacted", value: "1M+" },
  ]

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We believe in the power of community support and collective action during emergencies.",
    },
    {
      icon: Shield,
      title: "Safety & Trust",
      description: "Every volunteer is verified and trained to ensure safe, reliable emergency response.",
    },
    {
      icon: Target,
      title: "Rapid Response",
      description: "Speed saves lives. Our technology ensures help reaches you in the shortest time possible.",
    },
    {
      icon: Globe,
      title: "Inclusive Access",
      description: "Emergency help should be available to everyone, regardless of location or background.",
    },
  ]

  const team = [
    {
      name: "Dr. Priya Sharma",
      role: "Founder & CEO",
      description: "Emergency medicine specialist with 15+ years experience in disaster response.",
      image: "/professional-indian-woman-doctor.png",
    },
    {
      name: "Rajesh Kumar",
      role: "CTO",
      description: "Former Google engineer specializing in location-based emergency systems.",
      image: "/professional-indian-man-engineer.png",
    },
    {
      name: "Anita Patel",
      role: "Head of Operations",
      description: "Ex-disaster management official with expertise in volunteer coordination.",
      image: "/professional-indian-woman-manager.png",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">About CrowdAid</h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in animation-delay-200">
            Empowering communities across India with technology-driven emergency response solutions
          </p>
          <div className="flex justify-center animate-fade-in animation-delay-400">
            <Shield className="h-16 w-16 text-blue-600" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                CrowdAid was born from a simple belief: in emergencies, every second counts, and communities are
                strongest when they come together to help one another.
              </p>
              <p className="text-gray-600 mb-6">
                Founded in 2020 during the pandemic, we witnessed firsthand how technology could bridge the gap between
                those in need and those willing to help. Today, we're India's largest crowd-sourced emergency response
                platform, connecting verified volunteers with people in crisis across 500+ cities.
              </p>
              <div className="flex items-center gap-4">
                <Lightbulb className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Innovation for Good</h3>
                  <p className="text-sm text-gray-600">Using technology to save lives and strengthen communities</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="shadow-soft">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-600">Meet the people behind CrowdAid's mission</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recognition & Awards</h2>
            <p className="text-lg text-gray-600">Honored for our contribution to emergency response in India</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "National Safety Award 2023",
                organization: "Ministry of Home Affairs",
                description: "Outstanding contribution to public safety and emergency response",
              },
              {
                title: "Digital India Innovation 2022",
                organization: "Government of India",
                description: "Excellence in using technology for social impact",
              },
              {
                title: "Social Impact Startup 2021",
                organization: "NASSCOM",
                description: "Best technology solution for community welfare",
              },
            ].map((award, index) => (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{award.title}</h3>
                  <p className="text-blue-600 font-medium mb-2">{award.organization}</p>
                  <p className="text-gray-600 text-sm">{award.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
          <p className="text-xl text-blue-100 mb-8">
            Help us build a safer, more connected India where help is always within reach
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Users className="mr-2 h-5 w-5" />
                Become a Volunteer
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <Heart className="mr-2 h-5 w-5" />
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
