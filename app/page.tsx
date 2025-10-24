"use client"

import { useState } from "react"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { BibleVerseCard } from "@/components/bible-verse-card"
import { VerseSearch } from "@/components/verse-search"
import { QuickVerses } from "@/components/quick-verses"
import { Button } from "@/components/ui/button"
import { Shuffle, BookOpen } from "lucide-react"
import { useAccount } from "wagmi"

interface BibleVerse {
  reference: string
  text: string
  translation: string
  book?: string
  chapter?: number
  verse?: number
}

export default function Home() {
  const { isConnected } = useAccount()
  const [verse, setVerse] = useState<BibleVerse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parseReference = (reference: string) => {
    const match = reference.match(/^(.+?)\s+(\d+):(\d+)/)
    if (match) {
      return {
        book: match[1],
        chapter: Number.parseInt(match[2]),
        verse: Number.parseInt(match[3]),
      }
    }
    return null
  }

  const fetchVerse = async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error("Verse not found")
      }
      const data = await response.json()
      const parsed = parseReference(data.reference)
      setVerse({
        reference: data.reference,
        text: data.text.trim(),
        translation: data.translation_name || "WEB",
        book: parsed?.book,
        chapter: parsed?.chapter,
        verse: parsed?.verse,
      })
    } catch (err) {
      setError("Could not find that verse. Please try another reference.")
      setVerse(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRandomVerse = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("https://bible-api.com/data/web/random")
      if (!response.ok) {
        throw new Error("Could not fetch random verse")
      }
      const data = await response.json()
      setVerse({
        reference: data.reference,
        text: data.text.trim(),
        translation: "WEB",
      })
    } catch (err) {
      setError("Could not fetch a random verse. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigateNext = async () => {
    if (!verse || !verse.book || !verse.chapter || !verse.verse) return

    const nextVerse = verse.verse + 1
    const nextQuery = `${verse.book} ${verse.chapter}:${nextVerse}`

    try {
      await fetchVerse(nextQuery)
    } catch (err) {
      const nextChapterQuery = `${verse.book} ${verse.chapter + 1}:1`
      await fetchVerse(nextChapterQuery)
    }
  }

  const handleNavigatePrevious = async () => {
    if (!verse || !verse.book || !verse.chapter || !verse.verse) return

    if (verse.verse > 1) {
      const prevVerse = verse.verse - 1
      const prevQuery = `${verse.book} ${verse.chapter}:${prevVerse}`
      await fetchVerse(prevQuery)
    } else if (verse.chapter > 1) {
      const prevChapterQuery = `${verse.book} ${verse.chapter - 1}:50`
      await fetchVerse(prevChapterQuery)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Bible DApp</h1>
              <p className="text-xs text-muted-foreground">On Base Blockchain</p>
            </div>
          </div>
          <WalletConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight">Discover the Word of God</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Search and explore Bible verses on the Base blockchain. Connect your wallet to get started.
          </p>
          {!isConnected && (
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm text-accent-foreground">Connect your wallet to unlock the full experience</p>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="space-y-6">
          <VerseSearch onSearch={fetchVerse} isLoading={isLoading} />

          <div className="flex justify-center">
            <Button onClick={fetchRandomVerse} variant="outline" disabled={isLoading} className="gap-2 bg-transparent">
              <Shuffle className="h-4 w-4" />
              Random Verse
            </Button>
          </div>
        </div>

        {/* Quick Access */}
        <QuickVerses onSelectVerse={fetchVerse} />

        {/* Verse Display */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="max-w-3xl mx-auto p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-center">{error}</p>
          </div>
        )}

        {verse && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BibleVerseCard
              reference={verse.reference}
              text={verse.text}
              translation={verse.translation}
              onNavigateNext={handleNavigateNext}
              onNavigatePrevious={handleNavigatePrevious}
            />
          </div>
        )}

        {/* Info Section */}
        {!verse && !isLoading && !error && (
          <div className="max-w-3xl mx-auto space-y-6 text-center py-12">
            <div className="p-8 bg-card border border-border rounded-xl space-y-4">
              <BookOpen className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Start Your Journey</h3>
              <p className="text-muted-foreground text-pretty">
                Search for any Bible verse or click on a popular verse to begin exploring the scriptures.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built on Base Blockchain • Powered by Bible API</p>
        </div>
      </footer>
    </div>
  )
}
