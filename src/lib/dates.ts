/**
 * Date utility functions that can be used in both client and server components
 */

/**
 * Parse a date (string or Date object) as local time (not UTC)
 */
export function parseLocalDate(dateInput: string | Date): Date {
  if (dateInput instanceof Date) {
    // Already a Date object - extract UTC components and create local date
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
 * Format date for display (full format)
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
