import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Prometheus Nexus Flow - Semantic Web Browser",
  description:
    "A revolutionary semantic web browser that transforms any webpage into an interactive, lens-filtered hypergraph experience. Navigate the web through multiple dimensions of information.",
  generator: "v0.app",
  applicationName: "Prometheus Nexus Flow",
  authors: [{ name: "Prometheus Nexus Flow Team" }],
  keywords: ["semantic web", "browser", "hypergraph", "lens system", "web parser", "MYCT", "knowledge graph"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nexus Flow",
  },
  openGraph: {
    type: "website",
    title: "Prometheus Nexus Flow",
    description: "Transform any webpage into an interactive hypergraph",
    siteName: "Prometheus Nexus Flow",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prometheus Nexus Flow",
    description: "A semantic web browser with lens-filtered content",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#10b981",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  )
}
