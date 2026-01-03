// Core content types for the Donahue Letters Archive

export interface LetterFrontmatter {
  id: string
  date: string | Date // gray-matter parses YAML dates as Date objects
  from: string // person slug
  to: string[] // array of person slugs
  location?: string
  subject?: string
  excerpt: string
  themes: string[]
  people_mentioned: string[]
  places_mentioned: string[]
  document_type?: 'letter' | 'telegram' | 'notice' | 'general-order' | 'newspaper-article' | 'condolence'
  source: {
    type: 'original' | 'transcript' | 'telegram'
    page_in_pdf?: number
  }
  notes?: string
}

export interface Letter extends LetterFrontmatter {
  slug: string
  content: string
}

export interface Person {
  id: string
  slug: string
  name: string
  aliases?: string[]
  relationship_to_john: string
  birth_date?: string
  death_date?: string
  bio?: string
  photo_url?: string
  military_info?: {
    rank: string
    unit: string
    service_dates: string
  }
}

export interface Place {
  id: string
  slug: string
  name: string
  aliases?: string[]
  coordinates?: {
    lat: number
    lng: number
  }
  type: 'city' | 'country' | 'region' | 'military_installation' | 'landmark'
  country: string
  description?: string
  johns_description?: string
  photo_urls?: string[]
}

export interface Theme {
  id: string
  slug: string
  name: string
  description: string
  icon?: string
  key_quotes?: {
    quote: string
    letter_id: string
  }[]
}

export interface HistoricalEvent {
  id: string
  slug: string
  date: string
  end_date?: string
  title: string
  description: string
  significance?: string
  scope: 'world' | 'theater' | 'unit' | 'personal'
  related_letter_ids?: string[]
}

export interface MilitaryUnit {
  id: string
  slug: string
  designation: string
  branch: string
  parent_unit?: string
  description: string
  timeline?: {
    date: string
    event: string
    location?: string
  }[]
}

// Utility types
export type EntityType = 'person' | 'place' | 'theme' | 'event' | 'unit'

export interface OnThisDayData {
  letters: Letter[]
  events: HistoricalEvent[]
  date: {
    month: number
    day: number
  }
}
