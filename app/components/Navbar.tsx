"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Shield, Phone } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CrowdAid</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-blue-600 transition-colors">
              Support
            </Link>
          </div>

          {/* Emergency Call Button & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
              <Phone className="h-4 w-4 mr-2" />
              Emergency: 112
            </Button>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/how-it-works"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/support"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <div className="px-3 py-2 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency: 112
                </Button>
                <Link href="/login" className="block">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
