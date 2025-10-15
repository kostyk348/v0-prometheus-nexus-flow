"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { MyctDocument, MyctNode } from "@/lib/types/myct"
import type { LensDocument, LensStyles } from "@/lib/types/lens"
import { matchesTarget } from "@/lib/types/lens"
import { fetchHyperedgeContent } from "@/lib/translator/url-parser"
import {
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Loader2,
  MessageSquare,
  Highlighter,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react"

interface MyctRendererProps {
  myctDoc: MyctDocument
  lens: LensDocument
  onNavigate?: (url: string) => void
}

export default function MyctRenderer({ myctDoc, lens, onNavigate }: MyctRendererProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [annotationMode, setAnnotationMode] = useState(false)
  const [annotations, setAnnotations] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="animate-fade-in">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border p-3 mb-4 flex items-center gap-3">
        <button
          onClick={() => setAnnotationMode(!annotationMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            annotationMode ? "bg-accent text-accent-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"
          }`}
        >
          <Highlighter className="w-4 h-4" />
          {annotationMode ? "Annotation Mode: ON" : "Enable Annotations"}
        </button>
        {annotations.size > 0 && (
          <span className="text-sm text-muted-foreground">
            {annotations.size} annotation{annotations.size !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <NodeRenderer
        node={myctDoc.root}
        lens={lens}
        isMobile={isMobile}
        depth={0}
        annotationMode={annotationMode}
        annotations={annotations}
        onAnnotate={(nodeId, text) => {
          const newAnnotations = new Map(annotations)
          if (text) {
            newAnnotations.set(nodeId, text)
          } else {
            newAnnotations.delete(nodeId)
          }
          setAnnotations(newAnnotations)
        }}
        onNavigate={onNavigate}
      />
    </div>
  )
}

interface NodeRendererProps {
  node: MyctNode
  lens: LensDocument
  isMobile: boolean
  depth: number
  annotationMode: boolean
  annotations: Map<string, string>
  onAnnotate: (nodeId: string, text: string) => void
  onNavigate?: (url: string) => void
}

function NodeRenderer({
  node,
  lens,
  isMobile,
  depth,
  annotationMode,
  annotations,
  onAnnotate,
  onNavigate,
}: NodeRendererProps) {
  const [state, setState] = useState<"normal" | "hover" | "active" | "expanded">("normal")
  const [expandedContent, setExpandedContent] = useState<MyctNode[] | null>(null)
  const [isExpanding, setIsExpanding] = useState(false)
  const [isAnnotating, setIsAnnotating] = useState(false)
  const [annotationText, setAnnotationText] = useState("")

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const nodeId = `${node.type}-${node.role || "default"}-${depth}-${node.content?.substring(0, 20) || node.src?.substring(0, 20) || ""}`
  const hasAnnotation = annotations.has(nodeId)

  const computedStyles = computeNodeStyles(node, lens, state, isMobile)

  const handleMouseEnter = () => {
    if (state !== "expanded") setState("hover")
  }
  const handleMouseLeave = () => {
    if (state !== "expanded") setState("normal")
  }

  const handleAnnotationClick = (e: React.MouseEvent) => {
    if (!annotationMode) return
    e.stopPropagation()
    setIsAnnotating(true)
    setAnnotationText(annotations.get(nodeId) || "")
  }

  const handleAnnotationSave = () => {
    onAnnotate(nodeId, annotationText)
    setIsAnnotating(false)
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    if (node.type === "link" && node.url && onNavigate) {
      e.preventDefault()
      onNavigate(node.url)
    }
  }

  const handleHyperedgeClick = async () => {
    if (node.type !== "hyperedge" || !node.targets) return

    if (expandedContent) {
      setExpandedContent(null)
      setState("normal")
    } else {
      setIsExpanding(true)
      setState("expanded")

      try {
        const contents = await Promise.all(node.targets.map(([nodeId, path]) => fetchHyperedgeContent(nodeId, path)))
        setExpandedContent(contents.flat())
      } catch (error) {
        console.error("Failed to fetch hyperedge content:", error)
      } finally {
        setIsExpanding(false)
      }
    }
  }

  switch (node.type) {
    case "link":
      return (
        <div className="relative group">
          <a
            href={node.url}
            onClick={handleLinkClick}
            style={computedStyles}
            className="flex items-center gap-2 transition-all duration-200 cursor-pointer hover:underline py-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-60" />
            <span className="truncate">{node.content}</span>
          </a>
        </div>
      )

    case "image":
      return (
        <div className="relative group my-4" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img
            src={node.src || "/placeholder.svg"}
            alt={node.alt || "Image"}
            style={computedStyles}
            className="max-w-full h-auto rounded-lg shadow-lg transition-all duration-200"
            loading="lazy"
          />
          {node.alt && <p className="text-sm text-muted-foreground mt-2 italic">{node.alt}</p>}
        </div>
      )

    case "video":
      return (
        <div className="relative group my-4" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {node.src?.includes("youtube.com") || node.src?.includes("youtu.be") || node.src?.includes("vimeo.com") ? (
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg" style={computedStyles}>
              <iframe
                src={node.src}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              src={node.src}
              poster={node.poster}
              controls
              style={computedStyles}
              className="max-w-full h-auto rounded-lg shadow-lg"
            >
              Your browser does not support the video tag.
            </video>
          )}
          {node.alt && <p className="text-sm text-muted-foreground mt-2 italic">{node.alt}</p>}
        </div>
      )

    case "audio":
      return (
        <div className="relative group my-4 p-4 bg-surface rounded-lg border border-border" style={computedStyles}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const audio = document.getElementById(nodeId) as HTMLAudioElement
                if (audio) {
                  if (isPlaying) {
                    audio.pause()
                  } else {
                    audio.play()
                  }
                  setIsPlaying(!isPlaying)
                }
              }}
              className="w-10 h-10 rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-background" />
              ) : (
                <Play className="w-5 h-5 text-background ml-0.5" />
              )}
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{node.alt || "Audio"}</p>
              {node.duration && (
                <p className="text-xs text-muted-foreground">
                  {Math.floor(node.duration / 60)}:{(node.duration % 60).toString().padStart(2, "0")}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                const audio = document.getElementById(nodeId) as HTMLAudioElement
                if (audio) {
                  audio.muted = !isMuted
                  setIsMuted(!isMuted)
                }
              }}
              className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
          <audio id={nodeId} src={node.src} className="hidden" />
        </div>
      )

    case "text":
      return (
        <div className="relative group">
          <div
            style={computedStyles}
            className="transition-all duration-200 cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleAnnotationClick}
          >
            {node.content}
            {annotationMode && (
              <MessageSquare
                className={`inline-block ml-2 w-4 h-4 ${hasAnnotation ? "text-accent fill-accent" : "text-muted-foreground opacity-0 group-hover:opacity-100"}`}
              />
            )}
          </div>

          {isAnnotating && (
            <div className="mt-2 p-3 bg-muted rounded-md border border-border">
              <textarea
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="Add your annotation..."
                className="w-full p-2 bg-background border border-border rounded text-sm resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleAnnotationSave}
                  className="px-3 py-1 bg-accent text-accent-foreground rounded text-sm font-medium hover:bg-accent/90"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsAnnotating(false)}
                  className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm hover:bg-muted/80"
                >
                  Cancel
                </button>
                {hasAnnotation && (
                  <button
                    onClick={() => {
                      onAnnotate(nodeId, "")
                      setIsAnnotating(false)
                    }}
                    className="px-3 py-1 bg-destructive/10 text-destructive rounded text-sm hover:bg-destructive/20"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}

          {hasAnnotation && !isAnnotating && (
            <div className="mt-2 p-3 bg-accent/10 border-l-4 border-accent rounded text-sm">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-foreground">{annotations.get(nodeId)}</p>
              </div>
            </div>
          )}
        </div>
      )

    case "stack":
      return (
        <div
          style={computedStyles}
          className="transition-all duration-200"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {node.children?.map((child, index) => (
            <NodeRenderer
              key={index}
              node={child}
              lens={lens}
              isMobile={isMobile}
              depth={depth + 1}
              annotationMode={annotationMode}
              annotations={annotations}
              onAnnotate={onAnnotate}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )

    case "hyperedge":
      return (
        <div className="my-2">
          <button
            onClick={handleHyperedgeClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={computedStyles}
            className="flex items-center gap-2 transition-all duration-200 cursor-pointer hover:opacity-100 disabled:opacity-50"
            disabled={isExpanding}
          >
            {isExpanding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : expandedContent ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {node.role === "replies" ? "View replies" : node.role === "comments" ? "View comments" : "Expand"}
              {node.targets && ` (${node.targets.length})`}
            </span>
          </button>

          {expandedContent && (
            <div className="ml-6 mt-2 border-l-2 border-accent/30 pl-4 animate-expand">
              {expandedContent.map((child, index) => (
                <NodeRenderer
                  key={index}
                  node={child}
                  lens={lens}
                  isMobile={isMobile}
                  depth={depth + 1}
                  annotationMode={annotationMode}
                  annotations={annotations}
                  onAnnotate={onAnnotate}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </div>
      )

    default:
      return null
  }
}

function computeNodeStyles(
  node: MyctNode,
  lens: LensDocument,
  state: "normal" | "hover" | "active" | "expanded",
  isMobile: boolean,
): LensStyles {
  let styles: LensStyles = {}

  if (lens.globals.typography) {
    styles.fontSize = lens.globals.typography.fontSize
    styles.fontWeight = 400
  }

  if (isMobile && lens.globals.responsive?.mobile) {
    if (lens.globals.responsive.mobile.spacing) {
      const spacing = lens.globals.responsive.mobile.spacing
      styles.paddingTop = spacing
      styles.paddingRight = spacing
      styles.paddingBottom = spacing
      styles.paddingLeft = spacing
    }
    if (lens.globals.responsive.mobile.fontSize) {
      styles.fontSize = lens.globals.responsive.mobile.fontSize
    }
  } else if (!isMobile && lens.globals.responsive?.desktop) {
    if (lens.globals.responsive.desktop.spacing) {
      const spacing = lens.globals.responsive.desktop.spacing
      styles.paddingTop = spacing
      styles.paddingRight = spacing
      styles.paddingBottom = spacing
      styles.paddingLeft = spacing
    }
    if (lens.globals.responsive.desktop.fontSize) {
      styles.fontSize = lens.globals.responsive.desktop.fontSize
    }
  }

  for (const rule of lens.rules) {
    if (matchesTarget(rule.target, { type: node.type, role: node.role }, state, isMobile)) {
      styles = { ...styles, ...rule.styles }
    }
  }

  return styles
}
