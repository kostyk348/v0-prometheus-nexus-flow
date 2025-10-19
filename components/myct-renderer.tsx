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
  viewMode?: "standard" | "bento" | "layers"
}

export default function MyctRenderer({ myctDoc, lens, onNavigate, viewMode = "standard" }: MyctRendererProps) {
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

  const collectContentNodes = (node: MyctNode): MyctNode[] => {
    if (node.type === "stack" && node.children) {
      return node.children.flatMap(collectContentNodes)
    }
    if (node.type === "section" && node.children) {
      return node.children.flatMap(collectContentNodes)
    }
    return [node]
  }

  const contentNodes = viewMode === "bento" ? collectContentNodes(myctDoc.root) : []

  const getBentoItemClass = (node: MyctNode): string => {
    const baseClass = "bento-item"
    if (node.role?.includes("heading") || node.role === "page-title") {
      return `${baseClass} bento-item-heading`
    }
    if (node.type === "image" || node.type === "video") {
      return `${baseClass} bento-item-media`
    }
    if (node.type === "table") {
      return `${baseClass} bento-item-table`
    }
    return baseClass
  }

  return (
    <div className="animate-fade-in">
      <div className="sticky top-0 z-10 glass-strong backdrop-blur-xl border-b border-border/50 p-4 mb-6 flex items-center gap-3 rounded-lg">
        <button
          onClick={() => setAnnotationMode(!annotationMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            annotationMode
              ? "bg-gradient-to-r from-accent-primary to-accent-secondary text-background shadow-lg shadow-glow-primary"
              : "glass hover:bg-layer-2 text-foreground"
          }`}
        >
          <Highlighter className="w-4 h-4" />
          {annotationMode ? "Annotation Mode: ON" : "Enable Annotations"}
        </button>
        {annotations.size > 0 && (
          <span className="text-sm text-muted font-mono px-3 py-1 glass rounded-full">
            {annotations.size} annotation{annotations.size !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {viewMode === "bento" ? (
        <div className="bento-grid">
          {contentNodes.map((node, index) => (
            <div key={index} className={getBentoItemClass(node)}>
              <NodeRenderer
                node={node}
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
          ))}
        </div>
      ) : (
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
      )}
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
            className="inline-flex items-center gap-2 transition-all duration-200 cursor-pointer hover:underline py-1 px-2 rounded-md hover:bg-layer-2"
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
        <div className="relative group my-6" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img
            src={node.src || "/placeholder.svg"}
            alt={node.alt || "Image"}
            style={computedStyles}
            className="max-w-full h-auto rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
          {node.alt && (
            <p className="text-sm text-muted mt-3 italic px-2 py-1 glass rounded-md inline-block">{node.alt}</p>
          )}
        </div>
      )

    case "video":
      return (
        <div className="relative group my-6" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {node.src?.includes("youtube.com") || node.src?.includes("youtu.be") || node.src?.includes("vimeo.com") ? (
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl" style={computedStyles}>
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
              className="max-w-full h-auto rounded-xl shadow-2xl"
            >
              Your browser does not support the video tag.
            </video>
          )}
          {node.alt && (
            <p className="text-sm text-muted mt-3 italic px-2 py-1 glass rounded-md inline-block">{node.alt}</p>
          )}
        </div>
      )

    case "audio":
      return (
        <div className="relative group my-4 p-5 glass-strong rounded-xl border border-border/50" style={computedStyles}>
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
              className="w-12 h-12 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:shadow-lg hover:shadow-glow-primary flex items-center justify-center transition-all"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-background" />
              ) : (
                <Play className="w-5 h-5 text-background ml-0.5" />
              )}
            </button>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{node.alt || "Audio"}</p>
              {node.duration && (
                <p className="text-xs text-muted font-mono">
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
              className="w-10 h-10 rounded-full hover:bg-layer-2 flex items-center justify-center transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-muted" /> : <Volume2 className="w-5 h-5 text-muted" />}
            </button>
          </div>
          <audio id={nodeId} src={node.src} className="hidden" />
        </div>
      )

    case "text":
      const isHeading = node.role?.startsWith("heading") || node.role === "page-title"
      const headingId = isHeading ? `heading-${node.content?.replace(/\s+/g, "-").toLowerCase()}` : undefined

      return (
        <div className="relative group" id={headingId} data-heading={isHeading ? node.content : undefined}>
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
                className={`inline-block ml-2 w-4 h-4 ${hasAnnotation ? "text-accent-primary fill-accent-primary" : "text-muted opacity-0 group-hover:opacity-100"}`}
              />
            )}
          </div>

          {isAnnotating && (
            <div className="mt-3 p-4 glass-strong rounded-lg border border-border/50 animate-slide-in-up">
              <textarea
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="Add your annotation..."
                className="w-full p-3 glass border border-border/50 rounded-lg text-sm resize-none focus:border-accent-primary transition-colors"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAnnotationSave}
                  className="px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary text-background rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-glow-primary transition-all"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsAnnotating(false)}
                  className="px-4 py-2 glass hover:bg-layer-2 text-foreground rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                {hasAnnotation && (
                  <button
                    onClick={() => {
                      onAnnotate(nodeId, "")
                      setIsAnnotating(false)
                    }}
                    className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}

          {hasAnnotation && !isAnnotating && (
            <div className="mt-3 p-4 glass-strong border-l-4 border-accent-primary rounded-lg text-sm animate-slide-in-up">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" />
                <p className="text-foreground leading-relaxed">{annotations.get(nodeId)}</p>
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
        <div className="my-3">
          <button
            onClick={handleHyperedgeClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={computedStyles}
            className="flex items-center gap-2 transition-all duration-200 cursor-pointer hover:opacity-100 disabled:opacity-50 px-3 py-2 rounded-lg glass hover:bg-layer-2"
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
            <div className="ml-8 mt-3 border-l-2 border-accent-primary/30 pl-6 animate-slide-in-up">
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

    case "section":
      const heading = node.children?.[0]
      const sectionContent = node.children?.slice(1) || []
      const headingText = heading?.content || ""
      const sectionId = `section-${headingText.replace(/\s+/g, "-").toLowerCase()}`

      return (
        <section id={sectionId} data-heading={headingText} className="my-8 scroll-mt-24" style={computedStyles}>
          {/* Render heading */}
          {heading && (
            <NodeRenderer
              node={heading}
              lens={lens}
              isMobile={isMobile}
              depth={depth}
              annotationMode={annotationMode}
              annotations={annotations}
              onAnnotate={onAnnotate}
              onNavigate={onNavigate}
            />
          )}

          {/* Render section content */}
          <div className="mt-4 space-y-3">
            {sectionContent.map((child, index) => (
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
        </section>
      )

    case "table":
      return (
        <div className="my-6 overflow-x-auto" style={computedStyles}>
          <table className="w-full border-collapse glass-strong rounded-xl overflow-hidden">
            {node.headers && node.headers.length > 0 && (
              <thead className="bg-layer-2">
                <tr>
                  {node.headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border/50"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            {node.rows && node.rows.length > 0 && (
              <tbody>
                {node.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-layer-1 transition-colors">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3 text-sm text-foreground border-b border-border/30">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
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
      const ruleStyles = { ...rule.styles }
      if (ruleStyles.padding) {
        const padding = ruleStyles.padding
        delete ruleStyles.padding
        ruleStyles.paddingTop = padding
        ruleStyles.paddingRight = padding
        ruleStyles.paddingBottom = padding
        ruleStyles.paddingLeft = padding
      }
      styles = { ...styles, ...ruleStyles }
    }
  }

  return styles
}
