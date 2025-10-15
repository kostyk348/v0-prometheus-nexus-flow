// Core MYCT (Semantic Hypergraph) Types
export type MyctNodeType = "stack" | "text" | "image" | "hyperedge" | "video" | "link" | "audio"

export type HyperedgeTarget = [string, string] // [nodeId, path]

export interface MyctNode {
  type: MyctNodeType
  id?: string
  role?: string // 'post', 'reply', 'thread', etc.
  children?: MyctNode[]

  // Text node
  content?: string

  // Link node
  url?: string

  // Image/Video/Audio node
  src?: string
  alt?: string
  width?: number
  height?: number

  // Video specific
  poster?: string // thumbnail

  // Audio specific
  duration?: number

  // Hyperedge node
  targets?: HyperedgeTarget[]
  aggregator?: "concat" | "preview" | "expand"
  expanded?: boolean
}

export interface MyctDocument {
  root: MyctNode
  metadata?: {
    source?: string
    timestamp?: string
    author?: string
  }
}

// Validation helpers
export function isValidMyctNode(node: any): node is MyctNode {
  return node && typeof node.type === "string"
}

export function createTextNode(content: string, role?: string): MyctNode {
  return { type: "text", content, role }
}

export function createStackNode(children: MyctNode[], role?: string): MyctNode {
  return { type: "stack", children, role }
}

export function createHyperedgeNode(
  targets: HyperedgeTarget[],
  aggregator: "concat" | "preview" | "expand" = "concat",
  role?: string,
): MyctNode {
  return { type: "hyperedge", targets, aggregator, role, expanded: false }
}

// Function to create a link node
export function createLinkNode(url: string, role?: string): MyctNode {
  return { type: "link", url, role }
}

export function createImageNode(src: string, alt?: string, width?: number, height?: number, role?: string): MyctNode {
  return { type: "image", src, alt, width, height, role }
}

export function createVideoNode(src: string, poster?: string, alt?: string, role?: string): MyctNode {
  return { type: "video", src, poster, alt, role }
}

export function createAudioNode(src: string, alt?: string, duration?: number, role?: string): MyctNode {
  return { type: "audio", src, alt, duration, role }
}
