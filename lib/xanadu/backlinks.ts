import type { Backlink, BacklinkIndex } from "@/lib/types/xanadu"

const BACKLINK_STORAGE_KEY = "nexus-backlinks"

export class BacklinkTracker {
  private index: BacklinkIndex = {}

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem(BACKLINK_STORAGE_KEY)
    if (stored) {
      try {
        this.index = JSON.parse(stored)
      } catch (e) {
        console.error("Failed to load backlinks", e)
      }
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return
    localStorage.setItem(BACKLINK_STORAGE_KEY, JSON.stringify(this.index))
  }

  // Record a link from sourceUrl to targetUrl
  addLink(sourceUrl: string, sourceTitle: string, targetUrl: string, context: string) {
    if (!this.index[targetUrl]) {
      this.index[targetUrl] = []
    }

    // Check if this backlink already exists
    const existing = this.index[targetUrl].find((bl) => bl.sourceUrl === sourceUrl)
    if (existing) {
      // Update existing backlink
      existing.context = context
      existing.timestamp = Date.now()
    } else {
      // Add new backlink
      this.index[targetUrl].push({
        sourceUrl,
        sourceTitle,
        context,
        timestamp: Date.now(),
      })
    }

    this.saveToStorage()
  }

  // Get all pages that link to targetUrl
  getBacklinks(targetUrl: string): Backlink[] {
    return this.index[targetUrl] || []
  }

  // Get backlink count for a URL
  getBacklinkCount(targetUrl: string): number {
    return this.getBacklinks(targetUrl).length
  }

  // Remove a backlink
  removeBacklink(targetUrl: string, sourceUrl: string) {
    if (!this.index[targetUrl]) return
    this.index[targetUrl] = this.index[targetUrl].filter((bl) => bl.sourceUrl !== sourceUrl)
    this.saveToStorage()
  }

  // Clear all backlinks
  clear() {
    this.index = {}
    this.saveToStorage()
  }
}

// Singleton instance
export const backlinkTracker = new BacklinkTracker()
