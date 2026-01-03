import Link from 'next/link'
import { getAllLettersChronological, getAllPeopleMentioned } from '@/lib/content'

export const metadata = {
  title: 'People | Wiki | The Donahue Letters',
  description: 'Explore all people mentioned in the Donahue WWII letters collection.',
}

// Person display names and short bios
const personInfo: Record<string, { name: string; role: string; bio?: string }> = {
  'john-donahue': {
    name: 'Major John James Donahue',
    role: 'Author',
    bio: 'The primary letter writer, serving as an officer in the 985th Field Artillery Battalion.',
  },
  'marie-donahue': {
    name: 'Marie Donahue',
    role: 'Recipient',
    bio: "John's wife, living in Milwaukee during the war.",
  },
  'patsy-donahue': {
    name: 'Patsy Donahue',
    role: 'Recipient',
    bio: "John and Marie's young daughter.",
  },
  'mother-donahue': {
    name: 'Mother Donahue',
    role: 'Author/Recipient',
    bio: "John's mother, who also corresponded with the family.",
  },
  'jim-donahue': {
    name: 'Jim Donahue',
    role: 'Mentioned',
    bio: "John's brother, serving in the Air Force during the war.",
  },
  'dad-donahue': {
    name: 'Dad Donahue',
    role: 'Mentioned',
    bio: "John's father.",
  },
  'lutie': {
    name: 'Lutie',
    role: 'Author',
    bio: 'Family friend or relative who wrote to Marie.',
  },
  'penny': {
    name: 'Penny',
    role: 'Mentioned',
    bio: "Jim's wife or girlfriend.",
  },
  'don': {
    name: 'Don',
    role: 'Mentioned',
    bio: 'Family member or friend.',
  },
  'casey': {
    name: 'Casey',
    role: 'Mentioned',
    bio: 'Family member or friend.',
  },
  'capt-biehn': {
    name: 'Captain Biehn',
    role: 'Mentioned',
    bio: "Fellow officer in John's unit.",
  },
}

function getPersonName(slug: string): string {
  return personInfo[slug]?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

function getPersonRole(slug: string): string {
  return personInfo[slug]?.role || 'Mentioned'
}

export default function PeoplePage() {
  const letters = getAllLettersChronological()
  const allPeople = getAllPeopleMentioned()

  // Count appearances for each person
  const peopleCounts: Record<string, { from: number; to: number; mentioned: number }> = {}

  letters.forEach((letter) => {
    if (!peopleCounts[letter.from]) {
      peopleCounts[letter.from] = { from: 0, to: 0, mentioned: 0 }
    }
    peopleCounts[letter.from].from++

    letter.to.forEach((person) => {
      if (!peopleCounts[person]) {
        peopleCounts[person] = { from: 0, to: 0, mentioned: 0 }
      }
      peopleCounts[person].to++
    })

    letter.people_mentioned.forEach((person) => {
      if (!peopleCounts[person]) {
        peopleCounts[person] = { from: 0, to: 0, mentioned: 0 }
      }
      peopleCounts[person].mentioned++
    })
  })

  // Sort by total appearances
  const sortedPeople = allPeople
    .map((person) => ({
      slug: person,
      counts: peopleCounts[person] || { from: 0, to: 0, mentioned: 0 },
      total:
        (peopleCounts[person]?.from || 0) +
        (peopleCounts[person]?.to || 0) +
        (peopleCounts[person]?.mentioned || 0),
    }))
    .sort((a, b) => b.total - a.total)

  // Group by role
  const authors = sortedPeople.filter((p) => p.counts.from > 0)
  const recipients = sortedPeople.filter((p) => p.counts.to > 0 && p.counts.from === 0)
  const mentioned = sortedPeople.filter((p) => p.counts.from === 0 && p.counts.to === 0)

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/wiki" className="hover:text-olive-600">
            Wiki
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-700">People</span>
        </nav>
        <h1 className="font-display text-4xl text-olive-900 mb-4">People</h1>
        <p className="text-gray-600">
          {allPeople.length} people appear in the letters collection as authors, recipients, or mentioned individuals.
        </p>
      </header>

      {/* Letter Authors */}
      <section className="paper p-6 mb-6">
        <h2 className="font-display text-xl text-olive-800 mb-4">Letter Authors</h2>
        <div className="grid gap-4">
          {authors.map(({ slug, counts }) => (
            <Link
              key={slug}
              href={`/wiki/people/${slug}`}
              className="block p-4 bg-sepia-50 rounded hover:bg-sepia-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-olive-800">{getPersonName(slug)}</h3>
                  {personInfo[slug]?.bio && (
                    <p className="text-sm text-gray-600 mt-1">{personInfo[slug].bio}</p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{counts.from} letters written</p>
                  {counts.to > 0 && <p>{counts.to} letters received</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recipients */}
      {recipients.length > 0 && (
        <section className="paper p-6 mb-6">
          <h2 className="font-display text-xl text-olive-800 mb-4">Recipients</h2>
          <div className="grid gap-4">
            {recipients.map(({ slug, counts }) => (
              <Link
                key={slug}
                href={`/wiki/people/${slug}`}
                className="block p-4 bg-sepia-50 rounded hover:bg-sepia-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-olive-800">{getPersonName(slug)}</h3>
                    {personInfo[slug]?.bio && (
                      <p className="text-sm text-gray-600 mt-1">{personInfo[slug].bio}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{counts.to} letters received</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* People Mentioned */}
      {mentioned.length > 0 && (
        <section className="paper p-6">
          <h2 className="font-display text-xl text-olive-800 mb-4">People Mentioned</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mentioned.map(({ slug, counts }) => (
              <Link
                key={slug}
                href={`/wiki/people/${slug}`}
                className="flex justify-between items-center p-3 bg-sepia-50 rounded hover:bg-sepia-100 transition-colors"
              >
                <span className="text-olive-700">{getPersonName(slug)}</span>
                <span className="text-xs text-gray-400">{counts.mentioned} mentions</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
