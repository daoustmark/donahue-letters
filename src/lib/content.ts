import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Letter, LetterFrontmatter, OnThisDayData } from '@/types/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const LETTERS_DIR = path.join(CONTENT_DIR, 'letters')

/**
 * Get all letter slugs for static generation
 */
export function getAllLetterSlugs(): string[] {
  const files = fs.readdirSync(LETTERS_DIR)
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

/**
 * Get a single letter by slug
 */
export function getLetterBySlug(slug: string): Letter | null {
  const filePath = path.join(LETTERS_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    ...(data as LetterFrontmatter),
    slug,
    content,
  }
}

/**
 * Get all letters, sorted by date (newest first)
 */
export function getAllLetters(): Letter[] {
  const slugs = getAllLetterSlugs()
  const letters = slugs
    .map((slug) => getLetterBySlug(slug))
    .filter((letter): letter is Letter => letter !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return letters
}

/**
 * Get all letters sorted by date (oldest first, chronological)
 */
export function getAllLettersChronological(): Letter[] {
  return getAllLetters().reverse()
}

/**
 * Parse a date (string or Date object) as local time (not UTC)
 * Handles both YYYY-MM-DD strings and Date objects from gray-matter
 */
function parseLocalDate(dateInput: string | Date): Date {
  if (dateInput instanceof Date) {
    // gray-matter already parsed it as a Date (in UTC)
    // Extract the UTC date components and create a local date
    return new Date(
      dateInput.getUTCFullYear(),
      dateInput.getUTCMonth(),
      dateInput.getUTCDate()
    )
  }
  // It's a string like "1945-08-15"
  const [year, month, day] = dateInput.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Get letters for a specific month and day (any year)
 */
export function getLettersOnThisDay(month: number, day: number): Letter[] {
  const letters = getAllLetters()

  return letters.filter((letter) => {
    const letterDate = parseLocalDate(letter.date)
    return letterDate.getMonth() + 1 === month && letterDate.getDate() === day
  })
}

/**
 * Get "On This Day" data for today's date
 */
export function getOnThisDayData(): OnThisDayData {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()

  return {
    letters: getLettersOnThisDay(month, day),
    events: [], // TODO: Add historical events when we have that data
    date: { month, day },
  }
}

/**
 * Get adjacent letters (previous and next) for navigation
 */
export function getAdjacentLetters(slug: string): {
  previous: Letter | null
  next: Letter | null
} {
  const letters = getAllLettersChronological()
  const currentIndex = letters.findIndex((l) => l.slug === slug)

  if (currentIndex === -1) {
    return { previous: null, next: null }
  }

  return {
    previous: currentIndex > 0 ? letters[currentIndex - 1] : null,
    next: currentIndex < letters.length - 1 ? letters[currentIndex + 1] : null,
  }
}

/**
 * Get letters by theme
 */
export function getLettersByTheme(theme: string): Letter[] {
  const letters = getAllLetters()
  return letters.filter((letter) => letter.themes.includes(theme))
}

/**
 * Get letters by person (from, to, or mentioned)
 */
export function getLettersByPerson(personSlug: string): Letter[] {
  const letters = getAllLetters()
  return letters.filter(
    (letter) =>
      letter.from === personSlug ||
      letter.to.includes(personSlug) ||
      letter.people_mentioned.includes(personSlug)
  )
}

/**
 * Get letters by year
 */
export function getLettersByYear(year: number): Letter[] {
  const letters = getAllLetters()
  return letters.filter((letter) => {
    const letterYear = new Date(letter.date).getFullYear()
    return letterYear === year
  })
}

/**
 * Get all unique themes across all letters
 */
export function getAllThemes(): string[] {
  const letters = getAllLetters()
  const themes = new Set<string>()

  letters.forEach((letter) => {
    letter.themes.forEach((theme) => themes.add(theme))
  })

  return Array.from(themes).sort()
}

/**
 * Get all unique people mentioned across all letters
 */
export function getAllPeopleMentioned(): string[] {
  const letters = getAllLetters()
  const people = new Set<string>()

  letters.forEach((letter) => {
    people.add(letter.from)
    letter.to.forEach((person) => people.add(person))
    letter.people_mentioned.forEach((person) => people.add(person))
  })

  return Array.from(people).sort()
}

/**
 * Get letters near a given date (within a specified number of days)
 */
export function getLettersNearDate(date: Date, withinDays: number = 7): Letter[] {
  const letters = getAllLetters()
  const targetTime = date.getTime()
  const msInDay = 24 * 60 * 60 * 1000

  return letters.filter((letter) => {
    const letterTime = new Date(letter.date).getTime()
    const diff = Math.abs(targetTime - letterTime)
    return diff <= withinDays * msInDay
  })
}

/**
 * Format date for display
 */
export function formatLetterDate(dateInput: string | Date): string {
  const date = parseLocalDate(dateInput)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Get a short date format (Month Day, Year)
 */
export function formatShortDate(dateInput: string | Date): string {
  const date = parseLocalDate(dateInput)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
