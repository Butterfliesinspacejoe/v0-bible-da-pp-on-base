"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, ChevronLeft, ChevronRight, Share2, Heart } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface BibleVerseCardProps {
  reference: string
  text: string
  translation?: string
  onNavigateNext?: () => void
  onNavigatePrevious?: () => void
}

export function BibleVerseCard({
  reference,
  text,
  translation = "WEB",
  onNavigateNext,
  onNavigatePrevious,
}: BibleVerseCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const { toast } = useToast()

  const handleShare = async () => {
    const shareText = `"${text}"\n\n- ${reference} (${translation})`

    if (navigator.share) {
      try {
        await navigator.share({
          title: reference,
          text: shareText,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText)
      toast({
        title: "Copied to clipboard",
        description: "Verse has been copied to your clipboard",
      })
    }
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited ? "Verse removed from your favorites" : "Verse saved to your favorites",
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif text-balance">{reference}</CardTitle>
          </div>
          <Badge variant="secondary">{translation}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg leading-relaxed text-foreground/90 font-serif text-pretty">{text}</p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleFavorite} className="gap-2 bg-transparent">
              <Heart className={`h-4 w-4 ${isFavorited ? "fill-current text-red-500" : ""}`} />
              {isFavorited ? "Favorited" : "Favorite"}
            </Button>
          </div>

          <div className="flex gap-2">
            {onNavigatePrevious && (
              <Button variant="outline" size="sm" onClick={onNavigatePrevious} className="gap-2 bg-transparent">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
            {onNavigateNext && (
              <Button variant="outline" size="sm" onClick={onNavigateNext} className="gap-2 bg-transparent">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
