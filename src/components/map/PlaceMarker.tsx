'use client'

import { CircleMarker, Popup } from 'react-leaflet'
import Link from 'next/link'

interface PlaceMarkerProps {
  place: {
    id: string
    name: string
    coordinates: { lat: number; lng: number }
    letterCount: number
    description: string
  }
}

export default function PlaceMarker({ place }: PlaceMarkerProps) {
  const radius = Math.min(18, Math.max(6, 6 + place.letterCount * 2))

  return (
    <CircleMarker
      center={[place.coordinates.lat, place.coordinates.lng]}
      radius={radius}
      pathOptions={{
        fillColor: '#d4915a',
        fillOpacity: 0.7,
        color: '#854f3a',
        weight: 2,
      }}
    >
      <Popup>
        <div
          style={{
            backgroundColor: '#fdf8f3',
            fontFamily: 'inherit',
            padding: '0.5rem',
            minWidth: '150px',
          }}
        >
          <h3
            style={{
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              color: '#3d2b1f',
            }}
          >
            {place.name}
          </h3>
          <p
            style={{
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              color: '#5c4033',
            }}
          >
            {place.description}
          </p>
          {place.letterCount > 0 ? (
            <>
              <p
                style={{
                  marginBottom: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#6b5344',
                  fontStyle: 'italic',
                }}
              >
                {place.letterCount} {place.letterCount === 1 ? 'letter mentions' : 'letters mention'} this location
              </p>
              <Link
                href={`/archive?location=${place.id}`}
                style={{
                  color: '#545f44',
                  textDecoration: 'underline',
                  fontSize: '0.875rem',
                }}
              >
                View letters from here
              </Link>
            </>
          ) : (
            <p
              style={{
                fontSize: '0.75rem',
                color: '#6b5344',
                fontStyle: 'italic',
              }}
            >
              Historical waypoint (no letters from this location)
            </p>
          )}
        </div>
      </Popup>
    </CircleMarker>
  )
}
