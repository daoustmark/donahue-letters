'use client'

import { Polyline, CircleMarker, Popup } from 'react-leaflet'

interface RouteLayerProps {
  waypoints: Array<{
    id: string
    name: string
    coordinates: { lat: number; lng: number }
    description: string
  }>
}

export default function RouteLayer({ waypoints }: RouteLayerProps) {
  // Convert waypoints to positions array for the polyline
  const positions: [number, number][] = waypoints.map((w) => [
    w.coordinates.lat,
    w.coordinates.lng,
  ])

  return (
    <>
      {/* Route line connecting all waypoints */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: '#545f44', // olive-600
          weight: 3,
          opacity: 0.8,
          dashArray: '10, 5', // dashed line for historical feel
        }}
      />

      {/* Waypoint markers */}
      {waypoints.map((waypoint) => (
        <CircleMarker
          key={waypoint.id}
          center={[waypoint.coordinates.lat, waypoint.coordinates.lng]}
          radius={5}
          pathOptions={{
            fillColor: '#6b7856', // olive-500
            fillOpacity: 1,
            color: 'white',
            weight: 2,
          }}
        >
          <Popup>
            <div className="font-serif">
              <h3 className="font-bold text-olive-800 text-sm mb-1">
                {waypoint.name}
              </h3>
              <p className="text-olive-700 text-xs leading-relaxed">
                {waypoint.description}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  )
}
