"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface QuickVersesProps {
  onSelectVerse: (verse: string) => void
}

const popularVerses = ["John 3:16", "Psalm 23:1", "Proverbs 3:5-6", "Romans 8:28", "Philippians 4:13", "Isaiah 41:10"]

export function QuickVerses({ onSelectVerse }: QuickVersesProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-medium">Popular Verses</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {popularVerses.map((verse) => (
          <Button key={verse} variant="outline" size="sm" onClick={() => onSelectVerse(verse)} className="text-sm">
            {verse}
          </Button>
        ))}
      </div>
    </div>
  )
}
