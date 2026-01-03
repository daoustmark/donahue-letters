import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPeopleMentioned, getLettersByPerson, formatShortDate } from '@/lib/content'

// Person display names and bios
const personInfo: Record<string, { name: string; bio: string; details?: string }> = {
  'john-donahue': {
    name: 'Major John James Donahue',
    bio: 'The primary letter writer, serving as an officer in the 985th Field Artillery Battalion during World War II.',
    details: 'John served in the Italian Campaign from 1943 to 1945. He wrote regularly to his wife Marie and daughter Patsy back home in Milwaukee. His letters provide a vivid account of life as an artillery officer, from combat operations to leisure time exploring Italian cities.',
  },
  'marie-donahue': {
    name: 'Marie Donahue',
    bio: "John's beloved wife, living in Milwaukee during the war years.",
    details: 'Marie maintained the home front while John served overseas, caring for their daughter Patsy and keeping the family connected through regular correspondence. Her letters to John (which are not preserved in this collection) were clearly a lifeline for him.',
  },
  'patsy-donahue': {
    name: 'Patsy Donahue',
    bio: "John and Marie's young daughter.",
    details: "Patsy was a toddler during the war years. John's letters frequently mention his longing to see her and his delight at updates about her growth and development. He often included special messages for her.",
  },
  'mother-donahue': {
    name: 'Mother Donahue',
    bio: "John's mother, who maintained correspondence with the family during the war.",
  },
  'jim-donahue': {
    name: 'Jim Donahue',
    bio: "John's brother, who served in the U.S. Army Air Force during the war.",
    details: 'Jim was stationed at a different location in the Mediterranean theater. John made a special trip to visit him, which he describes in detail in his March 1945 letter.',
  },
  'dad-donahue': {
    name: 'Dad Donahue',
    bio: "John's father, mentioned in various letters.",
  },
  'lutie': {
    name: 'Lutie',
    bio: 'A family friend or relative who corresponded with Marie.',
  },
  'penny': {
    name: 'Penny',
    bio: "Associated with Jim Donahue, possibly his wife or girlfriend.",
  },
  'capt-biehn': {
    name: 'Captain Biehn',
    bio: "A fellow officer who John traveled with on his trip to visit his brother Jim.",
  },
}

function getPersonName(slug: string): string {
  return personInfo[slug]?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export function generateStaticParams() {
  const people = getAllPeopleMentioned()
  return people.map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const name = getPersonName(params.slug)
  return {
    title: `${name} | People | The Donahue Letters`,
    description: personInfo[params.slug]?.bio || `Learn about ${name} in the Donahue WWII letters.`,
  }
}

export default function PersonPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const letters = getLettersByPerson(slug)

  if (letters.length === 0 && !personInfo[slug]) {
    notFound()
  }

  const person = personInfo[slug] || {
    name: getPersonName(slug),
    bio: 'A person mentioned in the Donahue letters collection.',
  }

  // Categorize letters
  const lettersFrom = letters.filter((l) => l.from === slug)
  const lettersTo = letters.filter((l) => l.to.includes(slug))
  const lettersMentioned = letters.filter(
    (l) => l.from !== slug && !l.to.includes(slug) && l.people_mentioned.includes(slug)
  )

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/wiki" className="hover:text-olive-600">
            Wiki
          </Link>
          <span className="mx-2">→</span>
          <Link href="/wiki/people" className="hover:text-olive-600">
            People
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-700">{person.name}</span>
        </nav>
        <h1 className="font-display text-4xl text-olive-900 mb-4">{person.name}</h1>
        <p className="text-gray-600 text-lg">{person.bio}</p>
        {person.details && <p className="text-gray-600 mt-4">{person.details}</p>}
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="paper p-4 text-center">
          <p className="font-display text-2xl text-olive-700">{lettersFrom.length}</p>
          <p className="text-sm text-gray-500">Letters Written</p>
        </div>
        <div className="paper p-4 text-center">
          <p className="font-display text-2xl text-olive-700">{lettersTo.length}</p>
          <p className="text-sm text-gray-500">Letters Received</p>
        </div>
        <div className="paper p-4 text-center">
          <p className="font-display text-2xl text-olive-700">{lettersMentioned.length}</p>
          <p className="text-sm text-gray-500">Times Mentioned</p>
        </div>
      </div>

      {/* Letters Written */}
      {lettersFrom.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-xl text-olive-800 mb-4">Letters Written</h2>
          <div className="space-y-3">
            {lettersFrom.map((letter) => (
              <Link
                key={letter.slug}
                href={`/letters/${letter.slug}`}
                className="block paper p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-olive-800">
                      To: {letter.to.map(getPersonName).join(' & ')}
                    </p>
                    {letter.subject && (
                      <p className="text-sm text-olive-600 italic">{letter.subject}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{letter.excerpt}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatShortDate(letter.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Letters Received */}
      {lettersTo.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-xl text-olive-800 mb-4">Letters Received</h2>
          <div className="space-y-3">
            {lettersTo.map((letter) => (
              <Link
                key={letter.slug}
                href={`/letters/${letter.slug}`}
                className="block paper p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-olive-800">From: {getPersonName(letter.from)}</p>
                    {letter.subject && (
                      <p className="text-sm text-olive-600 italic">{letter.subject}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{letter.excerpt}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatShortDate(letter.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Mentioned In */}
      {lettersMentioned.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-olive-800 mb-4">Mentioned In</h2>
          <div className="space-y-3">
            {lettersMentioned.map((letter) => (
              <Link
                key={letter.slug}
                href={`/letters/${letter.slug}`}
                className="block paper p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-olive-800">
                      {getPersonName(letter.from)} → {letter.to.map(getPersonName).join(' & ')}
                    </p>
                    {letter.subject && (
                      <p className="text-sm text-olive-600 italic">{letter.subject}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatShortDate(letter.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
