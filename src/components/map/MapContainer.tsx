'use client'

import 'leaflet/dist/leaflet.css'

import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet'
import PlaceMarker from './PlaceMarker'
import RouteLayer from './RouteLayer'

interface MapContainerProps {
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
  showRoute?: boolean
  showPlaces?: boolean
}

// Using OpenStreetMap tiles (free, no API key required)
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

// Map center on Italy
const MAP_CENTER: [number, number] = [41.5, 14.0]
const MAP_ZOOM = 6

export default function MapContainer({
  places,
  waypoints,
  showRoute = true,
  showPlaces = true,
}: MapContainerProps) {
  return (
    <div
      className="rounded overflow-hidden shadow-lg"
      style={{
        height: '500px',
        filter: 'sepia(0.2) saturate(0.9)',
      }}
    >
      <LeafletMapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

        {showRoute && <RouteLayer waypoints={waypoints} />}

        {showPlaces &&
          places.map((place) => <PlaceMarker key={place.id} place={place} />)}
      </LeafletMapContainer>
    </div>
  )
}
