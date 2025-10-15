// URL Translator - Converts URLs to MYCT format
import { type MyctDocument, type MyctNode, createStackNode, createTextNode } from "@/lib/types/myct"
import { parseHTML } from "./html-parser"

export interface TranslatorResult {
  myct: MyctDocument | null
  error?: string
}

export async function translateUrl(url: string): Promise<TranslatorResult> {
  try {
    console.log("[v0] Translating URL:", url)

    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    console.log("[v0] Normalized URL:", normalizedUrl)

    // Fetch the actual page content
    const response = await fetch("/api/fetch-page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: normalizedUrl }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        myct: null,
        error: errorData.error || "Failed to fetch page",
      }
    }

    const { html, contentType, url: finalUrl } = await response.json()

    console.log("[v0] Received HTML, content type:", contentType)

    // Parse HTML to extract semantic content
    const parsed = parseHTML(html, finalUrl)

    console.log("[v0] Parsed content:", {
      title: parsed.title,
      contentNodes: parsed.content.length,
      links: parsed.links.length,
    })

    // Build MYCT document
    const children: MyctNode[] = []

    // Add title
    if (parsed.title) {
      children.push(createTextNode(parsed.title, "page-title"))
    }

    // Add description
    if (parsed.description) {
      children.push(createTextNode(parsed.description, "page-description"))
    }

    // Add author
    if (parsed.author) {
      children.push(createTextNode(`By ${parsed.author}`, "page-author"))
    }

    // Add main content
    children.push(...parsed.content)

    if (parsed.links.length > 0) {
      const linkNodes = parsed.links.slice(0, 50).map((link) => ({
        type: "link" as const,
        content: link.text,
        url: link.url,
        role: "document-link",
      }))

      children.push(
        createStackNode([createTextNode("Links on this page", "section-title"), ...linkNodes], "links-section"),
      )
    }

    return {
      myct: {
        root: createStackNode(children, "page"),
        metadata: {
          source: finalUrl,
          timestamp: new Date().toISOString(),
          title: parsed.title,
          description: parsed.description,
        },
      },
    }
  } catch (error) {
    console.error("[v0] Translation error:", error)
    return {
      myct: null,
      error: error instanceof Error ? error.message : "Translation failed",
    }
  }
}

export async function fetchHyperedgeContent(nodeId: string, path: string): Promise<MyctNode[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  return [
    createStackNode(
      [createTextNode("Dynamic content loading", "info"), createTextNode("This feature is being implemented", "text")],
      "placeholder",
    ),
  ]
}
