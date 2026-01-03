import Link from 'next/link'
import { getAllLettersChronological } from '@/lib/content'

export const metadata = {
  title: 'Map | The Donahue Letters',
  description: 'Explore the geographic journey of the 985th Field Artillery Battalion through Italy.',
}

// Known places from the letters with coordinates
const places = [
  { id: 'naples', name: 'Naples', lat: 40.8518, lng: 14.2681, country: 'Italy', mentions: 5 },
  { id: 'rome', name: 'Rome', lat: 41.9028, lng: 12.4964, country: 'Italy', mentions: 8 },
  { id: 'cassino', name: 'Cassino', lat: 41.4867, lng: 13.8308, country: 'Italy', mentions: 3 },
  { id: 'venice', name: 'Venice', lat: 45.4408, lng: 12.3155, country: 'Italy', mentions: 1 },
  { id: 'north-africa', name: 'North Africa', lat: 36.8065, lng: 10.1815, country: 'Tunisia', mentions: 2 },
  { id: 'janesville', name: 'Janesville', lat: 42.6828, lng: -89.0187, country: 'USA', mentions: 1 },
  { id: 'milwaukee', name: 'Milwaukee', lat: 43.0389, lng: -87.9065, country: 'USA', mentions: 3 },
]

// Route of the 985th Field Artillery Battalion
const battalionRoute = [
  { name: 'Training in USA', date: 'Early 1943' },
  { name: 'North Africa', date: 'August 1943' },
  { name: 'Salerno Landing', date: 'September 1943' },
  { name: 'Naples Area', date: 'October 1943' },
  { name: 'Cassino Front', date: 'Winter 1943-44' },
  { name: 'Rome Liberation', date: 'June 1944' },
  { name: 'Northern Italy', date: 'Late 1944-1945' },
  { name: 'Post-War Italy', date: 'May-August 1945' },
]

export default function MapPage() {
  const letters = getAllLettersChronological()

  // Count letters by location
  const locationCounts: Record<string, number> = {}
  letters.forEach((letter) => {
    if (letter.location) {
      const loc = letter.location.toLowerCase()
      locationCounts[loc] = (locationCounts[loc] || 0) + 1
    }
  })

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl text-olive-900 mb-4">Map</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Follow the geographic journey of Major John James Donahue and the 985th Field Artillery Battalion
          through the Mediterranean and Italian Campaign.
        </p>
      </header>

      {/* Map placeholder */}
      <div className="paper p-8 mb-8">
        <div className="bg-sepia-100 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-600 mb-2">Interactive map coming soon</p>
            <p className="text-sm text-gray-500">
              An interactive map will show the battalion's journey through Italy
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Places mentioned */}
        <section className="paper p-6">
          <h2 className="font-display text-2xl text-olive-800 mb-4">Places Mentioned</h2>
          <div className="space-y-3">
            {places.map((place) => (
              <div
                key={place.id}
                className="flex items-center justify-between p-3 bg-sepia-50 rounded hover:bg-sepia-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-800">{place.name}</p>
                  <p className="text-sm text-gray-500">{place.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-olive-600">{place.mentions} mentions</p>
                  <p className="text-xs text-gray-400">
                    {place.lat.toFixed(2)}°N, {Math.abs(place.lng).toFixed(2)}°{place.lng >= 0 ? 'E' : 'W'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Battalion route */}
        <section className="paper p-6">
          <h2 className="font-display text-2xl text-olive-800 mb-4">985th Battalion Route</h2>
          <p className="text-sm text-gray-600 mb-4">
            The 985th Field Artillery Battalion's journey through the war.
          </p>
          <div className="space-y-0">
            {battalionRoute.map((stop, index) => (
              <div key={stop.name} className="flex gap-4">
                {/* Route line */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-olive-500 border-2 border-olive-600" />
                  {index < battalionRoute.length - 1 && (
                    <div className="w-0.5 bg-olive-300 flex-1 min-h-8" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-4">
                  <p className="font-medium text-gray-800">{stop.name}</p>
                  <p className="text-sm text-gray-500">{stop.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Letters by location */}
      <section className="mt-8">
        <h2 className="font-display text-2xl text-olive-800 mb-4">Letters by Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(locationCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([location, count]) => (
              <Link
                key={location}
                href={`/archive?location=${location}`}
                className="paper p-4 hover:shadow-lg transition-shadow"
              >
                <p className="font-medium text-gray-800 capitalize">
                  {location.replace(/-/g, ' ')}
                </p>
                <p className="text-sm text-olive-600">{count} letters</p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
