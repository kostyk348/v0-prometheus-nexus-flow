import type { DocumentVersion, VersionHistory } from "@/lib/types/xanadu"

const VERSION_STORAGE_KEY = "nexus-versions"

export class VersionControl {
  private history: VersionHistory = {}

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem(VERSION_STORAGE_KEY)
    if (stored) {
      try {
        this.history = JSON.parse(stored)
      } catch (e) {
        console.error("Failed to load version history", e)
      }
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return
    localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(this.history))
  }

  // Save a new version of a document
  saveVersion(url: string, content: string, author?: string, changes?: string): string {
    if (!this.history[url]) {
      this.history[url] = []
    }

    const parentVersion = this.history[url].length > 0 ? this.history[url][this.history[url].length - 1].id : undefined

    const version: DocumentVersion = {
      id: `v${this.history[url].length + 1}-${Date.now()}`,
      url,
      content,
      timestamp: Date.now(),
      author,
      changes,
      parentVersion,
    }

    this.history[url].push(version)
    this.saveToStorage()
    return version.id
  }

  // Get all versions of a document
  getVersions(url: string): DocumentVersion[] {
    return this.history[url] || []
  }

  // Get a specific version
  getVersion(url: string, versionId: string): DocumentVersion | undefined {
    const versions = this.getVersions(url)
    return versions.find((v) => v.id === versionId)
  }

  // Get the latest version
  getLatestVersion(url: string): DocumentVersion | undefined {
    const versions = this.getVersions(url)
    return versions[versions.length - 1]
  }

  // Compare two versions
  compareVersions(url: string, version1Id: string, version2Id: string): { added: string[]; removed: string[] } {
    const v1 = this.getVersion(url, version1Id)
    const v2 = this.getVersion(url, version2Id)

    if (!v1 || !v2) {
      return { added: [], removed: [] }
    }

    const lines1 = v1.content.split("\n")
    const lines2 = v2.content.split("\n")

    const added = lines2.filter((line) => !lines1.includes(line))
    const removed = lines1.filter((line) => !lines2.includes(line))

    return { added, removed }
  }

  // Clear version history for a URL
  clearVersions(url: string) {
    delete this.history[url]
    this.saveToStorage()
  }

  // Clear all version history
  clear() {
    this.history = {}
    this.saveToStorage()
  }
}

// Singleton instance
export const versionControl = new VersionControl()
