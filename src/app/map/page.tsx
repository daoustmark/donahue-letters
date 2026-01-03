import Link from 'next/link'
import { getAllLettersChronological } from '@/lib/content'
import { getPlacesWithLetterCounts, getRouteWaypoints } from '@/lib/places'
import MapClient from './map-client'

export const metadata = {
  title: 'Map | The Donahue Letters',
  description: 'Explore the geographic journey of the 985th Field Artillery Battalion through Italy.',
}

export default function MapPage() {
  const letters = getAllLettersChronological()

  // Load map data from JSON files
  const placesWithCounts = getPlacesWithLetterCounts()
  const waypoints = getRouteWaypoints()

  // Format places for the map component
  const mapPlaces = placesWithCounts.map((place) => ({
    id: place.id,
    name: place.name,
    coordinates: place.coordinates,
    letterCount: place.letterCount,
    description: place.description,
  }))

  // Format waypoints for the map component
  const mapWaypoints = waypoints.map((waypoint) => ({
    id: waypoint.id,
    name: waypoint.name,
    coordinates: waypoint.coordinates,
    description: waypoint.description,
  }))

  // Count letters by location for the "Letters by Location" section
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

      {/* Interactive Map */}
      <div className="paper p-4 mb-8">
        <MapClient places={mapPlaces} waypoints={mapWaypoints} />
        <p className="text-xs text-gray-500 mt-2 text-center">
          Click on markers to see more details. The dashed line shows the battalion's route.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Places mentioned */}
        <section className="paper p-6">
          <h2 className="font-display text-2xl text-olive-800 mb-4">Places Mentioned</h2>
          <div className="space-y-3">
            {placesWithCounts
              .filter((place) => place.letterCount > 0)
              .sort((a, b) => b.letterCount - a.letterCount)
              .map((place) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between p-3 bg-sepia-50 rounded hover:bg-sepia-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">{place.name}</p>
                    <p className="text-sm text-gray-500">{place.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-olive-600">{place.letterCount} mentions</p>
                    <p className="text-xs text-gray-400">
                      {place.coordinates.lat.toFixed(2)}°N, {Math.abs(place.coordinates.lng).toFixed(2)}°
                      {place.coordinates.lng >= 0 ? 'E' : 'W'}
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
            {waypoints.map((waypoint, index) => (
              <div key={waypoint.id} className="flex gap-4">
                {/* Route line */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-olive-500 border-2 border-olive-600" />
                  {index < waypoints.length - 1 && (
                    <div className="w-0.5 bg-olive-300 flex-1 min-h-8" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-4">
                  <p className="font-medium text-gray-800">{waypoint.name}</p>
                  <p className="text-sm text-gray-500">{waypoint.description}</p>
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
