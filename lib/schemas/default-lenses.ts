import type { LensDocument } from "@/lib/types/lens"

export const darkMinimalLens: LensDocument = {
  name: "Dark Minimal",
  globals: {
    colors: {
      background: "#0a0a0a",
      surface: "#1a1a1a",
      surfaceHover: "#252525",
      text: "#e0e0e0",
      textMuted: "#888888",
      accent: "#3dd68c",
      accentHover: "#2fc77d",
      border: "#2a2a2a",
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      lineHeight: 1.6,
    },
    responsive: {
      mobile: {
        spacing: 12,
        fontSize: 14,
      },
      desktop: {
        spacing: 16,
        fontSize: 15,
      },
    },
  },
  rules: [
    // Post cards
    {
      target: { type: "stack", role: "post" },
      styles: {
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 8,
        border: "1px solid #2a2a2a",
        margin: 8,
        gap: 12,
      },
    },
    {
      target: { type: "stack", role: "post", state: "hover" },
      styles: {
        backgroundColor: "#252525",
        border: "1px solid #3a3a3a",
      },
    },
    // Post header
    {
      target: { type: "stack", role: "post-header" },
      styles: {
        gap: 8,
        flexDirection: "row",
        display: "flex",
      },
    },
    {
      target: { type: "text", role: "author" },
      styles: {
        color: "#e0e0e0",
        fontSize: 15,
        fontWeight: 600,
      },
    },
    {
      target: { type: "text", role: "handle" },
      styles: {
        color: "#888888",
        fontSize: 14,
      },
    },
    {
      target: { type: "text", role: "timestamp" },
      styles: {
        color: "#666666",
        fontSize: 13,
        marginLeft: "auto",
      },
    },
    // Content
    {
      target: { type: "text", role: "content" },
      styles: {
        color: "#e0e0e0",
        fontSize: 15,
        lineHeight: 1.6,
      },
    },
    // Hyperedges
    {
      target: { type: "hyperedge" },
      styles: {
        color: "#3dd68c",
        padding: 8,
        borderRadius: 4,
        fontSize: 13,
        opacity: 0.8,
      },
    },
    {
      target: { type: "hyperedge", state: "hover" },
      styles: {
        opacity: 1,
        backgroundColor: "#1a2a1a",
      },
    },
    {
      target: { type: "hyperedge", state: "expanded" },
      styles: {
        opacity: 1,
        color: "#2fc77d",
      },
    },
    // Replies
    {
      target: { type: "stack", role: "reply" },
      styles: {
        backgroundColor: "#151515",
        padding: 12,
        borderRadius: 6,
        margin: 6,
        gap: 8,
      },
    },
    {
      target: { type: "stack", role: "reply-header" },
      styles: {
        gap: 6,
        flexDirection: "row",
        display: "flex",
      },
    },
    // Threads (Reddit)
    {
      target: { type: "stack", role: "thread" },
      styles: {
        backgroundColor: "#1a1a1a",
        padding: 18,
        borderRadius: 8,
        border: "1px solid #2a2a2a",
        margin: 8,
        gap: 12,
      },
    },
    {
      target: { type: "text", role: "title" },
      styles: {
        color: "#e0e0e0",
        fontSize: 18,
        fontWeight: 600,
      },
    },
    {
      target: { type: "text", role: "metadata" },
      styles: {
        color: "#666666",
        fontSize: 12,
      },
    },
    // Responsive
    {
      target: { type: "stack", device: "mobile" },
      styles: {
        flexDirection: "column",
        gap: 12,
      },
    },
    {
      target: { type: "stack", device: "desktop" },
      styles: {
        flexDirection: "column",
        gap: 16,
      },
    },
    // Wikipedia/article content
    {
      target: { type: "text", role: "page-title" },
      styles: {
        color: "#ffffff",
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 24,
        padding: 16,
        borderBottom: "2px solid #3dd68c",
      },
    },
    {
      target: { type: "text", role: "heading-2" },
      styles: {
        color: "#3dd68c",
        fontSize: 24,
        fontWeight: 600,
        marginTop: 32,
        marginBottom: 16,
        padding: 8,
        borderLeft: "4px solid #3dd68c",
        paddingLeft: 16,
      },
    },
    {
      target: { type: "text", role: "heading-3" },
      styles: {
        color: "#e0e0e0",
        fontSize: 20,
        fontWeight: 600,
        marginTop: 24,
        marginBottom: 12,
        paddingLeft: 12,
      },
    },
    {
      target: { type: "text", role: "heading-4" },
      styles: {
        color: "#e0e0e0",
        fontSize: 18,
        fontWeight: 600,
        marginTop: 20,
        marginBottom: 10,
      },
    },
    {
      target: { type: "text", role: "paragraph" },
      styles: {
        color: "#c0c0c0",
        fontSize: 16,
        lineHeight: 1.8,
        marginBottom: 16,
        padding: 8,
      },
    },
    {
      target: { type: "text", role: "paragraph", state: "hover" },
      styles: {
        backgroundColor: "#1a1a1a",
        borderRadius: 4,
      },
    },
    {
      target: { type: "stack", role: "list" },
      styles: {
        marginLeft: 24,
        marginBottom: 16,
        gap: 8,
      },
    },
    {
      target: { type: "text", role: "list-item" },
      styles: {
        color: "#c0c0c0",
        fontSize: 15,
        lineHeight: 1.6,
        paddingLeft: 8,
        borderLeft: "2px solid #2a2a2a",
      },
    },
    {
      target: { type: "text", role: "list-item", state: "hover" },
      styles: {
        borderLeft: "2px solid #3dd68c",
        backgroundColor: "#1a1a1a",
      },
    },
    {
      target: { type: "text", role: "quote" },
      styles: {
        color: "#888888",
        fontSize: 16,
        fontStyle: "italic",
        padding: 16,
        marginLeft: 16,
        borderLeft: "4px solid #3dd68c",
        backgroundColor: "#151515",
        border: "1px solid #2a2a2a",
        borderRadius: 4,
      },
    },
    {
      target: { type: "text", role: "text" },
      styles: {
        color: "#c0c0c0",
        fontSize: 15,
        lineHeight: 1.7,
        marginBottom: 12,
      },
    },
    {
      target: { type: "link", role: "document-link" },
      styles: {
        color: "#3dd68c",
        fontSize: 14,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,
      },
    },
    {
      target: { type: "link", role: "document-link", state: "hover" },
      styles: {
        backgroundColor: "#1a2a1a",
        color: "#2fc77d",
      },
    },
    {
      target: { type: "stack", role: "links-section" },
      styles: {
        marginTop: 32,
        paddingTop: 24,
        borderTop: "1px solid #2a2a2a",
      },
    },
    {
      target: { type: "text", role: "section-title" },
      styles: {
        color: "#888888",
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 16,
        textTransform: "uppercase" as any,
        letterSpacing: "0.05em" as any,
      },
    },
    {
      target: { type: "image", role: "image" },
      styles: {
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 8,
        border: "1px solid #2a2a2a",
      },
    },
    {
      target: { type: "image", role: "image", state: "hover" },
      styles: {
        border: "1px solid #3dd68c",
        boxShadow: "0 4px 12px rgba(61, 214, 140, 0.2)",
      },
    },
    {
      target: { type: "video", role: "video" },
      styles: {
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 8,
        border: "1px solid #2a2a2a",
      },
    },
    {
      target: { type: "video", role: "embedded-video" },
      styles: {
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 8,
        border: "1px solid #2a2a2a",
      },
    },
    {
      target: { type: "audio", role: "audio" },
      styles: {
        marginTop: 16,
        marginBottom: 16,
      },
    },
  ],
}

export const socialLightLens: LensDocument = {
  name: "Social Light",
  globals: {
    colors: {
      background: "#ffffff",
      surface: "#f8f8f8",
      surfaceHover: "#f0f0f0",
      text: "#1a1a1a",
      textMuted: "#666666",
      accent: "#1d9bf0",
      accentHover: "#1a8cd8",
      border: "#e0e0e0",
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      lineHeight: 1.5,
    },
  },
  rules: [
    {
      target: { type: "stack", role: "post" },
      styles: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 12,
        border: "1px solid #e0e0e0",
        margin: 8,
        gap: 12,
      },
    },
    {
      target: { type: "stack", role: "post", state: "hover" },
      styles: {
        backgroundColor: "#f8f8f8",
      },
    },
    {
      target: { type: "stack", role: "post-header" },
      styles: {
        gap: 8,
        flexDirection: "row",
        display: "flex",
      },
    },
    {
      target: { type: "text", role: "author" },
      styles: {
        color: "#1a1a1a",
        fontSize: 15,
        fontWeight: 600,
      },
    },
    {
      target: { type: "text", role: "handle" },
      styles: {
        color: "#666666",
        fontSize: 14,
      },
    },
    {
      target: { type: "text", role: "content" },
      styles: {
        color: "#1a1a1a",
        fontSize: 15,
      },
    },
    {
      target: { type: "hyperedge" },
      styles: {
        color: "#1d9bf0",
        padding: 8,
        fontSize: 13,
      },
    },
    {
      target: { type: "hyperedge", state: "hover" },
      styles: {
        backgroundColor: "#e8f5fd",
      },
    },
    {
      target: { type: "stack", role: "reply" },
      styles: {
        backgroundColor: "#f8f8f8",
        padding: 12,
        borderRadius: 8,
        margin: 6,
        gap: 8,
      },
    },
    // Article content
    {
      target: { type: "text", role: "page-title" },
      styles: {
        color: "#1a1a1a",
        fontSize: 36,
        fontWeight: 700,
        marginBottom: 24,
        padding: 16,
        borderBottom: "3px solid #1d9bf0",
      },
    },
    {
      target: { type: "text", role: "heading-2" },
      styles: {
        color: "#1d9bf0",
        fontSize: 26,
        fontWeight: 600,
        marginTop: 32,
        marginBottom: 16,
        padding: 8,
        borderLeft: "4px solid #1d9bf0",
        paddingLeft: 16,
      },
    },
    {
      target: { type: "text", role: "heading-3" },
      styles: {
        color: "#1a1a1a",
        fontSize: 22,
        fontWeight: 600,
        marginTop: 24,
        marginBottom: 12,
      },
    },
    {
      target: { type: "text", role: "paragraph" },
      styles: {
        color: "#2a2a2a",
        fontSize: 16,
        lineHeight: 1.7,
        marginBottom: 16,
        padding: 8,
      },
    },
    {
      target: { type: "text", role: "paragraph", state: "hover" },
      styles: {
        backgroundColor: "#f8f8f8",
        borderRadius: 4,
      },
    },
    {
      target: { type: "stack", role: "list" },
      styles: {
        marginLeft: 24,
        marginBottom: 16,
        gap: 8,
      },
    },
    {
      target: { type: "text", role: "list-item" },
      styles: {
        color: "#2a2a2a",
        fontSize: 15,
        lineHeight: 1.6,
        paddingLeft: 8,
        borderLeft: "2px solid #e0e0e0",
      },
    },
    {
      target: { type: "text", role: "list-item", state: "hover" },
      styles: {
        borderLeft: "2px solid #1d9bf0",
        backgroundColor: "#f8f8f8",
      },
    },
    {
      target: { type: "text", role: "quote" },
      styles: {
        color: "#666666",
        fontSize: 16,
        fontStyle: "italic",
        padding: 16,
        marginLeft: 16,
        borderLeft: "4px solid #1d9bf0",
        backgroundColor: "#f8f8f8",
        borderRadius: 4,
      },
    },
    {
      target: { type: "link", role: "document-link" },
      styles: {
        color: "#1d9bf0",
        fontSize: 14,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,
      },
    },
    {
      target: { type: "link", role: "document-link", state: "hover" },
      styles: {
        backgroundColor: "#e8f5fd",
        color: "#1a8cd8",
      },
    },
    {
      target: { type: "stack", role: "links-section" },
      styles: {
        marginTop: 32,
        paddingTop: 24,
        borderTop: "1px solid #e0e0e0",
      },
    },
    {
      target: { type: "text", role: "section-title" },
      styles: {
        color: "#666666",
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 16,
        textTransform: "uppercase" as any,
        letterSpacing: "0.05em" as any,
      },
    },
    {
      target: { type: "image", role: "image" },
      styles: {
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 12,
        border: "1px solid #e0e0e0",
      },
    },
    {
      target: { type: "image", role: "image", state: "hover" },
      styles: {
        border: "1px solid #1d9bf0",
        boxShadow: "0 4px 12px rgba(29, 155, 240, 0.2)",
      },
    },
    {
      target: { type: "video", role: "video" },
      styles: {
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 12,
        border: "1px solid #e0e0e0",
      },
    },
    {
      target: { type: "video", role: "embedded-video" },
      styles: {
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 12,
        border: "1px solid #e0e0e0",
      },
    },
    {
      target: { type: "audio", role: "audio" },
      styles: {
        marginTop: 16,
        marginBottom: 16,
      },
    },
  ],
}

export const xanaduLens: LensDocument = {
  name: "Xanadu",
  globals: {
    colors: {
      background: "#0d1117",
      surface: "#161b22",
      surfaceHover: "#1f2937",
      text: "#c9d1d9",
      textMuted: "#8b949e",
      accent: "#58a6ff",
      accentHover: "#79c0ff",
      border: "#30363d",
      hyperedge: "#3fb950",
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      fontFamily: "var(--font-mono)",
      fontSize: 14,
      lineHeight: 1.7,
    },
  },
  rules: [
    {
      target: { type: "stack", role: "post" },
      styles: {
        backgroundColor: "#161b22",
        padding: 20,
        borderRadius: 6,
        border: "1px solid #30363d",
        margin: 12,
        gap: 14,
      },
    },
    {
      target: { type: "stack", role: "post", state: "hover" },
      styles: {
        border: "1px solid #58a6ff33",
      },
    },
    {
      target: { type: "stack", role: "post-header" },
      styles: {
        gap: 10,
        flexDirection: "row",
        display: "flex",
      },
    },
    {
      target: { type: "text", role: "author" },
      styles: {
        color: "#58a6ff",
        fontSize: 14,
        fontWeight: 600,
      },
    },
    {
      target: { type: "text", role: "handle" },
      styles: {
        color: "#8b949e",
        fontSize: 13,
      },
    },
    {
      target: { type: "text", role: "content" },
      styles: {
        color: "#c9d1d9",
        fontSize: 14,
        lineHeight: 1.7,
      },
    },
    {
      target: { type: "hyperedge" },
      styles: {
        color: "#3fb950",
        padding: 6,
        borderRadius: 3,
        fontSize: 12,
        fontWeight: 600,
        border: "1px solid #3fb95033",
      },
    },
    {
      target: { type: "hyperedge", state: "hover" },
      styles: {
        backgroundColor: "#1a2e1a",
        border: "1px solid #3fb95066",
      },
    },
    {
      target: { type: "hyperedge", state: "expanded" },
      styles: {
        backgroundColor: "#1a2e1a",
        border: "1px solid #3fb950",
      },
    },
    {
      target: { type: "stack", role: "reply" },
      styles: {
        backgroundColor: "#0d1117",
        padding: 14,
        borderRadius: 4,
        border: "1px solid #30363d",
        margin: 8,
        gap: 10,
      },
    },
    {
      target: { type: "stack", role: "thread" },
      styles: {
        backgroundColor: "#161b22",
        padding: 20,
        borderRadius: 6,
        border: "1px solid #30363d",
        margin: 12,
        gap: 14,
      },
    },
    {
      target: { type: "text", role: "title" },
      styles: {
        color: "#58a6ff",
        fontSize: 16,
        fontWeight: 700,
      },
    },
    // Xanadu-style hypertext rules for article content
    {
      target: { type: "text", role: "page-title" },
      styles: {
        color: "#58a6ff",
        fontSize: 34,
        fontWeight: 700,
        marginBottom: 24,
        padding: 16,
        borderBottom: "2px solid #3fb950",
        fontFamily: "var(--font-mono)",
      },
    },
    {
      target: { type: "text", role: "heading-2" },
      styles: {
        color: "#3fb950",
        fontSize: 24,
        fontWeight: 600,
        marginTop: 32,
        marginBottom: 16,
        padding: 10,
        borderLeft: "4px solid #3fb950",
        paddingLeft: 16,
        backgroundColor: "#0d1117",
      },
    },
    {
      target: { type: "text", role: "heading-3" },
      styles: {
        color: "#58a6ff",
        fontSize: 20,
        fontWeight: 600,
        marginTop: 24,
        marginBottom: 12,
        paddingLeft: 12,
      },
    },
    {
      target: { type: "text", role: "heading-4" },
      styles: {
        color: "#c9d1d9",
        fontSize: 18,
        fontWeight: 600,
        marginTop: 20,
        marginBottom: 10,
      },
    },
    {
      target: { type: "text", role: "paragraph" },
      styles: {
        color: "#c9d1d9",
        fontSize: 15,
        lineHeight: 1.8,
        marginBottom: 16,
        padding: 10,
        fontFamily: "var(--font-mono)",
      },
    },
    {
      target: { type: "text", role: "paragraph", state: "hover" },
      styles: {
        backgroundColor: "#161b22",
        borderRadius: 4,
        border: "1px solid #30363d",
      },
    },
    {
      target: { type: "stack", role: "list" },
      styles: {
        marginLeft: 24,
        marginBottom: 16,
        gap: 10,
        border: "1px solid #30363d",
        padding: 12,
        borderRadius: 4,
        backgroundColor: "#0d1117",
      },
    },
    {
      target: { type: "text", role: "list-item" },
      styles: {
        color: "#c9d1d9",
        fontSize: 14,
        lineHeight: 1.7,
        paddingLeft: 12,
        borderLeft: "2px solid #3fb950",
        fontFamily: "var(--font-mono)",
      },
    },
    {
      target: { type: "text", role: "list-item", state: "hover" },
      styles: {
        borderLeft: "2px solid #58a6ff",
        backgroundColor: "#161b22",
      },
    },
    {
      target: { type: "text", role: "quote" },
      styles: {
        color: "#8b949e",
        fontSize: 15,
        fontStyle: "italic",
        padding: 16,
        marginLeft: 16,
        borderLeft: "4px solid #3fb950",
        backgroundColor: "#0d1117",
        border: "1px solid #30363d",
        borderRadius: 4,
        fontFamily: "var(--font-mono)",
      },
    },
    {
      target: { type: "text", role: "text" },
      styles: {
        color: "#c9d1d9",
        fontSize: 14,
        lineHeight: 1.7,
        marginBottom: 12,
        fontFamily: "var(--font-mono)",
      },
    },
    {
      target: { type: "link", role: "document-link" },
      styles: {
        color: "#3fb950",
        fontSize: 13,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 3,
        border: "1px solid #3fb95033",
        fontFamily: "var(--font-mono)",
      },
    },
    {
      target: { type: "link", role: "document-link", state: "hover" },
      styles: {
        backgroundColor: "#1a2e1a",
        border: "1px solid #3fb95066",
        color: "#58a6ff",
      },
    },
    {
      target: { type: "stack", role: "links-section" },
      styles: {
        marginTop: 32,
        paddingTop: 24,
        borderTop: "2px solid #30363d",
        backgroundColor: "#0d1117",
        padding: 16,
        borderRadius: 6,
      },
    },
    {
      target: { type: "text", role: "section-title" },
      styles: {
        color: "#58a6ff",
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 16,
        textTransform: "uppercase" as any,
        letterSpacing: "0.1em" as any,
        fontFamily: "var(--font-mono)",
      },
    },
    {
      target: { type: "image", role: "image" },
      styles: {
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 6,
        border: "1px solid #30363d",
      },
    },
    {
      target: { type: "image", role: "image", state: "hover" },
      styles: {
        border: "1px solid #3fb950",
        boxShadow: "0 4px 12px rgba(63, 185, 80, 0.2)",
      },
    },
    {
      target: { type: "video", role: "video" },
      styles: {
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 6,
        border: "1px solid #30363d",
      },
    },
    {
      target: { type: "video", role: "embedded-video" },
      styles: {
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 6,
        border: "1px solid #30363d",
      },
    },
    {
      target: { type: "audio", role: "audio" },
      styles: {
        marginTop: 16,
        marginBottom: 16,
      },
    },
  ],
}
