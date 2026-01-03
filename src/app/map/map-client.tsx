'use client'

import dynamic from 'next/dynamic'

// Dynamic import of MapContainer with SSR disabled
// Leaflet requires browser APIs (window, document) that aren't available during SSR
const MapContainer = dynamic(
  () => import('@/components/map/MapContainer'),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
)

function MapSkeleton() {
  return (
    <div className="rounded overflow-hidden shadow-lg bg-sepia-100 animate-pulse" style={{ height: '500px' }}>
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-olive-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-olive-700 font-serif">Loading map...</p>
        </div>
      </div>
    </div>
  )
}

interface MapClientProps {
  places: Array<{
    id: string
    name: string
    coordinates: { lat: number; lng: number }
    letterCount: number
    description: string
  }>
  waypoints: Array<{
    id: string
    name: string
    coordinates: { lat: number; lng: number }
    description: string
  }>
}

export default function MapClient({ places, waypoints }: MapClientProps) {
  return (
    <MapContainer
      places={places}
      waypoints={waypoints}
      showRoute={true}
      showPlaces={true}
    />
  )
}
