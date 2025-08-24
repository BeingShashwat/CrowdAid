import Link from "next/link"
import { Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">CrowdAid</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting communities for emergency assistance across India. Fast, reliable help when you need it most.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Services */}
          <div>
            <h3 className="font-semibold mb-4">Emergency Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4" />
                Police: 100
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4" />
                Fire: 101
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4" />
                Ambulance: 102
              </li>
              <li className="flex items-center gap-2 text-red-400 font-medium">
                <Phone className="h-4 w-4" />
                Emergency: 112
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4" />
                help@crowdaid.in
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4" />
                +91 1800-CROWDAID
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  Emergency Response Center
                  <br />
                  New Delhi, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 CrowdAid. All rights reserved. | Made with ❤️ for India</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
