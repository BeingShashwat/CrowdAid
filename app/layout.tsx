import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "CrowdAid - Emergency Assistance Platform",
  description:
    "Fast, reliable emergency assistance powered by crowd-sourced volunteers across India. Get help when you need it most.",
  keywords: "emergency, assistance, SOS, volunteers, safety, community, India, 112",
  authors: [{ name: "CrowdAid Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
  manifest: "/manifest.json",
  openGraph: {
    title: "CrowdAid - Emergency Assistance Platform",
    description: "Fast, reliable emergency assistance powered by crowd-sourced volunteers across India",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowdAid - Emergency Assistance Platform",
    description: "Fast, reliable emergency assistance powered by crowd-sourced volunteers across India",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-slate-50`}>{children}</body>
    </html>
  )
}
