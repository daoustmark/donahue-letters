import Link from 'next/link'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { getAllLettersChronological, formatShortDate } from '@/lib/content'

interface Place {
  id: string
  name: string
  coordinates: { lat: number; lng: number }
  type: string
  country: string
  description: string
  significance: string
  aliases?: string[]
}

function getPlaces(): Place[] {
  const placesPath = path.join(process.cwd(), 'content', 'places.json')
  const placesData = JSON.parse(fs.readFileSync(placesPath, 'utf8'))
  return placesData.places
}

function getPlaceBySlug(slug: string): Place | null {
  const places = getPlaces()
  return places.find((p) => p.id === slug || p.aliases?.includes(slug)) || null
}

function getPersonName(slug: string): string {
  const names: Record<string, string> = {
    'john-donahue': 'John',
    'marie-donahue': 'Marie',
    'patsy-donahue': 'Patsy',
    'mother-donahue': 'Mother',
    'lutie': 'Lutie',
  }
  return names[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export function generateStaticParams() {
  const places = getPlaces()
  return places.map((place) => ({ slug: place.id }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const place = getPlaceBySlug(params.slug)
  if (!place) {
    return { title: 'Place Not Found | The Donahue Letters' }
  }
  return {
    title: `${place.name} | Places | The Donahue Letters`,
    description: place.description,
  }
}

export default function PlacePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const place = getPlaceBySlug(slug)

  if (!place) {
    notFound()
  }

  const letters = getAllLettersChronological()

  // Get letters from this location
  const lettersFromHere = letters.filter((l) => {
    const loc = l.location?.toLowerCase()
    return loc === place.id || place.aliases?.includes(loc || '')
  })

  // Get letters mentioning this place
  const lettersMentioning = letters.filter((l) => {
    if (lettersFromHere.some((lf) => lf.slug === l.slug)) return false
    return l.places_mentioned?.some(
      (p) => p.toLowerCase() === place.id || place.aliases?.includes(p.toLowerCase())
    )
  })

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/wiki" className="hover:text-olive-600">
            Wiki
          </Link>
          <span className="mx-2">→</span>
          <Link href="/wiki/places" className="hover:text-olive-600">
            Places
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-700">{place.name}</span>
        </nav>
        <h1 className="font-display text-4xl text-olive-900 mb-2">{place.name}</h1>
        <p className="text-olive-600 mb-4">
          {place.type === 'city' && 'City'} • {place.country}
        </p>
        <p className="text-gray-600 text-lg">{place.description}</p>
        {place.significance && (
          <p className="text-olive-700 mt-4 p-4 bg-olive-50 rounded italic">
            {place.significance}
          </p>
        )}
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="paper p-4 text-center">
          <p className="font-display text-2xl text-olive-700">{lettersFromHere.length}</p>
          <p className="text-sm text-gray-500">Letters Written Here</p>
        </div>
        <div className="paper p-4 text-center">
          <p className="font-display text-2xl text-olive-700">{lettersMentioning.length}</p>
          <p className="text-sm text-gray-500">Letters Mentioning</p>
        </div>
      </div>

      {/* Map link */}
      <div className="paper p-4 mb-8 text-center">
        <Link href={`/map?location=${place.id}`} className="text-olive-600 hover:underline">
          View {place.name} on the interactive map →
        </Link>
      </div>

      {/* Letters from this location */}
      {lettersFromHere.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-xl text-olive-800 mb-4">
            Letters Written from {place.name}
          </h2>
          <div className="space-y-3">
            {lettersFromHere.map((letter) => (
              <Link
                key={letter.slug}
                href={`/letters/${letter.slug}`}
                className="block paper p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-olive-800">
                      {getPersonName(letter.from)} → {letter.to.map(getPersonName).join(' & ')}
                    </p>
                    {letter.subject && (
                      <p className="text-sm text-olive-600 italic">{letter.subject}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{letter.excerpt}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatShortDate(letter.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Letters mentioning this place */}
      {lettersMentioning.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-olive-800 mb-4">
            Letters Mentioning {place.name}
          </h2>
          <div className="space-y-3">
            {lettersMentioning.map((letter) => (
              <Link
                key={letter.slug}
                href={`/letters/${letter.slug}`}
                className="block paper p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-olive-800">
                      {getPersonName(letter.from)} → {letter.to.map(getPersonName).join(' & ')}
                    </p>
                    {letter.subject && (
                      <p className="text-sm text-olive-600 italic">{letter.subject}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatShortDate(letter.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {lettersFromHere.length === 0 && lettersMentioning.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No letters are currently associated with this location.
        </p>
      )}
    </div>
  )
}
