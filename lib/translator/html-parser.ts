// HTML Parser - Extracts semantic content from HTML
import type { MyctNode } from "@/lib/types/myct"
import { createStackNode, createTextNode } from "@/lib/types/myct"

export interface ParsedContent {
  title?: string
  description?: string
  author?: string
  content: MyctNode[]
  links: Array<{ text: string; url: string }>
  metadata: Record<string, string>
}

export function parseHTML(html: string, url: string): ParsedContent {
  console.log("[v0] Parsing HTML, length:", html.length)

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : undefined

  // Extract meta tags
  const metaDescription = extractMetaTag(html, "description")
  const metaAuthor = extractMetaTag(html, "author")
  const ogTitle = extractMetaTag(html, "og:title")
  const ogDescription = extractMetaTag(html, "og:description")

  const content = extractMainContent(html, url)

  // Extract links
  const links = extractLinks(html, url)

  console.log("[v0] Parsed content:", {
    title,
    contentNodes: content.length,
    links: links.length,
  })

  return {
    title: title || ogTitle,
    description: metaDescription || ogDescription,
    author: metaAuthor,
    content,
    links,
    metadata: {
      url,
      parsedAt: new Date().toISOString(),
    },
  }
}

function extractMetaTag(html: string, name: string): string | undefined {
  const patterns = [
    new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+name=["']${name}["']`, "i"),
    new RegExp(`<meta\\s+property=["']${name}["']\\s+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']${name}["']`, "i"),
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1].trim()
  }

  return undefined
}

function extractMainContent(html: string, url: string): MyctNode[] {
  const nodes: MyctNode[] = []

  // Remove script, style, nav, footer, and other non-content tags
  const cleanHtml = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")

  const imageMatches = cleanHtml.matchAll(/<img[^>]+>/gi)
  for (const match of imageMatches) {
    const imgTag = match[0]
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/i)
    const altMatch = imgTag.match(/alt=["']([^"']+)["']/i)
    const widthMatch = imgTag.match(/width=["']?(\d+)["']?/i)
    const heightMatch = imgTag.match(/height=["']?(\d+)["']?/i)

    if (srcMatch) {
      let src = srcMatch[1]

      // Convert relative URLs to absolute
      try {
        if (src.startsWith("//")) {
          const urlObj = new URL(url)
          src = `${urlObj.protocol}${src}`
        } else if (src.startsWith("/")) {
          const urlObj = new URL(url)
          src = `${urlObj.protocol}//${urlObj.host}${src}`
        } else if (!src.startsWith("http") && !src.startsWith("data:")) {
          src = new URL(src, url).href
        }

        nodes.push({
          type: "image",
          src,
          alt: altMatch ? cleanText(altMatch[1]) : undefined,
          width: widthMatch ? Number.parseInt(widthMatch[1]) : undefined,
          height: heightMatch ? Number.parseInt(heightMatch[1]) : undefined,
          role: "image",
        })
      } catch (error) {
        // Skip invalid image URLs
        continue
      }
    }
  }

  const videoMatches = cleanHtml.matchAll(/<video[^>]*>([\s\S]*?)<\/video>/gi)
  for (const match of videoMatches) {
    const videoTag = match[0]
    const posterMatch = videoTag.match(/poster=["']([^"']+)["']/i)
    const sourceMatch = match[1].match(/<source[^>]+src=["']([^"']+)["']/i)

    let src = sourceMatch ? sourceMatch[1] : undefined

    if (src) {
      try {
        if (src.startsWith("/")) {
          const urlObj = new URL(url)
          src = `${urlObj.protocol}//${urlObj.host}${src}`
        } else if (!src.startsWith("http")) {
          src = new URL(src, url).href
        }

        nodes.push({
          type: "video",
          src,
          poster: posterMatch ? posterMatch[1] : undefined,
          role: "video",
        })
      } catch (error) {
        continue
      }
    }
  }

  const iframeMatches = cleanHtml.matchAll(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi)
  for (const match of iframeMatches) {
    const src = match[1]
    if (src.includes("youtube.com") || src.includes("youtu.be") || src.includes("vimeo.com")) {
      nodes.push({
        type: "video",
        src,
        role: "embedded-video",
      })
    }
  }

  const headingMatches = cleanHtml.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)
  for (const match of headingMatches) {
    const level = Number.parseInt(match[1])
    const text = cleanText(stripTags(match[2]))
    if (text.length > 0) {
      nodes.push(createTextNode(text, `heading-${level}`))
    }
  }

  const paragraphMatches = cleanHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)
  for (const match of paragraphMatches) {
    const text = cleanText(stripTags(match[1]))
    if (text.length > 10) {
      nodes.push(createTextNode(text, "paragraph"))
    }
  }

  const ulMatches = cleanHtml.matchAll(/<ul[^>]*>([\s\S]*?)<\/ul>/gi)
  for (const ulMatch of ulMatches) {
    const listItems: MyctNode[] = []
    const liMatches = ulMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)
    for (const liMatch of liMatches) {
      const text = cleanText(stripTags(liMatch[1]))
      if (text.length > 0) {
        listItems.push(createTextNode(text, "list-item"))
      }
    }
    if (listItems.length > 0) {
      nodes.push(createStackNode(listItems, "list"))
    }
  }

  const olMatches = cleanHtml.matchAll(/<ol[^>]*>([\s\S]*?)<\/ol>/gi)
  for (const olMatch of olMatches) {
    const listItems: MyctNode[] = []
    const liMatches = olMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)
    for (const liMatch of liMatches) {
      const text = cleanText(stripTags(liMatch[1]))
      if (text.length > 0) {
        listItems.push(createTextNode(text, "list-item"))
      }
    }
    if (listItems.length > 0) {
      nodes.push(createStackNode(listItems, "ordered-list"))
    }
  }

  const blockquoteMatches = cleanHtml.matchAll(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi)
  for (const match of blockquoteMatches) {
    const text = cleanText(stripTags(match[1]))
    if (text.length > 0) {
      nodes.push(createTextNode(text, "quote"))
    }
  }

  if (nodes.length < 5) {
    const contentMatches = cleanHtml.matchAll(/<(?:div|section|article)[^>]*>([\s\S]*?)<\/(?:div|section|article)>/gi)
    for (const match of contentMatches) {
      const text = cleanText(stripTags(match[1]))
      // Only include substantial text blocks
      if (text.length > 50 && !text.match(/^(edit|share|save|report|delete)/i)) {
        nodes.push(createTextNode(text, "text"))
      }
    }
  }

  console.log("[v0] Extracted content nodes:", nodes.length)

  return nodes
}

function extractLinks(html: string, baseUrl: string): Array<{ text: string; url: string }> {
  const links: Array<{ text: string; url: string }> = []
  const linkMatches = html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)

  for (const match of linkMatches) {
    const url = match[1]
    const text = cleanText(stripTags(match[2]))

    // Skip empty links, anchors, and javascript
    if (!url || url.startsWith("#") || url.startsWith("javascript:") || text.length === 0) {
      continue
    }

    try {
      let absoluteUrl = url

      // Handle protocol-relative URLs (//example.com)
      if (url.startsWith("//")) {
        const urlObj = new URL(baseUrl)
        absoluteUrl = `${urlObj.protocol}${url}`
      }
      // Handle absolute paths (/wiki/Something)
      else if (url.startsWith("/")) {
        const urlObj = new URL(baseUrl)
        absoluteUrl = `${urlObj.protocol}//${urlObj.host}${url}`
      }
      // Handle relative paths (../something or something.html)
      else if (!url.startsWith("http")) {
        absoluteUrl = new URL(url, baseUrl).href
      }
      // Already absolute URL
      else {
        absoluteUrl = url
      }

      links.push({ text, url: absoluteUrl })
    } catch (error) {
      // Skip invalid URLs silently
      continue
    }
  }

  return links.slice(0, 100) // Increased limit to 100 links
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ")
}

function cleanText(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "...")
    .replace(/\s+/g, " ")
    .replace(/\n+/g, " ")
    .trim()
}
