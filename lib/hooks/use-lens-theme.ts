"use client"

import { useEffect } from "react"
import type { LensDocument } from "@/lib/types/lens"

export function useLensTheme(lens: LensDocument) {
  useEffect(() => {
    const lensSlug = lens.name.toLowerCase().replace(/\s+/g, "-")
    document.body.setAttribute("data-lens", lensSlug)

    // Apply global colors to CSS variables if needed
    if (lens.globals.colors) {
      const root = document.documentElement
      Object.entries(lens.globals.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
      })
    }

    return () => {
      document.body.removeAttribute("data-lens")
    }
  }, [lens])
}
