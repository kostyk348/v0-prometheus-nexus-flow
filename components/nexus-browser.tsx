"use client"
import { useState, useEffect, useCallback, useMemo, memo } from "react"
import type React from "react"

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
  Share2,
  Copy,
  Menu,
  X,
  Volume2,
  Moon,
  Command,
  Printer,
  Highlighter,
  StickyNote,
  Columns,
  WifiOff,
  BarChart3,
  Languages,
  BookOpen,
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
  collection?: string
}

interface Note {
  id: string
  content: string
  timestamp: number
}

interface Highlight {
  id: string
  text: string
  color: string
  timestamp: number
}

const MemoizedMyctRenderer = memo(MyctRenderer)
const MemoizedLensSelector = memo(LensSelector)

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
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [readingMode, setReadingMode] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showHighlights, setShowHighlights] = useState(false)
  const [showCollections, setShowCollections] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonUrl, setComparisonUrl] = useState("")
  const [comparisonDoc, setComparisonDoc] = useState<MyctDocument | null>(null)
  const [offlineMode, setOfflineMode] = useState(false)
  const [cachedPages, setCachedPages] = useState<Map<string, MyctDocument>>(new Map())
  const [showPerformance, setShowPerformance] = useState(false)
  const [loadTime, setLoadTime] = useState(0)
  const [notes, setNotes] = useState<Map<string, Note[]>>(new Map())
  const [highlights, setHighlights] = useState<Map<string, Highlight[]>>(new Map())
  const [collections, setCollections] = useState<string[]>(["Reading List", "Research", "Favorites"])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [translationLang, setTranslationLang] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("nexus-bookmarks")
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load bookmarks", e)
      }
    }

    const savedDarkMode = localStorage.getItem("nexus-dark-mode")
    if (savedDarkMode) setDarkMode(savedDarkMode === "true")

    const savedFontSize = localStorage.getItem("nexus-font-size")
    if (savedFontSize) setFontSize(Number.parseInt(savedFontSize))

    const savedNotes = localStorage.getItem("nexus-notes")
    if (savedNotes) {
      try {
        setNotes(new Map(JSON.parse(savedNotes)))
      } catch (e) {
        console.error("Failed to load notes", e)
      }
    }

    const savedHighlights = localStorage.getItem("nexus-highlights")
    if (savedHighlights) {
      try {
        setHighlights(new Map(JSON.parse(savedHighlights)))
      } catch (e) {
        console.error("Failed to load highlights", e)
      }
    }

    const savedCollections = localStorage.getItem("nexus-collections")
    if (savedCollections) {
      try {
        setCollections(JSON.parse(savedCollections))
      } catch (e) {
        console.error("Failed to load collections", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("nexus-bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    localStorage.setItem("nexus-dark-mode", darkMode.toString())
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem("nexus-font-size", fontSize.toString())
    document.documentElement.style.fontSize = `${fontSize}px`
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem("nexus-notes", JSON.stringify(Array.from(notes.entries())))
  }, [notes])

  useEffect(() => {
    localStorage.setItem("nexus-highlights", JSON.stringify(Array.from(highlights.entries())))
  }, [highlights])

  useEffect(() => {
    localStorage.setItem("nexus-collections", JSON.stringify(collections))
  }, [collections])

  useEffect(() => {
    const lensSlug = selectedLens.name.toLowerCase().replace(/\s+/g, "-")
    document.body.setAttribute("data-lens", lensSlug)
  }, [selectedLens])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault()
        toggleBookmark()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault()
        setDarkMode(!darkMode)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "r") {
        e.preventDefault()
        setReadingMode(!readingMode)
      }
      if (e.key === "Escape") {
        setShowCommandPalette(false)
        setShowMobileMenu(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [darkMode, readingMode])

  const navigateToUrl = useCallback(
    async (targetUrl: string, addToHistory = true) => {
      if (!targetUrl.trim()) return

      const startTime = performance.now()
      setLoading(true)
      setError(null)
      setMyctDoc(null)

      if (offlineMode && cachedPages.has(targetUrl)) {
        setMyctDoc(cachedPages.get(targetUrl)!)
        setCurrentUrl(targetUrl)
        setUrl(targetUrl)
        setLoading(false)
        setLoadTime(performance.now() - startTime)
        return
      }

      const result = await translateUrl(targetUrl)

      if (result.error || !result.myct) {
        setError(result.error || "Failed to load page")
        setMyctDoc(null)
      } else {
        setMyctDoc(result.myct)
        setCurrentUrl(targetUrl)
        setUrl(targetUrl)
        setError(null)

        setCachedPages((prev) => new Map(prev).set(targetUrl, result.myct!))

        if (addToHistory) {
          const newHistory = history.slice(0, historyIndex + 1)
          newHistory.push(targetUrl)
          setHistory(newHistory)
          setHistoryIndex(newHistory.length - 1)
        }
      }

      setLoading(false)
      setLoadTime(performance.now() - startTime)
    },
    [history, historyIndex, offlineMode, cachedPages],
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

  const toggleBookmark = (collection?: string) => {
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
          collection,
        },
      ])
    }
  }

  const isBookmarked = useMemo(() => {
    return bookmarks.some((b) => b.url === currentUrl)
  }, [bookmarks, currentUrl])

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      if (!myctDoc) return
      const text = extractTextContent(myctDoc.root)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  const extractTextContent = (node: any): string => {
    if (node.type === "text") return node.content || ""
    if (node.children) return node.children.map(extractTextContent).join(" ")
    return ""
  }

  const exportAsMarkdown = () => {
    if (!myctDoc) return

    const extractText = (node: any, depth = 0): string => {
      const lines: string[] = []

      if (node.type === "text") {
        if (node.role === "page-title") {
          lines.push(`# ${node.content || ""}`)
        } else if (node.role?.startsWith("heading")) {
          const level = node.role.split("-")[1]
          const hashes = "#".repeat(Math.min(Number.parseInt(level) + 1, 6))
          lines.push(`${hashes} ${node.content || ""}`)
        } else if (node.role === "paragraph") {
          lines.push(node.content || "")
        } else if (node.role === "list-item") {
          lines.push(`- ${node.content || ""}`)
        } else if (node.role === "quote") {
          lines.push(`> ${node.content || ""}`)
        } else {
          lines.push(node.content || "")
        }
      } else if (node.type === "link") {
        lines.push(`[${node.content || "Link"}](${node.url || ""})`)
      } else if (node.type === "image") {
        lines.push(`![${node.alt || "Image"}](${node.src || ""})`)
      } else if (node.type === "section" && node.children) {
        for (const child of node.children) {
          lines.push(extractText(child, depth + 1))
        }
      } else if (node.type === "table" && node.headers && node.rows) {
        // Table header
        lines.push(`| ${node.headers.join(" | ")} |`)
        lines.push(`| ${node.headers.map(() => "---").join(" | ")} |`)
        // Table rows
        for (const row of node.rows) {
          lines.push(`| ${row.join(" | ")} |`)
        }
      } else if (node.children) {
        for (const child of node.children) {
          lines.push(extractText(child, depth))
        }
      }

      return lines.filter((l) => l.trim()).join("\n\n")
    }

    const markdown = extractText(myctDoc.root)
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const title = myctDoc.root.children?.[0]?.content || "page"
    a.download = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsPDF = () => {
    window.print()
  }

  const shareCurrentPage = async () => {
    if (!currentUrl || !myctDoc) return

    const title = myctDoc.root.children?.[0]?.content || "Page"
    const text = `Check out this page: ${title}`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: currentUrl })
      } catch (err) {
        console.error("Share failed:", err)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(currentUrl)
      alert("URL copied to clipboard!")
    }
  }

  const copyContent = async () => {
    if (!myctDoc) return

    const extractText = (node: any): string => {
      if (node.type === "text") return node.content || ""
      if (node.children) return node.children.map(extractText).join("\n\n")
      return ""
    }

    const text = extractText(myctDoc.root)
    await navigator.clipboard.writeText(text)
    alert("Content copied to clipboard!")
  }

  const addNote = (content: string) => {
    if (!currentUrl) return
    const pageNotes = notes.get(currentUrl) || []
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
    }
    setNotes(new Map(notes).set(currentUrl, [...pageNotes, newNote]))
  }

  const addHighlight = (text: string, color: string) => {
    if (!currentUrl) return
    const pageHighlights = highlights.get(currentUrl) || []
    const newHighlight: Highlight = {
      id: Date.now().toString(),
      text,
      color,
      timestamp: Date.now(),
    }
    setHighlights(new Map(highlights).set(currentUrl, [...pageHighlights, newHighlight]))
  }

  const loadComparison = async () => {
    if (!comparisonUrl.trim()) return
    const result = await translateUrl(comparisonUrl)
    if (result.myct) {
      setComparisonDoc(result.myct)
    }
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
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32 animate-fade-in">
          <div className="w-full max-w-2xl glass-strong rounded-2xl shadow-2xl shadow-glow-primary/30 overflow-hidden animate-slide-in-up">
            <div className="p-4 border-b border-accent-primary/20">
              <div className="flex items-center gap-3">
                <Command className="w-5 h-5 text-accent-primary" />
                <Input
                  type="text"
                  placeholder="Type a command..."
                  className="border-0 bg-transparent focus:ring-0 text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
              <CommandItem icon={<Bookmark />} label="Toggle Bookmark" shortcut="⌘B" onClick={toggleBookmark} />
              <CommandItem
                icon={<Moon />}
                label="Toggle Dark Mode"
                shortcut="⌘D"
                onClick={() => setDarkMode(!darkMode)}
              />
              <CommandItem
                icon={<BookOpen />}
                label="Reading Mode"
                shortcut="⌘R"
                onClick={() => setReadingMode(!readingMode)}
              />
              <CommandItem icon={<Volume2 />} label="Text to Speech" onClick={toggleSpeech} />
              <CommandItem icon={<Download />} label="Export Markdown" onClick={exportAsMarkdown} />
              <CommandItem icon={<Printer />} label="Export PDF" onClick={exportAsPDF} />
              <CommandItem icon={<Share2 />} label="Share Page" onClick={shareCurrentPage} />
              <CommandItem icon={<Copy />} label="Copy Content" onClick={copyContent} />
            </div>
          </div>
        </div>
      )}

      <header className="glass-strong border-b border-accent-primary/20 sticky top-0 z-50 shadow-lg shadow-glow-primary/10">
        <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 max-w-7xl mx-auto">
          {/* Mobile menu button */}
          <Button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            variant="ghost"
            size="sm"
            className="md:hidden w-9 h-9 p-0 hover:bg-accent-primary/10"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-tertiary rounded-xl flex items-center justify-center shadow-xl shadow-glow-primary/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <span className="text-background font-mono font-bold text-base sm:text-lg relative z-10">ΠN</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg font-mono font-bold bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">
                Prometheus Nexus
              </h1>
              <p className="text-xs text-muted font-mono hidden lg:block">Hyperdimensional Browser</p>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-1 glass rounded-lg p-1 border border-border/30">
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
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-accent-primary/60" />
              <Input
                type="text"
                placeholder="Enter URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleNavigate()}
                className="pl-8 sm:pl-10 text-sm glass border-accent-primary/20 text-foreground placeholder:text-muted focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
              />
            </div>
            <Button
              onClick={handleNavigate}
              disabled={loading}
              size="sm"
              className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary hover:shadow-xl hover:shadow-glow-primary/50 text-background font-semibold transition-all hover:scale-105 hidden sm:flex"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span className="hidden lg:inline ml-2">Navigate</span>
            </Button>
            <Button
              onClick={handleNavigate}
              disabled={loading}
              size="sm"
              className="sm:hidden w-9 h-9 p-0 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            </Button>
          </div>

          {/* Desktop controls */}
          {myctDoc && (
            <div className="hidden lg:flex items-center gap-1">
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
                <Button
                  onClick={shareCurrentPage}
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 hover:bg-accent-primary/10 hover:text-accent-primary"
                  title="Share Page"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={copyContent}
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 hover:bg-accent-primary/10 hover:text-accent-primary"
                  title="Copy Content"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="hidden md:block">
            <LensSelector selectedLens={selectedLens} onLensChange={setSelectedLens} />
          </div>
        </div>

        {showMobileMenu && myctDoc && (
          <div className="md:hidden border-t border-accent-primary/20 p-4 space-y-3 animate-slide-in-up glass-strong">
            <div className="flex items-center gap-2">
              <Button
                onClick={goBack}
                disabled={historyIndex <= 0}
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={goForward}
                disabled={historyIndex >= history.length - 1}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Forward
              </Button>
              <Button onClick={goHome} variant="outline" size="sm" className="flex-1 bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => {
                  setViewMode("standard")
                  setShowMobileMenu(false)
                }}
                variant={viewMode === "standard" ? "default" : "outline"}
                size="sm"
              >
                <Eye className="w-4 h-4 mr-1" />
                Standard
              </Button>
              <Button
                onClick={() => {
                  setViewMode("bento")
                  setShowMobileMenu(false)
                }}
                variant={viewMode === "bento" ? "default" : "outline"}
                size="sm"
              >
                <Grid3x3 className="w-4 h-4 mr-1" />
                Bento
              </Button>
              <Button
                onClick={() => {
                  setViewMode("layers")
                  setShowMobileMenu(false)
                }}
                variant={viewMode === "layers" ? "default" : "outline"}
                size="sm"
              >
                <Layers className="w-4 h-4 mr-1" />
                Layers
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => {
                  setShowOutline(!showOutline)
                  setShowMobileMenu(false)
                }}
                variant="outline"
                size="sm"
              >
                <List className="w-4 h-4 mr-2" />
                Outline
              </Button>
              <Button
                onClick={() => {
                  setShowGraph(!showGraph)
                  setShowMobileMenu(false)
                }}
                variant="outline"
                size="sm"
              >
                <Network className="w-4 h-4 mr-2" />
                Graph
              </Button>
              <Button
                onClick={() => {
                  setShowAI(!showAI)
                  setShowMobileMenu(false)
                }}
                variant="outline"
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Insights
              </Button>
              <Button onClick={toggleBookmark} variant="outline" size="sm">
                <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                Bookmark
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={exportAsMarkdown} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export MD
              </Button>
              <Button onClick={shareCurrentPage} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <LensSelector selectedLens={selectedLens} onLensChange={setSelectedLens} />
          </div>
        )}
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
              <p className="text-foreground max-w-lg mb-10 leading-relaxed text-lg font-medium">
                A hyperdimensional semantic browser with AI insights, connection graphs, bookmarks, and transformative
                lenses.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl">
                <FeatureCard icon={<Volume2 />} label="Text-to-Speech" />
                <FeatureCard icon={<Languages />} label="Translation" />
                <FeatureCard icon={<Highlighter />} label="Highlighting" />
                <FeatureCard icon={<StickyNote />} label="Notes" />
                <FeatureCard icon={<Columns />} label="Comparison" />
                <FeatureCard icon={<WifiOff />} label="Offline Mode" />
                <FeatureCard icon={<BarChart3 />} label="Performance" />
                <FeatureCard icon={<Command />} label="Shortcuts" />
              </div>

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
                            <p className="text-xs text-accent-secondary font-mono truncate">{bookmark.url}</p>
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
                        <p className="text-xs text-accent-secondary font-mono truncate">{example.url}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {myctDoc && !loading && (
            <div className={`${viewMode === "bento" ? "" : "max-w-5xl mx-auto p-6"} animate-slide-in-up`}>
              <MemoizedMyctRenderer
                myctDoc={myctDoc}
                lens={selectedLens}
                onNavigate={navigateToUrl}
                viewMode={viewMode}
                readingMode={readingMode}
                fontSize={fontSize}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const FeatureCard = memo(({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="hyper-card p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all">
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center text-accent-primary">
      {icon}
    </div>
    <p className="text-xs font-semibold text-foreground">{label}</p>
  </div>
))

const CommandItem = memo(
  ({
    icon,
    label,
    shortcut,
    onClick,
  }: {
    icon: React.ReactNode
    label: string
    shortcut?: string
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent-primary/10 hover:text-accent-primary transition-all group"
    >
      <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:bg-accent-primary/20">
        {icon}
      </div>
      <span className="flex-1 text-left text-sm font-medium text-foreground group-hover:text-accent-primary">
        {label}
      </span>
      {shortcut && (
        <span className="text-xs font-mono text-muted-foreground group-hover:text-accent-primary/70">{shortcut}</span>
      )}
    </button>
  ),
)

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
