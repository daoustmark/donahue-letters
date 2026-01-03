import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllLetterSlugs, getLetterBySlug, getAdjacentLetters, formatLetterDate } from '@/lib/content'
import type { Letter } from '@/types/content'
import type { Metadata } from 'next'

// Helper to get person display name
function getPersonName(slug: string): string {
  const names: Record<string, string> = {
    'john-donahue': 'Major John James Donahue',
    'marie-donahue': 'Marie Donahue',
    'patsy-donahue': 'Patsy Donahue',
    'mother-donahue': 'Mother Donahue',
    'lutie': 'Lutie',
    'marquette-university': 'Marquette University',
    'santa-susanna-church': "Santa Susanna Church",
    'us-army': 'U.S. Army',
    'pittsburgh-press': 'Pittsburgh Press',
    'unknown': 'Unknown',
  }
  return names[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Helper to format themes
function formatTheme(theme: string): string {
  return theme.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Generate static paths for all letters
export function generateStaticParams() {
  const slugs = getAllLetterSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Generate metadata for each letter
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const letter = getLetterBySlug(params.slug)

  if (!letter) {
    return { title: 'Letter Not Found' }
  }

  const title = `${formatLetterDate(letter.date)} - ${getPersonName(letter.from)} to ${letter.to.map(getPersonName).join(' & ')}`

  return {
    title: `${title} | The Donahue Letters`,
    description: letter.excerpt,
  }
}

// Letter header with metadata
function LetterHeader({ letter }: { letter: Letter }) {
  const documentType = letter.document_type || 'letter'
  const typeLabel = {
    'letter': 'Letter',
    'telegram': 'Telegram',
    'notice': 'Notice',
    'general-order': 'General Order',
    'newspaper-article': 'Newspaper Article',
    'condolence': 'Condolence Letter',
  }[documentType] || 'Document'

  return (
    <header className="border-b border-sepia-200 pb-6 mb-8">
      <p className="text-sm text-olive-600 mb-2">{typeLabel}</p>
      <h1 className="font-display text-3xl md:text-4xl text-olive-900 mb-4">
        {formatLetterDate(letter.date)}
      </h1>
      <div className="flex flex-wrap gap-4 text-gray-700">
        <div>
          <span className="text-sm text-gray-500">From:</span>{' '}
          <span className="font-medium">{getPersonName(letter.from)}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">To:</span>{' '}
          <span className="font-medium">{letter.to.map(getPersonName).join(' & ')}</span>
        </div>
        {letter.location && (
          <div>
            <span className="text-sm text-gray-500">Location:</span>{' '}
            <span className="font-medium capitalize">{letter.location.replace(/-/g, ' ')}</span>
          </div>
        )}
      </div>
      {letter.subject && (
        <p className="text-lg text-olive-700 italic mt-4">{letter.subject}</p>
      )}
    </header>
  )
}

// Letter content with styled paragraphs
function LetterContent({ content }: { content: string }) {
  // Split content into paragraphs and render
  const paragraphs = content
    .split('\n\n')
    .filter(p => p.trim())
    .map((paragraph, index) => {
      // Check if this is a signature line or special formatting
      const isSignature = paragraph.toLowerCase().includes('love') && paragraph.toLowerCase().includes('john')
      const isDateLine = /^[A-Z][a-z]+\s+\d+,?\s+\d{4}/.test(paragraph.trim())
      const isSalutation = /^dear|^dearest|^hello/i.test(paragraph.trim())

      if (isDateLine) {
        return (
          <p key={index} className="font-serif text-gray-600 text-right mb-8">
            {paragraph}
          </p>
        )
      }

      if (isSalutation) {
        return (
          <p key={index} className="font-serif text-lg text-gray-800 mb-6">
            {paragraph}
          </p>
        )
      }

      if (isSignature) {
        return (
          <p key={index} className="font-serif text-gray-700 text-right mt-8 italic">
            {paragraph}
          </p>
        )
      }

      return (
        <p key={index} className="font-serif text-gray-700 leading-relaxed my-4 indent-8 first:indent-0">
          {paragraph}
        </p>
      )
    })

  return <div className="letter-content">{paragraphs}</div>
}

// Theme tags
function ThemeTags({ themes }: { themes: string[] }) {
  if (!themes.length) return null

  return (
    <div className="mt-8 pt-6 border-t border-sepia-200">
      <h3 className="text-sm text-gray-500 mb-2">Themes</h3>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <Link
            key={theme}
            href={`/archive?theme=${theme}`}
            className="tag hover:bg-sepia-300 transition-colors"
          >
            {formatTheme(theme)}
          </Link>
        ))}
      </div>
    </div>
  )
}

// People mentioned
function PeopleMentioned({ people }: { people: string[] }) {
  if (!people.length) return null

  return (
    <div className="mt-4">
      <h3 className="text-sm text-gray-500 mb-2">People Mentioned</h3>
      <div className="flex flex-wrap gap-2">
        {people.map((person) => (
          <Link
            key={person}
            href={`/wiki/people/${person}`}
            className="text-olive-600 hover:text-olive-800 hover:underline"
          >
            {getPersonName(person)}
          </Link>
        ))}
      </div>
    </div>
  )
}

// Navigation to previous/next letters
function LetterNavigation({ slug }: { slug: string }) {
  const { previous, next } = getAdjacentLetters(slug)

  return (
    <nav className="flex justify-between items-center mt-12 pt-8 border-t border-sepia-200">
      {previous ? (
        <Link
          href={`/letters/${previous.slug}`}
          className="flex flex-col text-olive-600 hover:text-olive-800"
        >
          <span className="text-sm text-gray-500">← Previous</span>
          <span className="font-medium">{formatLetterDate(previous.date)}</span>
        </Link>
      ) : (
        <div />
      )}

      <Link
        href="/archive"
        className="text-olive-600 hover:text-olive-800 text-sm"
      >
        View All Letters
      </Link>

      {next ? (
        <Link
          href={`/letters/${next.slug}`}
          className="flex flex-col text-right text-olive-600 hover:text-olive-800"
        >
          <span className="text-sm text-gray-500">Next →</span>
          <span className="font-medium">{formatLetterDate(next.date)}</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}

// Breadcrumb navigation
function Breadcrumbs({ letter }: { letter: Letter }) {
  return (
    <nav className="mb-6 text-sm">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="text-olive-600 hover:text-olive-800">
            Home
          </Link>
        </li>
        <li className="text-gray-400">/</li>
        <li>
          <Link href="/archive" className="text-olive-600 hover:text-olive-800">
            Archive
          </Link>
        </li>
        <li className="text-gray-400">/</li>
        <li className="text-gray-600">
          {formatLetterDate(letter.date)}
        </li>
      </ol>
    </nav>
  )
}

// Source notes
function SourceInfo({ letter }: { letter: Letter }) {
  return (
    <div className="mt-8 pt-4 border-t border-sepia-100 text-sm text-gray-500">
      <p>
        Source: {letter.source.type === 'original' ? 'Original letter' : letter.source.type}
        {letter.source.page_in_pdf && ` (PDF page ${letter.source.page_in_pdf})`}
      </p>
      {letter.notes && (
        <p className="mt-2 italic">{letter.notes}</p>
      )}
    </div>
  )
}

// Main letter page component
export default function LetterPage({ params }: { params: { slug: string } }) {
  const letter = getLetterBySlug(params.slug)

  if (!letter) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumbs letter={letter} />

      <article className="paper p-8 md:p-12">
        <LetterHeader letter={letter} />
        <LetterContent content={letter.content} />
        <ThemeTags themes={letter.themes} />
        <PeopleMentioned people={letter.people_mentioned} />
        <SourceInfo letter={letter} />
      </article>

      <LetterNavigation slug={params.slug} />
    </div>
  )
}
