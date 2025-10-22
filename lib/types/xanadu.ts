// Bidirectional link types
export interface Backlink {
  sourceUrl: string
  sourceTitle: string
  context: string // surrounding text
  timestamp: number
}

export interface BacklinkIndex {
  [targetUrl: string]: Backlink[]
}

// Transclusion types
export interface Transclusion {
  id: string
  sourceUrl: string
  sourcePath: string // path to specific content in source document
  content: string
  timestamp: number
  live: boolean // whether to update when source changes
}

export interface TransclusionReference {
  transclusionId: string
  position: number // position in current document
}

// Version control types
export interface DocumentVersion {
  id: string
  url: string
  content: string
  timestamp: number
  author?: string
  changes?: string // description of changes
  parentVersion?: string // previous version ID
}

export interface VersionHistory {
  [url: string]: DocumentVersion[]
}

// Deep linking types
export interface DeepLink {
  url: string
  path: string // XPath or CSS selector to specific content
  offset?: number // character offset within element
  length?: number // length of selection
}

// Parallel document comparison
export interface DocumentComparison {
  leftDoc: {
    url: string
    version?: string
  }
  rightDoc: {
    url: string
    version?: string
  }
  differences: Difference[]
}

export interface Difference {
  type: "added" | "removed" | "modified"
  path: string
  leftContent?: string
  rightContent?: string
}

// Knowledge graph types
export interface ConceptNode {
  id: string
  label: string
  type: "concept" | "entity" | "topic"
  urls: string[] // pages that mention this concept
  relatedConcepts: string[] // IDs of related concepts
}

export interface KnowledgeGraph {
  concepts: Map<string, ConceptNode>
  edges: Array<{
    from: string
    to: string
    type: "related" | "parent" | "child" | "synonym"
    weight: number
  }>
}

// Peer-to-peer types
export interface PeerConnection {
  peerId: string
  status: "connecting" | "connected" | "disconnected"
  latency: number
  sharedPages: string[]
}

export interface P2PNetwork {
  peers: Map<string, PeerConnection>
  localCache: Map<string, any>
}
