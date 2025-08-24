"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"

export function PWABanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowBanner(false)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setDeferredPrompt(null)
  }

  if (!showBanner) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5" />
          <div>
            <p className="font-medium">Install CrowdAid App</p>
            <p className="text-sm text-blue-100">Get faster access to emergency services</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleInstall}
            size="sm"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Install
          </Button>
          <Button onClick={handleDismiss} size="sm" variant="ghost" className="text-white hover:bg-blue-700">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
