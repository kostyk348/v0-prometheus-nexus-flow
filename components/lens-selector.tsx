"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette, Check } from "lucide-react"
import type { LensDocument } from "@/lib/types/lens"
import { darkMinimalLens, socialLightLens, xanaduLens } from "@/lib/schemas/default-lenses"

interface LensSelectorProps {
  selectedLens: LensDocument
  onLensChange: (lens: LensDocument) => void
}

const availableLenses = [darkMinimalLens, socialLightLens, xanaduLens]

export default function LensSelector({ selectedLens, onLensChange }: LensSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-border bg-surface hover:bg-surface-hover">
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">{selectedLens.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-surface border-border">
        {availableLenses.map((lens) => (
          <DropdownMenuItem
            key={lens.name}
            onClick={() => onLensChange(lens)}
            className="flex items-center justify-between cursor-pointer hover:bg-surface-hover"
          >
            <span>{lens.name}</span>
            {selectedLens.name === lens.name && <Check className="w-4 h-4 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
