'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface LetterSummary {
  id: string
  slug: string
  date: string
  from: string
  to: string[]
  location?: string
  subject?: string
  excerpt: string
  themes: string[]
  document_type?: string
}

interface ArchiveClientProps {
  letters: LetterSummary[]
  allThemes: string[]
  allYears: number[]
}

// Helper to get person display name
function getPersonName(slug: string): string {
  const names: Record<string, string> = {
    'john-donahue': 'John Donahue',
    'marie-donahue': 'Marie Donahue',
    'patsy-donahue': 'Patsy Donahue',
    'mother-donahue': 'Mother Donahue',
    'lutie': 'Lutie',
    'marquette-university': 'Marquette University',
    'santa-susanna-church': "Santa Susanna Church",
    'us-army': 'U.S. Army',
    'pittsburgh-press': 'Pittsburgh Press',
    'unknown': 'Unknown',
  }
  return names[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function formatTheme(theme: string): string {
  return theme.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function LetterCard({ letter, viewMode }: { letter: LetterSummary; viewMode: 'grid' | 'list' }) {
  const documentType = letter.document_type || 'letter'
  const typeLabel = {
    'letter': '',
    'telegram': 'Telegram',
    'notice': 'Notice',
    'general-order': 'General Order',
    'newspaper-article': 'Article',
    'condolence': 'Condolence',
  }[documentType] || ''

  if (viewMode === 'list') {
    return (
      <Link
        href={`/letters/${letter.slug}`}
        className="paper block p-4 hover:shadow-lg transition-shadow"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <p className="text-sm text-olive-600 md:w-28 shrink-0">
            {formatShortDate(letter.date)}
          </p>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800 truncate">
                {getPersonName(letter.from)} to {letter.to.map(getPersonName).join(' & ')}
              </p>
              {typeLabel && (
                <span className="text-xs bg-sepia-200 text-olive-700 px-2 py-0.5 rounded shrink-0">
                  {typeLabel}
                </span>
              )}
            </div>
            {letter.subject && (
              <p className="text-sm text-olive-600 italic truncate">{letter.subject}</p>
            )}
          </div>
          <div className="hidden md:flex gap-1 shrink-0">
            {letter.themes.slice(0, 2).map((theme) => (
              <span key={theme} className="text-xs text-olive-600 bg-sepia-100 px-2 py-0.5 rounded">
                {formatTheme(theme)}
              </span>
            ))}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/letters/${letter.slug}`}
      className="paper block p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-olive-600">{formatShortDate(letter.date)}</p>
        {typeLabel && (
          <span className="text-xs bg-sepia-200 text-olive-700 px-2 py-1 rounded">
            {typeLabel}
          </span>
        )}
      </div>
      <p className="font-medium text-gray-800 mb-1">
        {getPersonName(letter.from)} to {letter.to.map(getPersonName).join(' & ')}
      </p>
      {letter.subject && (
        <p className="text-sm text-olive-600 italic mb-2">{letter.subject}</p>
      )}
      <p className="text-gray-600 text-sm line-clamp-3">{letter.excerpt}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {letter.themes.slice(0, 3).map((theme) => (
          <span key={theme} className="text-xs text-olive-600 bg-sepia-100 px-2 py-0.5 rounded">
            {formatTheme(theme)}
          </span>
        ))}
        {letter.themes.length > 3 && (
          <span className="text-xs text-gray-400">+{letter.themes.length - 3}</span>
        )}
      </div>
    </Link>
  )
}

export default function ArchiveClient({ letters, allThemes, allYears }: ArchiveClientProps) {
  const searchParams = useSearchParams()
  const initialTheme = searchParams.get('theme') || ''

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(initialTheme)
  const [selectedYear, setSelectedYear] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredLetters = useMemo(() => {
    return letters.filter((letter) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          letter.excerpt.toLowerCase().includes(query) ||
          letter.subject?.toLowerCase().includes(query) ||
          getPersonName(letter.from).toLowerCase().includes(query) ||
          letter.to.some((p) => getPersonName(p).toLowerCase().includes(query)) ||
          letter.themes.some((t) => t.toLowerCase().includes(query))

        if (!matchesSearch) return false
      }

      // Theme filter
      if (selectedTheme && !letter.themes.includes(selectedTheme)) {
        return false
      }

      // Year filter
      if (selectedYear) {
        const letterYear = new Date(letter.date).getFullYear().toString()
        if (letterYear !== selectedYear) return false
      }

      return true
    })
  }, [letters, searchQuery, selectedTheme, selectedYear])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTheme('')
    setSelectedYear('')
  }

  const hasFilters = searchQuery || selectedTheme || selectedYear

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="font-display text-4xl text-olive-900 mb-4">Letter Archive</h1>
        <p className="text-gray-600">
          Browse and search all {letters.length} letters and documents from the collection.
        </p>
      </header>

      {/* Search and Filters */}
      <div className="paper p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm text-gray-500 mb-1">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search letters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-sepia-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
            />
          </div>

          {/* Theme filter */}
          <div>
            <label htmlFor="theme" className="block text-sm text-gray-500 mb-1">
              Theme
            </label>
            <select
              id="theme"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full px-4 py-2 border border-sepia-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
            >
              <option value="">All Themes</option>
              {allThemes.map((theme) => (
                <option key={theme} value={theme}>
                  {formatTheme(theme)}
                </option>
              ))}
            </select>
          </div>

          {/* Year filter */}
          <div>
            <label htmlFor="year" className="block text-sm text-gray-500 mb-1">
              Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-sepia-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
            >
              <option value="">All Years</option>
              {allYears.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters and results count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-sepia-200">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {filteredLetters.length} of {letters.length} documents
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-olive-600 hover:text-olive-800 underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'grid'
                  ? 'bg-olive-600 text-white'
                  : 'bg-sepia-100 text-gray-600 hover:bg-sepia-200'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'list'
                  ? 'bg-olive-600 text-white'
                  : 'bg-sepia-100 text-gray-600 hover:bg-sepia-200'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredLetters.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-3'
          }
        >
          {filteredLetters.map((letter) => (
            <LetterCard key={letter.id} letter={letter} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 paper">
          <p className="text-gray-600 mb-4">No letters match your search criteria.</p>
          <button onClick={clearFilters} className="btn-primary">
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
