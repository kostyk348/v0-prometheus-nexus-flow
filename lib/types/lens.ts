// Lens System Types (Adaptive Styling)
export interface LensGlobals {
  colors?: Record<string, string>
  spacing?: Record<string, number>
  typography?: {
    fontFamily?: string
    fontSize?: number
    lineHeight?: number
  }
  responsive?: {
    mobile?: {
      spacing?: number
      fontSize?: number
    }
    desktop?: {
      spacing?: number
      fontSize?: number
    }
  }
}

export interface LensTarget {
  type?: string
  role?: string
  state?: "normal" | "hover" | "active" | "expanded"
  device?: "mobile" | "desktop"
}

export interface LensStyles {
  backgroundColor?: string
  color?: string
  padding?: number
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  margin?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  borderRadius?: number
  fontSize?: number
  fontWeight?: number
  opacity?: number
  transform?: string
  transition?: string
  display?: string
  flexDirection?: "row" | "column"
  gap?: number
  border?: string
  boxShadow?: string
  borderLeft?: string
  borderBottom?: string
  fontFamily?: string
  fontStyle?: string
  lineHeight?: number
}

export interface LensRule {
  target: LensTarget
  styles: LensStyles
}

export interface LensDocument {
  name: string
  globals: LensGlobals
  rules: LensRule[]
}

// Lens matching helper
export function matchesTarget(
  target: LensTarget,
  node: { type: string; role?: string },
  state: string,
  isMobile: boolean,
): boolean {
  if (target.type && target.type !== node.type) return false
  if (target.role && target.role !== node.role) return false
  if (target.state && target.state !== state) return false
  if (target.device) {
    if (target.device === "mobile" && !isMobile) return false
    if (target.device === "desktop" && isMobile) return false
  }
  return true
}
