"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, AlertCircle, ArrowLeft, ArrowRight, Home, List } from "lucide-react"
import MyctRenderer from "@/components/myct-renderer"
import LensSelector from "@/components/lens-selector"
import { translateUrl } from "@/lib/translator/url-parser"
import type { MyctDocument } from "@/lib/types/myct"
import type { LensDocument } from "@/lib/types/lens"
import { darkMinimalLens } from "@/lib/schemas/default-lenses"

export default function NexusBrowser() {
  const [url, setUrl] = useState("")
  const [currentUrl, setCurrentUrl] = useState("")
  const [myctDoc, setMyctDoc] = useState<MyctDocument | null>(null)
  const [selectedLens, setSelectedLens] = useState<LensDocument>(darkMinimalLens)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const [showOutline, setShowOutline] = useState(false)

  useEffect(() => {
    const lensSlug = selectedLens.name.toLowerCase().replace(/\s+/g, "-")
    document.body.setAttribute("data-lens", lensSlug)
  }, [selectedLens])

  const navigateToUrl = async (targetUrl: string, addToHistory = true) => {
    if (!targetUrl.trim()) return

    setLoading(true)
    setError(null)
    setMyctDoc(null)

    console.log("[v0] Starting navigation to:", targetUrl)

    const result = await translateUrl(targetUrl)

    console.log("[v0] Translation result:", result)

    if (result.error || !result.myct) {
      setError(result.error || "Failed to load page")
      setMyctDoc(null)
    } else {
      setMyctDoc(result.myct)
      setCurrentUrl(targetUrl)
      setUrl(targetUrl)
      setError(null)

      if (addToHistory) {
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(targetUrl)
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
      }
    }

    setLoading(false)
  }

  const handleNavigate = () => {
    navigateToUrl(url)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNavigate()
    }
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      navigateToUrl(history[newIndex], false)
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      navigateToUrl(history[newIndex], false)
    }
  }

  const goHome = () => {
    setCurrentUrl("")
    setMyctDoc(null)
    setError(null)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="flex items-center gap-4 p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
              <span className="text-background font-mono font-bold text-sm">ΠN</span>
            </div>
            <h1 className="text-lg font-mono font-semibold text-foreground hidden sm:block">Prometheus Nexus</h1>
          </div>

          <div className="flex items-center gap-1">
            <Button onClick={goBack} disabled={historyIndex <= 0} variant="ghost" size="sm" className="w-8 h-8 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={goForward}
              disabled={historyIndex >= history.length - 1}
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button onClick={goHome} variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Home className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                type="text"
                placeholder="Enter any URL (e.g., example.com, github.com/vercel)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 bg-background border-border text-foreground"
              />
            </div>
            <Button
              onClick={handleNavigate}
              disabled={loading}
              className="bg-accent hover:bg-accent-hover text-background"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Navigate"}
            </Button>
          </div>

          {myctDoc && (
            <Button onClick={() => setShowOutline(!showOutline)} variant="ghost" size="sm" className="gap-2">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Outline</span>
            </Button>
          )}

          <LensSelector selectedLens={selectedLens} onLensChange={setSelectedLens} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex">
        {showOutline && myctDoc && (
          <aside className="w-64 border-r border-border bg-surface p-4 overflow-auto">
            <h3 className="text-sm font-semibold text-foreground mb-3">Document Outline</h3>
            <DocumentOutline node={myctDoc.root} />
          </aside>
        )}

        <div className="flex-1 overflow-auto">
          {error && (
            <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-950/20 border border-red-900/50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold mb-1">Failed to load page</p>
                  <p className="text-red-300 text-sm">{error}</p>
                  <p className="text-red-300/70 text-xs mt-2">
                    Note: Some websites may block automated access or require authentication.
                  </p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
              <p className="text-muted">Fetching and parsing page...</p>
            </div>
          )}

          {!myctDoc && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-accent font-mono font-bold text-2xl">ΠN</span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to Prometheus Nexus Flow</h2>
              <p className="text-muted max-w-md mb-6">
                A semantic browser that renders websites as interactive hypergraphs with rich media support. Enter any
                URL above to begin exploring.
              </p>
              <div className="flex flex-col gap-2 text-sm text-muted">
                <p>Try these examples:</p>
                <button
                  onClick={() => navigateToUrl("https://en.wikipedia.org/wiki/Fifth_Generation_Computer_Systems")}
                  className="text-accent hover:text-accent-hover"
                >
                  en.wikipedia.org/wiki/Fifth_Generation_Computer_Systems
                </button>
                <button onClick={() => navigateToUrl("example.com")} className="text-accent hover:text-accent-hover">
                  example.com
                </button>
                <button
                  onClick={() => navigateToUrl("news.ycombinator.com")}
                  className="text-accent hover:text-accent-hover"
                >
                  news.ycombinator.com
                </button>
              </div>
            </div>
          )}

          {myctDoc && !loading && (
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
              <div className="mb-4 text-sm text-muted font-mono">Viewing: {currentUrl}</div>
              <MyctRenderer myctDoc={myctDoc} lens={selectedLens} onNavigate={navigateToUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DocumentOutline({ node }: { node: any }) {
  if (node.type === "text" && node.role?.startsWith("heading")) {
    const level = node.role.split("-")[1]
    return (
      <div
        className={`text-sm py-1 hover:text-accent cursor-pointer transition-colors ${level === "2" ? "font-semibold" : level === "3" ? "ml-3" : "ml-6"}`}
      >
        {node.content}
      </div>
    )
  }

  if (node.type === "stack" && node.children) {
    return (
      <>
        {node.children.map((child: any, index: number) => (
          <DocumentOutline key={index} node={child} />
        ))}
      </>
    )
  }

  return null
}
