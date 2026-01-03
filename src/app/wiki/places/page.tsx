import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { getAllLettersChronological } from '@/lib/content'

export const metadata = {
  title: 'Places | Wiki | The Donahue Letters',
  description: 'Explore all geographic locations mentioned in the Donahue WWII letters collection.',
}

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

export default function PlacesPage() {
  const places = getPlaces()
  const letters = getAllLettersChronological()

  // Count letters per location
  const locationCounts: Record<string, number> = {}
  letters.forEach((letter) => {
    if (letter.location) {
      const loc = letter.location.toLowerCase()
      locationCounts[loc] = (locationCounts[loc] || 0) + 1
    }
  })

  // Group places by country
  const placesByCountry: Record<string, Place[]> = {}
  places.forEach((place) => {
    if (!placesByCountry[place.country]) {
      placesByCountry[place.country] = []
    }
    placesByCountry[place.country].push(place)
  })

  // Sort countries: Italy first, then USA, then others
  const sortedCountries = Object.keys(placesByCountry).sort((a, b) => {
    if (a === 'Italy') return -1
    if (b === 'Italy') return 1
    if (a === 'USA') return -1
    if (b === 'USA') return 1
    return a.localeCompare(b)
  })

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/wiki" className="hover:text-olive-600">
            Wiki
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-700">Places</span>
        </nav>
        <h1 className="font-display text-4xl text-olive-900 mb-4">Places</h1>
        <p className="text-gray-600">
          Geographic locations where letters were written or that are mentioned in the collection.
          <Link href="/map" className="text-olive-600 hover:underline ml-2">
            View on interactive map →
          </Link>
        </p>
      </header>

      {sortedCountries.map((country) => (
        <section key={country} className="mb-8">
          <h2 className="font-display text-2xl text-olive-800 mb-4">{country}</h2>
          <div className="grid gap-4">
            {placesByCountry[country]
              .sort((a, b) => {
                // Sort by letter count (descending)
                const countA = locationCounts[a.id] || 0
                const countB = locationCounts[b.id] || 0
                return countB - countA
              })
              .map((place) => {
                const letterCount = locationCounts[place.id] || 0
                return (
                  <Link
                    key={place.id}
                    href={`/wiki/places/${place.id}`}
                    className="block paper p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-display text-lg text-olive-800">{place.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{place.description}</p>
                        {place.significance && (
                          <p className="text-sm text-olive-600 mt-2 italic">{place.significance}</p>
                        )}
                      </div>
                      {letterCount > 0 && (
                        <span className="text-sm text-gray-500 whitespace-nowrap ml-4 bg-sepia-100 px-2 py-1 rounded">
                          {letterCount} letter{letterCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}
