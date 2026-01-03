import Link from 'next/link'
import { getAllLettersChronological } from '@/lib/content'
import type { Letter } from '@/types/content'

export const metadata = {
  title: 'Timeline | The Donahue Letters',
  description: 'Explore the chronological timeline of WWII letters from Major John James Donahue.',
}

// Helper to get person display name
function getPersonName(slug: string): string {
  const names: Record<string, string> = {
    'john-donahue': 'John',
    'marie-donahue': 'Marie',
    'patsy-donahue': 'Patsy',
    'mother-donahue': 'Mother',
    'lutie': 'Lutie',
    'marquette-university': 'Marquette',
    'santa-susanna-church': "Santa Susanna",
    'us-army': 'U.S. Army',
    'pittsburgh-press': 'Pittsburgh Press',
    'unknown': 'Unknown',
  }
  return names[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function formatDate(dateString: string): { month: string; day: string; year: string } {
  const date = new Date(dateString)
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    day: date.getDate().toString(),
    year: date.getFullYear().toString(),
  }
}

// Historical events during the Italian Campaign
const historicalEvents = [
  { date: '1943-09-09', title: 'Allied landing at Salerno', scope: 'theater' as const },
  { date: '1943-10-01', title: 'Naples captured by Allies', scope: 'theater' as const },
  { date: '1944-01-22', title: 'Anzio landing begins', scope: 'theater' as const },
  { date: '1944-02-15', title: 'Monte Cassino bombed', scope: 'theater' as const },
  { date: '1944-05-18', title: 'Monte Cassino finally falls', scope: 'theater' as const },
  { date: '1944-06-04', title: 'Rome liberated', scope: 'theater' as const },
  { date: '1944-06-06', title: 'D-Day: Normandy invasion', scope: 'world' as const },
  { date: '1944-08-15', title: 'Operation Dragoon: Southern France invasion', scope: 'world' as const },
  { date: '1945-04-28', title: 'Mussolini executed', scope: 'theater' as const },
  { date: '1945-05-02', title: 'German forces in Italy surrender', scope: 'theater' as const },
  { date: '1945-05-08', title: 'V-E Day: Victory in Europe', scope: 'world' as const },
  { date: '1945-08-15', title: 'V-J Day: Japan surrenders', scope: 'world' as const },
]

interface TimelineItem {
  type: 'letter' | 'event'
  date: string
  letter?: Letter
  event?: { title: string; scope: 'world' | 'theater' | 'unit' }
}

function TimelineEntry({ item }: { item: TimelineItem }) {
  const { month, day, year } = formatDate(item.date)

  if (item.type === 'event' && item.event) {
    const isWorld = item.event.scope === 'world'
    return (
      <div className="flex gap-4 relative">
        {/* Date column */}
        <div className="w-20 shrink-0 text-right pt-1">
          <p className="text-sm text-gray-500">{month} {day}</p>
        </div>

        {/* Timeline line and dot */}
        <div className="flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full border-2 ${isWorld ? 'bg-olive-600 border-olive-600' : 'bg-sepia-300 border-sepia-400'}`} />
          <div className="w-0.5 bg-sepia-200 flex-1 min-h-8" />
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className={`inline-block px-3 py-2 rounded ${isWorld ? 'bg-olive-100' : 'bg-sepia-100'}`}>
            <p className={`text-sm font-medium ${isWorld ? 'text-olive-800' : 'text-sepia-800'}`}>
              {item.event.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isWorld ? 'World Event' : 'Italian Campaign'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (item.type === 'letter' && item.letter) {
    const letter = item.letter
    return (
      <div className="flex gap-4 relative">
        {/* Date column */}
        <div className="w-20 shrink-0 text-right pt-1">
          <p className="text-sm font-medium text-olive-700">{month} {day}</p>
          <p className="text-xs text-gray-500">{year}</p>
        </div>

        {/* Timeline line and dot */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-white border-2 border-olive-500" />
          <div className="w-0.5 bg-sepia-200 flex-1 min-h-8" />
        </div>

        {/* Content */}
        <Link
          href={`/letters/${letter.slug}`}
          className="flex-1 pb-8 group"
        >
          <div className="paper p-4 hover:shadow-lg transition-shadow">
            <p className="font-medium text-gray-800 group-hover:text-olive-700">
              {getPersonName(letter.from)} → {letter.to.map(getPersonName).join(' & ')}
            </p>
            {letter.subject && (
              <p className="text-sm text-olive-600 italic">{letter.subject}</p>
            )}
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{letter.excerpt}</p>
          </div>
        </Link>
      </div>
    )
  }

  return null
}

function YearDivider({ year }: { year: string }) {
  return (
    <div className="flex gap-4 my-8">
      <div className="w-20 shrink-0" />
      <div className="flex items-center flex-1">
        <div className="w-8 h-0.5 bg-olive-300" />
        <span className="px-4 font-display text-2xl text-olive-700">{year}</span>
        <div className="flex-1 h-0.5 bg-olive-300" />
      </div>
    </div>
  )
}

export default function TimelinePage() {
  const letters = getAllLettersChronological()

  // Combine letters and events into a single timeline
  const allItems: TimelineItem[] = [
    ...letters.map((letter) => ({
      type: 'letter' as const,
      date: typeof letter.date === 'string' ? letter.date : letter.date.toISOString().split('T')[0],
      letter,
    })),
    ...historicalEvents.map((event) => ({
      type: 'event' as const,
      date: event.date,
      event,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Group by year
  const itemsByYear: Record<string, TimelineItem[]> = {}
  allItems.forEach((item) => {
    const year = new Date(item.date).getFullYear().toString()
    if (!itemsByYear[year]) itemsByYear[year] = []
    itemsByYear[year].push(item)
  })

  const years = Object.keys(itemsByYear).sort()

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="font-display text-4xl text-olive-900 mb-4">Timeline</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Follow the chronological journey of Major John James Donahue through his letters,
          alongside key events of the Italian Campaign and World War II.
        </p>
      </header>

      {/* Legend */}
      <div className="paper p-4 mb-8 flex flex-wrap gap-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white border-2 border-olive-500" />
          <span className="text-gray-600">Letter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-sepia-300 border-2 border-sepia-400" />
          <span className="text-gray-600">Italian Campaign Event</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-olive-600 border-2 border-olive-600" />
          <span className="text-gray-600">World Event</span>
        </div>
      </div>

      {/* Timeline */}
      <div>
        {years.map((year) => (
          <div key={year}>
            <YearDivider year={year} />
            {itemsByYear[year].map((item, index) => (
              <TimelineEntry key={`${item.type}-${item.date}-${index}`} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* End marker */}
      <div className="flex gap-4 mt-8">
        <div className="w-20 shrink-0" />
        <div className="flex items-center flex-1">
          <div className="w-6 h-6 rounded-full bg-olive-600 flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <div className="ml-4">
            <p className="font-medium text-olive-700">Coming Home</p>
            <p className="text-sm text-gray-500">The letters end with John's journey home</p>
          </div>
        </div>
      </div>
    </div>
  )
}
