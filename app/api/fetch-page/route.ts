import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    console.log("[v0] Fetching URL:", url)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    try {
      // Fetch the actual page with more comprehensive headers
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        signal: controller.signal,
        redirect: "follow",
      })

      clearTimeout(timeoutId)

      console.log("[v0] Response status:", response.status, response.statusText)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const statusCode = response.status
        const statusText = response.statusText

        // Try to get more error details from the response body
        let errorDetails = ""
        try {
          const text = await response.text()
          errorDetails = text.substring(0, 200) // First 200 chars of error page
        } catch {
          // Ignore if we can't read the body
        }

        console.error("[v0] Fetch failed:", { statusCode, statusText, errorDetails })

        // Provide user-friendly error messages based on status code
        let errorMessage = `Failed to fetch (${statusCode} ${statusText})`
        if (statusCode === 403) {
          errorMessage = "Access denied - the website is blocking automated requests"
        } else if (statusCode === 404) {
          errorMessage = "Page not found (404)"
        } else if (statusCode === 429) {
          errorMessage = "Too many requests - the website is rate limiting"
        } else if (statusCode === 503) {
          errorMessage = "Service unavailable - the website may be down"
        } else if (statusCode >= 500) {
          errorMessage = "Server error - the website is experiencing issues"
        }

        return NextResponse.json({ error: errorMessage, statusCode, statusText }, { status: 502 })
      }

      const html = await response.text()
      const contentType = response.headers.get("content-type") || ""

      console.log("[v0] Fetched content type:", contentType)
      console.log("[v0] HTML length:", html.length)

      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
        console.warn("[v0] Non-HTML content type:", contentType)
        return NextResponse.json(
          {
            error: `Unsupported content type: ${contentType}. Only HTML pages are supported.`,
          },
          { status: 415 },
        )
      }

      return NextResponse.json({
        html,
        contentType,
        url: response.url, // Final URL after redirects
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          console.error("[v0] Request timeout")
          return NextResponse.json({ error: "Request timeout - the website took too long to respond" }, { status: 504 })
        }

        console.error("[v0] Fetch error:", fetchError.message)
        return NextResponse.json(
          {
            error: `Network error: ${fetchError.message}`,
          },
          { status: 502 },
        )
      }

      throw fetchError
    }
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch page" },
      { status: 500 },
    )
  }
}
