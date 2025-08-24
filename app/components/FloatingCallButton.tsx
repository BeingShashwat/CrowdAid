"use client"

import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

export function FloatingCallButton() {
  const handleEmergencyCall = () => {
    // In a real app, this would initiate an emergency call
    window.open("tel:112", "_self")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleEmergencyCall}
        size="lg"
        className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 shadow-lg emergency-pulse"
        aria-label="Emergency Call"
      >
        <Phone className="h-8 w-8" />
      </Button>
    </div>
  )
}
