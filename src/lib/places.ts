import fs from 'fs'
import path from 'path'
import { getAllLettersChronological } from './content'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const PLACES_FILE = path.join(CONTENT_DIR, 'places.json')
const ROUTE_FILE = path.join(CONTENT_DIR, 'route.json')

/**
 * Place data from places.json
 */
export interface Place {
  id: string
  name: string
  aliases?: string[]
  coordinates: { lat: number; lng: number }
  type: string
  country: string
  description: string
  significance?: string
}

/**
 * Route waypoint data from route.json
 */
export interface Waypoint {
  id: string
  name: string
  coordinates: { lat: number; lng: number }
  arrivalDate: string | null
  departureDate: string | null
  description: string
}

/**
 * Place with associated letter count
 */
export interface PlaceWithLetterCount extends Place {
  letterCount: number
}

/**
 * Load all places from places.json
 */
export function getAllPlaces(): Place[] {
  const fileContents = fs.readFileSync(PLACES_FILE, 'utf8')
  const data = JSON.parse(fileContents) as { places: Place[] }
  return data.places
}

/**
 * Get a single place by ID
 */
export function getPlaceById(id: string): Place | null {
  const places = getAllPlaces()
  return places.find((place) => place.id === id) || null
}

/**
 * Load route waypoints from route.json
 */
export function getRouteWaypoints(): Waypoint[] {
  const fileContents = fs.readFileSync(ROUTE_FILE, 'utf8')
  const data = JSON.parse(fileContents) as { waypoints: Waypoint[] }
  return data.waypoints
}

/**
 * Get places mentioned in letters with letter counts
 * Cross-references places with letter locations from places_mentioned field
 */
export function getPlacesWithLetterCounts(): PlaceWithLetterCount[] {
  const places = getAllPlaces()
  const letters = getAllLettersChronological()

  // Count how many letters mention each place
  const letterCountMap = new Map<string, number>()

  letters.forEach((letter) => {
    // Check places_mentioned field
    letter.places_mentioned.forEach((placeId) => {
      const currentCount = letterCountMap.get(placeId) || 0
      letterCountMap.set(placeId, currentCount + 1)
    })

    // Also check location field if it matches a place ID
    if (letter.location) {
      const locationId = letter.location.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const currentCount = letterCountMap.get(locationId) || 0
      letterCountMap.set(locationId, currentCount + 1)
    }
  })

  // Combine places with their letter counts (checking id and aliases)
  return places.map((place) => {
    let count = letterCountMap.get(place.id) || 0
    // Also check aliases
    if (place.aliases) {
      place.aliases.forEach((alias) => {
        count += letterCountMap.get(alias) || 0
      })
    }
    return {
      ...place,
      letterCount: count,
    }
  })
}
