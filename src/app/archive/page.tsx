import { getAllLettersChronological, getAllThemes } from '@/lib/content'
import { Suspense } from 'react'
import ArchiveClient from './archive-client'

export const metadata = {
  title: 'Letter Archive | The Donahue Letters',
  description: 'Browse and search all letters and documents from the Donahue WWII collection.',
}

export default function ArchivePage() {
  // Get all letters on the server
  const letters = getAllLettersChronological().map((letter) => ({
    id: letter.id,
    slug: letter.slug,
    date: letter.date,
    from: letter.from,
    to: letter.to,
    location: letter.location,
    subject: letter.subject,
    excerpt: letter.excerpt,
    themes: letter.themes,
    document_type: letter.document_type,
  }))

  const allThemes = getAllThemes()
  const allYears = [...new Set(letters.map((l) => new Date(l.date).getFullYear()))].sort()

  return (
    <Suspense fallback={<div>Loading archive...</div>}>
      <ArchiveClient letters={letters} allThemes={allThemes} allYears={allYears} />
    </Suspense>
  )
}
