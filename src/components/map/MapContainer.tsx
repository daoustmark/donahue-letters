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

const STADIA_STAMEN_TERRAIN_URL =
  'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png'
const OSM_FALLBACK_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const STADIA_ATTRIBUTION =
  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>. Hosted by <a href="https://stadiamaps.com/">Stadia Maps</a>.'

const OSM_ATTRIBUTION =
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
        <TileLayer
          url={STADIA_STAMEN_TERRAIN_URL}
          attribution={STADIA_ATTRIBUTION}
          errorTileUrl={OSM_FALLBACK_URL}
        />
        <TileLayer
          url={OSM_FALLBACK_URL}
          attribution={OSM_ATTRIBUTION}
          opacity={0}
          eventHandlers={{
            tileerror: () => {
              // Fallback tiles will be loaded if Stadia tiles fail
            },
          }}
        />

        {showRoute && <RouteLayer waypoints={waypoints} />}

        {showPlaces &&
          places.map((place) => <PlaceMarker key={place.id} place={place} />)}
      </LeafletMapContainer>
    </div>
  )
}
