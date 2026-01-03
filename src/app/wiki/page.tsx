import Link from 'next/link'
import { getAllLettersChronological, getAllThemes, getAllPeopleMentioned } from '@/lib/content'

export const metadata = {
  title: 'Wiki | The Donahue Letters',
  description: 'Explore people, places, themes, and historical context from the Donahue WWII letters.',
}

// Helper to get person display name
function getPersonName(slug: string): string {
  const names: Record<string, string> = {
    'john-donahue': 'Major John James Donahue',
    'marie-donahue': 'Marie Donahue',
    'patsy-donahue': 'Patsy Donahue',
    'mother-donahue': 'Mother Donahue',
    'jim-donahue': 'Jim Donahue',
    'lutie': 'Lutie',
    'marquette-university': 'Marquette University',
    'santa-susanna-church': "Santa Susanna Church",
    'us-army': 'U.S. Army',
    'pittsburgh-press': 'Pittsburgh Press',
  }
  return names[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function formatTheme(theme: string): string {
  return theme.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export default function WikiPage() {
  const letters = getAllLettersChronological()
  const allThemes = getAllThemes()
  const allPeople = getAllPeopleMentioned()

  // Get top themes by frequency
  const themeCounts: Record<string, number> = {}
  letters.forEach((letter) => {
    letter.themes.forEach((theme) => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1
    })
  })
  const topThemes = Object.entries(themeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12)

  // Get people frequency
  const peopleCounts: Record<string, number> = {}
  letters.forEach((letter) => {
    peopleCounts[letter.from] = (peopleCounts[letter.from] || 0) + 1
    letter.to.forEach((person) => {
      peopleCounts[person] = (peopleCounts[person] || 0) + 1
    })
    letter.people_mentioned.forEach((person) => {
      peopleCounts[person] = (peopleCounts[person] || 0) + 1
    })
  })
  const topPeople = Object.entries(peopleCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="font-display text-4xl text-olive-900 mb-4">Wiki</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore the people, places, themes, and historical context that appear throughout
          the Donahue letters collection.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* People */}
        <section className="paper p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">👥</span>
            <h2 className="font-display text-xl text-olive-800">People</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            The family members, friends, and colleagues mentioned in the letters.
          </p>
          <ul className="space-y-2">
            {topPeople.map(([person, count]) => (
              <li key={person}>
                <Link
                  href={`/wiki/people/${person}`}
                  className="flex justify-between items-center text-olive-600 hover:text-olive-800 hover:underline"
                >
                  <span>{getPersonName(person)}</span>
                  <span className="text-xs text-gray-400">{count}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/wiki/people"
            className="block mt-4 text-sm text-olive-600 hover:underline"
          >
            View all {allPeople.length} people →
          </Link>
        </section>

        {/* Themes */}
        <section className="paper p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📚</span>
            <h2 className="font-display text-xl text-olive-800">Themes</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Recurring topics and subjects throughout the correspondence.
          </p>
          <div className="flex flex-wrap gap-2">
            {topThemes.map(([theme, count]) => (
              <Link
                key={theme}
                href={`/archive?theme=${theme}`}
                className="tag hover:bg-sepia-300 transition-colors"
                title={`${count} letters`}
              >
                {formatTheme(theme)}
              </Link>
            ))}
          </div>
          <Link
            href="/wiki/themes"
            className="block mt-4 text-sm text-olive-600 hover:underline"
          >
            View all {allThemes.length} themes →
          </Link>
        </section>

        {/* Places */}
        <section className="paper p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📍</span>
            <h2 className="font-display text-xl text-olive-800">Places</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Geographic locations mentioned or where letters were written.
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="/wiki/places/rome" className="text-olive-600 hover:underline">
                Rome, Italy
              </Link>
            </li>
            <li>
              <Link href="/wiki/places/naples" className="text-olive-600 hover:underline">
                Naples, Italy
              </Link>
            </li>
            <li>
              <Link href="/wiki/places/cassino" className="text-olive-600 hover:underline">
                Cassino, Italy
              </Link>
            </li>
            <li>
              <Link href="/wiki/places/venice" className="text-olive-600 hover:underline">
                Venice, Italy
              </Link>
            </li>
            <li>
              <Link href="/wiki/places/milwaukee" className="text-olive-600 hover:underline">
                Milwaukee, Wisconsin
              </Link>
            </li>
          </ul>
          <Link
            href="/wiki/places"
            className="block mt-4 text-sm text-olive-600 hover:underline"
          >
            View all places →
          </Link>
        </section>

        {/* Military Units */}
        <section className="paper p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⭐</span>
            <h2 className="font-display text-xl text-olive-800">Military Units</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            The military organizations mentioned in the letters.
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="/wiki/units/985th-field-artillery" className="text-olive-600 hover:underline">
                985th Field Artillery Battalion
              </Link>
            </li>
            <li>
              <Link href="/wiki/units/fifth-army" className="text-olive-600 hover:underline">
                U.S. Fifth Army
              </Link>
            </li>
          </ul>
          <Link
            href="/wiki/units"
            className="block mt-4 text-sm text-olive-600 hover:underline"
          >
            View all units →
          </Link>
        </section>

        {/* Historical Events */}
        <section className="paper p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📅</span>
            <h2 className="font-display text-xl text-olive-800">Historical Events</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Key events of World War II referenced or relevant to the letters.
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="/wiki/events/salerno-landing" className="text-olive-600 hover:underline">
                Salerno Landing (Sep 1943)
              </Link>
            </li>
            <li>
              <Link href="/wiki/events/monte-cassino" className="text-olive-600 hover:underline">
                Battle of Monte Cassino
              </Link>
            </li>
            <li>
              <Link href="/wiki/events/rome-liberation" className="text-olive-600 hover:underline">
                Liberation of Rome
              </Link>
            </li>
            <li>
              <Link href="/wiki/events/ve-day" className="text-olive-600 hover:underline">
                V-E Day (May 8, 1945)
              </Link>
            </li>
          </ul>
          <Link
            href="/wiki/events"
            className="block mt-4 text-sm text-olive-600 hover:underline"
          >
            View all events →
          </Link>
        </section>

        {/* About */}
        <section className="paper p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">ℹ️</span>
            <h2 className="font-display text-xl text-olive-800">About</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Learn more about this archive and the Donahue family.
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="text-olive-600 hover:underline">
                About This Archive
              </Link>
            </li>
            <li>
              <Link href="/about/family" className="text-olive-600 hover:underline">
                The Donahue Family
              </Link>
            </li>
            <li>
              <Link href="/about/how-to-use" className="text-olive-600 hover:underline">
                How to Use This Site
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
