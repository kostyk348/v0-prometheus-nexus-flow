"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Home,
  List,
  Layers,
  Zap,
  Grid3x3,
  Eye,
  Network,
  Bookmark,
  History,
  Download,
  Sparkles,
} from "lucide-react"
import MyctRenderer from "@/components/myct-renderer"
import LensSelector from "@/components/lens-selector"
import { translateUrl } from "@/lib/translator/url-parser"
import type { MyctDocument } from "@/lib/types/myct"
import type { LensDocument } from "@/lib/types/lens"
import { darkMinimalLens } from "@/lib/schemas/default-lenses"

interface BookmarkedPage {
  url: string
  title: string
  timestamp: number
}

export default function NexusBrowser() {
  const [url, setUrl] = useState("")
  const [currentUrl, setCurrentUrl] = useState("")
  const [myctDoc, setMyctDoc] = useState<MyctDocument | null>(null)
  const [selectedLens, setSelectedLens] = useState<LensDocument>(darkMinimalLens)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [bookmarks, setBookmarks] = useState<BookmarkedPage[]>([])

  const [showOutline, setShowOutline] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [viewMode, setViewMode] = useState<"standard" | "bento" | "layers">("standard")

  useEffect(() => {
    const saved = localStorage.getItem("nexus-bookmarks")
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load bookmarks", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("nexus-bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    const lensSlug = selectedLens.name.toLowerCase().replace(/\s+/g, "-")
    document.body.setAttribute("data-lens", lensSlug)
  }, [selectedLens])

  const navigateToUrl = useCallback(
    async (targetUrl: string, addToHistory = true) => {
      if (!targetUrl.trim()) return

      setLoading(true)
      setError(null)
      setMyctDoc(null)

      const result = await translateUrl(targetUrl)

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
    },
    [history, historyIndex],
  )

  const handleNavigate = () => {
    navigateToUrl(url)
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

  const toggleBookmark = () => {
    if (!currentUrl || !myctDoc) return

    const existing = bookmarks.find((b) => b.url === currentUrl)
    if (existing) {
      setBookmarks(bookmarks.filter((b) => b.url !== currentUrl))
    } else {
      setBookmarks([
        ...bookmarks,
        {
          url: currentUrl,
          title: myctDoc.root.children?.[0]?.content || currentUrl,
          timestamp: Date.now(),
        },
      ])
    }
  }

  const isBookmarked = useMemo(() => {
    return bookmarks.some((b) => b.url === currentUrl)
  }, [bookmarks, currentUrl])

  const exportAsMarkdown = () => {
    if (!myctDoc) return

    const extractText = (node: any): string => {
      if (node.type === "text") {
        const prefix = node.role === "heading-2" ? "## " : node.role === "heading-3" ? "### " : ""
        return prefix + (node.content || "")
      }
      if (node.children) {
        return node.children.map(extractText).join("\n\n")
      }
      return ""
    }

    const markdown = extractText(myctDoc.root)
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${myctDoc.root.children?.[0]?.content || "page"}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exampleUrls = useMemo(
    () => [
      { url: "https://en.wikipedia.org/wiki/Fifth_Generation_Computer_Systems", label: "Fifth Generation Computers" },
      { url: "https://en.wikipedia.org/wiki/Hypertext", label: "Hypertext" },
      { url: "https://en.wikipedia.org/wiki/Semantic_Web", label: "Semantic Web" },
    ],
    [],
  )

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="glass-strong border-b border-accent-primary/20 sticky top-0 z-50 shadow-lg shadow-glow-primary/10">
        <div className="flex items-center gap-4 p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-tertiary rounded-xl flex items-center justify-center shadow-xl shadow-glow-primary/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <span className="text-background font-mono font-bold text-lg relative z-10">ΠN</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-mono font-bold bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">
                Prometheus Nexus
              </h1>
              <p className="text-xs text-muted font-mono">Hyperdimensional Browser</p>
            </div>
          </div>

          <div className="flex items-center gap-1 glass rounded-lg p-1 border border-border/30">
            <Button
              onClick={goBack}
              disabled={historyIndex <= 0}
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0 hover:bg-accent-primary/10 hover:text-accent-primary disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={goForward}
              disabled={historyIndex >= history.length - 1}
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0 hover:bg-accent-primary/10 hover:text-accent-primary disabled:opacity-30"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={goHome}
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0 hover:bg-accent-primary/10 hover:text-accent-primary"
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-primary/60" />
              <Input
                type="text"
                placeholder="Enter any URL to explore..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleNavigate()}
                className="pl-10 glass border-accent-primary/20 text-foreground placeholder:text-muted focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
              />
            </div>
            <Button
              onClick={handleNavigate}
              disabled={loading}
              className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary hover:shadow-xl hover:shadow-glow-primary/50 text-background font-semibold transition-all hover:scale-105"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Navigate
                </>
              )}
            </Button>
          </div>

          {myctDoc && (
            <>
              <div className="flex items-center gap-1 glass rounded-lg p-1 border border-border/30">
                <Button
                  onClick={() => setViewMode("standard")}
                  variant="ghost"
                  size="sm"
                  className={`w-9 h-9 p-0 transition-all ${viewMode === "standard" ? "bg-accent-primary/20 text-accent-primary shadow-lg shadow-glow-primary/30" : "hover:bg-accent-primary/10"}`}
                  title="Standard View"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode("bento")}
                  variant="ghost"
                  size="sm"
                  className={`w-9 h-9 p-0 transition-all ${viewMode === "bento" ? "bg-accent-primary/20 text-accent-primary shadow-lg shadow-glow-primary/30" : "hover:bg-accent-primary/10"}`}
                  title="Bento Grid"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode("layers")}
                  variant="ghost"
                  size="sm"
                  className={`w-9 h-9 p-0 transition-all ${viewMode === "layers" ? "bg-accent-primary/20 text-accent-primary shadow-lg shadow-glow-primary/30" : "hover:bg-accent-primary/10"}`}
                  title="Layer View"
                >
                  <Layers className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1 glass rounded-lg p-1 border border-border/30">
                <Button
                  onClick={() => setShowOutline(!showOutline)}
                  variant="ghost"
                  size="sm"
                  className={`w-9 h-9 p-0 transition-all ${showOutline ? "bg-accent-primary/20 text-accent-primary shadow-lg shadow-glow-primary/30" : "hover:bg-accent-primary/10"}`}
                  title="Document Outline"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setShowGraph(!showGraph)}
                  variant="ghost"
                  size="sm"
                  className={`w-9 h-9 p-0 transition-all ${showGraph ? "bg-accent-primary/20 text-accent-primary shadow-lg shadow-glow-primary/30" : "hover:bg-accent-primary/10"}`}
                  title="Connection Graph"
                >
                  <Network className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setShowAI(!showAI)}
                  variant="ghost"
                  size="sm"
                  className={`w-9 h-9 p-0 transition-all ${showAI ? "bg-accent-primary/20 text-accent-primary shadow-lg shadow-glow-primary/30" : "hover:bg-accent-primary/10"}`}
                  title="AI Insights"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1 glass rounded-lg p-1 border border-border/30">
                <Button
                  onClick={toggleBookmark}
                  variant="ghost"
                  size="sm"
                  className={`w-9 h-9 p-0 transition-all ${isBookmarked ? "bg-accent-secondary/20 text-accent-secondary" : "hover:bg-accent-primary/10"}`}
                  title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                </Button>
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  variant="ghost"
                  size="sm"
                  className={`w-9 h-9 p-0 transition-all ${showHistory ? "bg-accent-primary/20 text-accent-primary shadow-lg shadow-glow-primary/30" : "hover:bg-accent-primary/10"}`}
                  title="History"
                >
                  <History className="w-4 h-4" />
                </Button>
                <Button
                  onClick={exportAsMarkdown}
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 hover:bg-accent-primary/10 hover:text-accent-primary"
                  title="Export as Markdown"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}

          <LensSelector selectedLens={selectedLens} onLensChange={setSelectedLens} />
        </div>
      </header>

      <div className="flex-1 overflow-auto flex">
        {showOutline && myctDoc && (
          <aside className="w-72 glass-strong border-r border-accent-primary/20 p-4 overflow-auto animate-slide-in-right shadow-lg">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-accent-primary to-accent-secondary rounded-full" />
              Document Outline
            </h3>
            <DocumentOutline node={myctDoc.root} />
          </aside>
        )}

        {showGraph && myctDoc && (
          <aside className="w-96 glass-strong border-r border-accent-primary/20 p-4 overflow-auto animate-slide-in-right shadow-lg">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-accent-primary to-accent-secondary rounded-full" />
              Connection Graph
            </h3>
            <ConnectionGraph myctDoc={myctDoc} currentUrl={currentUrl} onNavigate={navigateToUrl} />
          </aside>
        )}

        {showAI && myctDoc && (
          <aside className="w-96 glass-strong border-r border-accent-primary/20 p-4 overflow-auto animate-slide-in-right shadow-lg">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-accent-primary to-accent-secondary rounded-full" />
              AI Insights
            </h3>
            <AIInsights myctDoc={myctDoc} />
          </aside>
        )}

        {showHistory && (
          <aside className="w-80 glass-strong border-r border-accent-primary/20 p-4 overflow-auto animate-slide-in-right shadow-lg">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-accent-primary to-accent-secondary rounded-full" />
              Browsing History
            </h3>
            <div className="space-y-2">
              {history.length === 0 ? (
                <p className="text-sm text-muted">No history yet</p>
              ) : (
                history
                  .slice()
                  .reverse()
                  .map((url, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToUrl(url)}
                      className="w-full text-left p-3 rounded-lg hover:bg-accent-primary/10 hover:text-accent-primary transition-all text-sm group glass border border-border/30"
                    >
                      <p className="truncate font-medium">{url}</p>
                      <p className="text-xs text-muted group-hover:text-accent-primary/70 mt-1">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </button>
                  ))
              )}
            </div>
          </aside>
        )}

        <div className="flex-1 overflow-auto">
          {error && (
            <div className="max-w-4xl mx-auto mt-8 p-6 hyper-card animate-slide-in-up">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-red-400 font-semibold text-lg mb-2">Failed to load page</p>
                  <p className="text-red-300 text-sm mb-3">{error}</p>
                  <p className="text-red-300/70 text-xs">
                    Note: Some websites may block automated access or require authentication.
                  </p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-full animate-slide-in-up">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-tertiary flex items-center justify-center mb-6 shadow-2xl shadow-glow-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
                <Loader2 className="w-10 h-10 text-background animate-spin relative z-10" />
              </div>
              <p className="text-foreground font-mono text-sm font-semibold mb-2">Fetching and parsing page...</p>
              <p className="text-muted font-mono text-xs mb-4">Extracting semantic content</p>
              <div className="w-64 h-1.5 bg-layer-2 rounded-full overflow-hidden border border-border/30">
                <div className="h-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary animate-shimmer shadow-lg shadow-glow-primary/50" />
              </div>
            </div>
          )}

          {!myctDoc && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-slide-in-up">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-tertiary flex items-center justify-center mb-8 shadow-2xl shadow-glow-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <span className="text-background font-mono font-bold text-5xl relative z-10">ΠN</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">
                Prometheus Nexus Flow
              </h2>
              <p className="text-muted max-w-lg mb-10 leading-relaxed text-lg">
                A hyperdimensional semantic browser with AI insights, connection graphs, bookmarks, and transformative
                lenses.
              </p>

              {bookmarks.length > 0 && (
                <div className="w-full max-w-md mb-8">
                  <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-accent-secondary" />
                    Your Bookmarks
                  </p>
                  <div className="space-y-2">
                    {bookmarks.slice(0, 3).map((bookmark, index) => (
                      <button
                        key={index}
                        onClick={() => navigateToUrl(bookmark.url)}
                        className="hyper-card p-4 text-left hover:scale-105 transition-all group w-full"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-secondary/20 via-accent-tertiary/20 to-accent-primary/20 flex items-center justify-center group-hover:from-accent-secondary/30 group-hover:via-accent-tertiary/30 group-hover:to-accent-primary/30 transition-all border border-accent-secondary/20">
                            <Bookmark className="w-5 h-5 text-accent-secondary fill-current" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground group-hover:text-accent-primary transition-colors truncate">
                              {bookmark.title}
                            </p>
                            <p className="text-xs text-muted font-mono truncate">{bookmark.url}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 w-full max-w-md">
                <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-accent-primary to-accent-secondary rounded-full" />
                  Try these examples:
                </p>
                {exampleUrls.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToUrl(example.url)}
                    className="hyper-card p-4 text-left hover:scale-105 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary/20 via-accent-secondary/20 to-accent-tertiary/20 flex items-center justify-center group-hover:from-accent-primary/30 group-hover:via-accent-secondary/30 group-hover:to-accent-tertiary/30 transition-all border border-accent-primary/20">
                        <Search className="w-5 h-5 text-accent-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground group-hover:text-accent-primary transition-colors">
                          {example.label}
                        </p>
                        <p className="text-xs text-muted font-mono truncate">{example.url}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {myctDoc && !loading && (
            <div className={`${viewMode === "bento" ? "" : "max-w-5xl mx-auto p-6"} animate-slide-in-up`}>
              <MyctRenderer myctDoc={myctDoc} lens={selectedLens} onNavigate={navigateToUrl} viewMode={viewMode} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DocumentOutline({ node, depth = 0 }: { node: any; depth?: number }) {
  if (node.type === "section" && node.children && node.children.length > 0) {
    const heading = node.children[0]
    if (heading && heading.type === "text" && heading.role?.startsWith("heading")) {
      const level = heading.role.split("-")[1]
      const indent = depth * 12
      const headingText = heading.content || ""
      const sectionId = `section-${headingText.replace(/\s+/g, "-").toLowerCase()}`

      return (
        <>
          <button
            onClick={() => {
              const element = document.getElementById(sectionId)
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" })
                element.classList.add("outline-highlight")
                setTimeout(() => element.classList.remove("outline-highlight"), 2000)
              }
            }}
            className={`w-full text-left text-sm py-2.5 px-4 rounded-lg hover:bg-accent-primary/10 hover:text-accent-primary transition-all group border border-transparent hover:border-accent-primary/20 ${
              level === "1" || level === "2" ? "font-semibold" : ""
            } ${level === "1" ? "text-base" : ""}`}
            style={{ marginLeft: `${indent}px` }}
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-glow-primary" />
              <span className="truncate">{headingText}</span>
            </span>
          </button>
          {node.children.slice(1).map((child: any, index: number) => (
            <DocumentOutline key={index} node={child} depth={depth + 1} />
          ))}
        </>
      )
    }
  }

  if (node.type === "text" && (node.role?.startsWith("heading") || node.role === "page-title")) {
    const level = node.role === "page-title" ? "1" : node.role.split("-")[1]
    const indent = depth * 12

    return (
      <button
        onClick={() => {
          const headingId = `heading-${node.content?.replace(/\s+/g, "-").toLowerCase()}`
          const element = document.getElementById(headingId)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
            element.classList.add("outline-highlight")
            setTimeout(() => element.classList.remove("outline-highlight"), 2000)
          }
        }}
        className={`w-full text-left text-sm py-2.5 px-4 rounded-lg hover:bg-accent-primary/10 hover:text-accent-primary transition-all group border border-transparent hover:border-accent-primary/20 ${
          level === "1" || level === "2" ? "font-semibold" : ""
        } ${level === "1" ? "text-base" : ""}`}
        style={{ marginLeft: `${indent}px` }}
      >
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-glow-primary" />
          <span className="truncate">{node.content}</span>
        </span>
      </button>
    )
  }

  if (node.type === "stack" && node.children) {
    return (
      <>
        {node.children.map((child: any, index: number) => (
          <DocumentOutline key={index} node={child} depth={depth} />
        ))}
      </>
    )
  }

  return null
}

function ConnectionGraph({
  myctDoc,
  currentUrl,
  onNavigate,
}: {
  myctDoc: MyctDocument
  currentUrl: string
  onNavigate: (url: string) => void
}) {
  const extractLinks = (node: any): Array<{ text: string; url: string }> => {
    const links: Array<{ text: string; url: string }> = []

    if (node.type === "link" && node.url) {
      links.push({ text: node.content || "Link", url: node.url })
    }

    if (node.children) {
      for (const child of node.children) {
        links.push(...extractLinks(child))
      }
    }

    return links
  }

  const allLinks = extractLinks(myctDoc.root)
  const uniqueLinks = Array.from(new Map(allLinks.map((link) => [link.url, link])).values())

  const linksByDomain = uniqueLinks.reduce(
    (acc, link) => {
      try {
        const domain = new URL(link.url).hostname
        if (!acc[domain]) acc[domain] = []
        acc[domain].push(link)
      } catch {
        if (!acc["other"]) acc["other"] = []
        acc["other"].push(link)
      }
      return acc
    },
    {} as Record<string, Array<{ text: string; url: string }>>,
  )

  return (
    <div className="space-y-4">
      <div className="p-4 glass rounded-lg border border-accent-primary/20">
        <p className="text-xs text-muted font-mono mb-2">Current Page</p>
        <p className="text-sm text-foreground font-semibold truncate">{currentUrl}</p>
      </div>

      <div className="p-4 glass rounded-lg border border-border/30">
        <p className="text-xs text-muted font-mono mb-2">Total Connections</p>
        <p className="text-2xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
          {uniqueLinks.length}
        </p>
      </div>

      <div className="space-y-3">
        {Object.entries(linksByDomain)
          .sort(([, a], [, b]) => b.length - a.length)
          .map(([domain, links]) => (
            <div key={domain} className="glass rounded-lg border border-border/30 overflow-hidden">
              <div className="p-3 bg-layer-2 border-b border-border/30">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-primary" />
                  {domain}
                  <span className="ml-auto text-xs text-muted font-mono">{links.length}</span>
                </p>
              </div>
              <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                {links.slice(0, 10).map((link, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate(link.url)}
                    className="w-full text-left p-2 rounded hover:bg-accent-primary/10 hover:text-accent-primary transition-all text-xs group"
                  >
                    <p className="truncate font-medium">{link.text}</p>
                    <p className="truncate text-muted group-hover:text-accent-primary/70 font-mono text-[10px]">
                      {link.url}
                    </p>
                  </button>
                ))}
                {links.length > 10 && (
                  <p className="text-xs text-muted text-center py-2">+{links.length - 10} more links</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

function AIInsights({ myctDoc }: { myctDoc: MyctDocument }) {
  const extractText = (node: any): string => {
    if (node.type === "text") return node.content || ""
    if (node.children) return node.children.map(extractText).join(" ")
    return ""
  }

  const fullText = extractText(myctDoc.root)
  const wordCount = fullText.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  const extractHeadings = (node: any): string[] => {
    const headings: string[] = []
    if (node.type === "text" && node.role?.startsWith("heading") && node.content) {
      headings.push(node.content)
    }
    if (node.children) {
      node.children.forEach((child: any) => {
        headings.push(...extractHeadings(child))
      })
    }
    return headings
  }

  const headings = extractHeadings(myctDoc.root)
  const keyTopics = headings.slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="p-4 glass rounded-lg border border-accent-primary/20">
        <p className="text-xs text-muted font-mono mb-2">Reading Time</p>
        <p className="text-2xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
          {readingTime} min
        </p>
      </div>

      <div className="p-4 glass rounded-lg border border-border/30">
        <p className="text-xs text-muted font-mono mb-2">Word Count</p>
        <p className="text-2xl font-bold text-foreground">{wordCount.toLocaleString()}</p>
      </div>

      <div className="p-4 glass rounded-lg border border-border/30">
        <p className="text-xs text-muted font-mono mb-3">Key Topics</p>
        <div className="space-y-2">
          {keyTopics.map((topic, index) => (
            <div key={index} className="p-2 glass-strong rounded border border-accent-primary/10">
              <p className="text-sm text-foreground">{topic}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 glass rounded-lg border border-border/30">
        <p className="text-xs text-muted font-mono mb-3">Document Structure</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Sections</span>
            <span className="text-sm font-semibold text-foreground">{headings.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Paragraphs</span>
            <span className="text-sm font-semibold text-foreground">
              {fullText.split(/\n\n/).filter((p) => p.trim()).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
