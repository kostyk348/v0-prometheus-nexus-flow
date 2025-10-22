import type { Transclusion } from "@/lib/types/xanadu"

const TRANSCLUSION_STORAGE_KEY = "nexus-transclusions"

export class TransclusionEngine {
  private transclusions: Map<string, Transclusion> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem(TRANSCLUSION_STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        this.transclusions = new Map(data)
      } catch (e) {
        console.error("Failed to load transclusions", e)
      }
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return
    const data = Array.from(this.transclusions.entries())
    localStorage.setItem(TRANSCLUSION_STORAGE_KEY, JSON.stringify(data))
  }

  // Create a new transclusion
  createTransclusion(sourceUrl: string, sourcePath: string, content: string, live = true): string {
    const id = `transclude-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const transclusion: Transclusion = {
      id,
      sourceUrl,
      sourcePath,
      content,
      timestamp: Date.now(),
      live,
    }
    this.transclusions.set(id, transclusion)
    this.saveToStorage()
    return id
  }

  // Get a transclusion by ID
  getTransclusion(id: string): Transclusion | undefined {
    return this.transclusions.get(id)
  }

  // Update transclusion content (when source changes)
  updateTransclusion(id: string, newContent: string) {
    const transclusion = this.transclusions.get(id)
    if (transclusion && transclusion.live) {
      transclusion.content = newContent
      transclusion.timestamp = Date.now()
      this.saveToStorage()
    }
  }

  // Get all transclusions from a specific source
  getTransclusionsFromSource(sourceUrl: string): Transclusion[] {
    return Array.from(this.transclusions.values()).filter((t) => t.sourceUrl === sourceUrl)
  }

  // Delete a transclusion
  deleteTransclusion(id: string) {
    this.transclusions.delete(id)
    this.saveToStorage()
  }

  // Clear all transclusions
  clear() {
    this.transclusions.clear()
    this.saveToStorage()
  }
}

// Singleton instance
export const transclusionEngine = new TransclusionEngine()
