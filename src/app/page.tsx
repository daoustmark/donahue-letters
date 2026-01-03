import Link from 'next/link'
import { getAllLettersChronological, getOnThisDayData, formatShortDate } from '@/lib/content'
import type { Letter } from '@/types/content'

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

function OnThisDay() {
  const { letters, date } = getOnThisDayData()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <section className="paper p-8 mb-12">
      <h2 className="font-display text-2xl text-olive-800 mb-4">
        On This Day: {monthNames[date.month - 1]} {date.day}
      </h2>

      {letters.length > 0 ? (
        <div className="space-y-4">
          {letters.map((letter) => (
            <Link
              key={letter.id}
              href={`/letters/${letter.slug}`}
              className="block hover:bg-sepia-200 rounded p-4 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-olive-600">
                    {new Date(letter.date).getFullYear()}
                  </p>
                  <p className="font-medium text-gray-800">
                    {getPersonName(letter.from)} to {letter.to.map(getPersonName).join(' & ')}
                  </p>
                  <p className="text-gray-600 mt-1">{letter.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">
          <p>No letters were written on this day.</p>
          <p className="mt-2 text-sm">
            Explore the <Link href="/archive" className="text-olive-600 hover:underline">archive</Link> to find letters from other dates.
          </p>
        </div>
      )}
    </section>
  )
}

function FeaturedLetter({ letter }: { letter: Letter }) {
  return (
    <section className="mb-12">
      <h2 className="font-display text-2xl text-olive-800 mb-4">Featured Letter</h2>
      <Link
        href={`/letters/${letter.slug}`}
        className="paper block p-8 hover:shadow-xl transition-shadow"
      >
        <div className="mb-4">
          <p className="text-sm text-olive-600">{formatShortDate(letter.date)}</p>
          <p className="text-lg font-medium text-gray-800">
            {getPersonName(letter.from)} to {letter.to.map(getPersonName).join(' & ')}
          </p>
          {letter.subject && (
            <p className="text-olive-700 italic">{letter.subject}</p>
          )}
        </div>
        <p className="font-serif text-gray-700 leading-relaxed">
          {letter.excerpt}
        </p>
        <p className="text-olive-600 mt-4 text-sm">Read more →</p>
      </Link>
    </section>
  )
}

function QuickLinks() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Link
        href="/timeline"
        className="paper p-6 text-center hover:shadow-xl transition-shadow"
      >
        <h3 className="font-display text-xl text-olive-800 mb-2">Timeline</h3>
        <p className="text-gray-600 text-sm">
          Explore letters alongside key events of the Italian Campaign
        </p>
      </Link>

      <Link
        href="/map"
        className="paper p-6 text-center hover:shadow-xl transition-shadow"
      >
        <h3 className="font-display text-xl text-olive-800 mb-2">Map</h3>
        <p className="text-gray-600 text-sm">
          Follow the journey of the 985th Field Artillery Battalion
        </p>
      </Link>

      <Link
        href="/archive"
        className="paper p-6 text-center hover:shadow-xl transition-shadow"
      >
        <h3 className="font-display text-xl text-olive-800 mb-2">Archive</h3>
        <p className="text-gray-600 text-sm">
          Browse and search all letters and documents
        </p>
      </Link>
    </section>
  )
}

function Introduction() {
  return (
    <section className="text-center mb-12 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl text-olive-900 mb-4">
        The Donahue Letters
      </h1>
      <p className="font-serif text-xl text-gray-700 leading-relaxed mb-6">
        A collection of World War II letters from Major John James Donahue
        to his wife Marie and daughter Patsy, written during his service
        with the 985th Field Artillery Battalion in Italy, 1943–1945.
      </p>
      <p className="text-gray-600">
        These letters offer an intimate window into the life of a soldier,
        husband, and father during one of history's most significant conflicts.
      </p>
    </section>
  )
}

function Statistics() {
  const letters = getAllLettersChronological()
  const years = [...new Set(letters.map(l => new Date(l.date).getFullYear()))]
  const themes = [...new Set(letters.flatMap(l => l.themes))]

  return (
    <section className="bg-olive-50 rounded-lg p-8 mb-12">
      <h2 className="font-display text-2xl text-olive-800 mb-6 text-center">
        The Collection
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <p className="text-3xl font-display text-olive-700">{letters.length}</p>
          <p className="text-sm text-gray-600">Letters & Documents</p>
        </div>
        <div>
          <p className="text-3xl font-display text-olive-700">{years.length}</p>
          <p className="text-sm text-gray-600">Years Covered</p>
        </div>
        <div>
          <p className="text-3xl font-display text-olive-700">{themes.length}</p>
          <p className="text-sm text-gray-600">Themes</p>
        </div>
        <div>
          <p className="text-3xl font-display text-olive-700">1943-45</p>
          <p className="text-sm text-gray-600">Time Period</p>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const letters = getAllLettersChronological()
  // Pick a random featured letter (could be made more sophisticated)
  const featuredIndex = Math.floor(letters.length / 2) // Middle letter as feature
  const featuredLetter = letters[featuredIndex]

  return (
    <div className="max-w-4xl mx-auto">
      <Introduction />
      <QuickLinks />
      <OnThisDay />
      {featuredLetter && <FeaturedLetter letter={featuredLetter} />}
      <Statistics />
    </div>
  )
}
