import Link from 'next/link'
import { getAllLettersChronological } from '@/lib/content'

export const metadata = {
  title: 'Themes | Wiki | The Donahue Letters',
  description: 'Explore all recurring themes and topics in the Donahue WWII letters collection.',
}

function formatTheme(theme: string): string {
  return theme.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function ThemesPage() {
  const letters = getAllLettersChronological()

  // Count themes
  const themeCounts: Record<string, number> = {}
  letters.forEach((letter) => {
    letter.themes.forEach((theme) => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1
    })
  })

  // Sort by count (descending)
  const sortedThemes = Object.entries(themeCounts).sort(([, a], [, b]) => b - a)

  // Group themes by category
  const categories: Record<string, string[]> = {
    'Daily Life': ['daily-life', 'food', 'weather', 'health', 'rest-and-relaxation', 'entertainment', 'reading', 'music'],
    'Family & Home': ['family-news', 'patsy', 'marriage', 'home-front', 'packages-from-home', 'letters-and-mail', 'holiday', 'easter', 'christmas'],
    'Faith & Religion': ['faith', 'religion', 'papal-audience', 'mass', 'chaplain', 'prayer'],
    'Military Life': ['military-life', 'training', 'combat', 'promotions', 'military-travel', 'air-travel', 'censorship', 'v-mail'],
    'Places & Travel': ['rome', 'naples', 'cassino', 'florence', 'venice', 'sightseeing', 'italian-culture'],
    'War Events': ['italian-campaign', 'd-day', 've-day', 'german-surrender', 'end-of-war', 'liberation'],
    'People': ['brother-jim', 'family-reunion', 'comrades', 'commanding-officers'],
    'Emotions & Reflections': ['love', 'longing', 'hope', 'gratitude', 'war-reflections', 'future-plans', 'homecoming'],
  }

  // Find uncategorized themes
  const categorizedThemes = new Set(Object.values(categories).flat())
  const uncategorized = sortedThemes.filter(([theme]) => !categorizedThemes.has(theme))

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/wiki" className="hover:text-olive-600">
            Wiki
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-700">Themes</span>
        </nav>
        <h1 className="font-display text-4xl text-olive-900 mb-4">Themes</h1>
        <p className="text-gray-600">
          Recurring topics and subjects throughout the {letters.length} letters in the collection.
          Click any theme to filter letters in the archive.
        </p>
      </header>

      {/* All themes cloud */}
      <section className="paper p-6 mb-8">
        <h2 className="font-display text-xl text-olive-800 mb-4">All Themes ({sortedThemes.length})</h2>
        <div className="flex flex-wrap gap-2">
          {sortedThemes.map(([theme, count]) => (
            <Link
              key={theme}
              href={`/archive?theme=${theme}`}
              className="tag hover:bg-sepia-300 transition-colors"
              title={`${count} letter${count !== 1 ? 's' : ''}`}
            >
              {formatTheme(theme)} ({count})
            </Link>
          ))}
        </div>
      </section>

      {/* Categorized themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(categories).map(([category, themeList]) => {
          const categoryThemes = themeList
            .filter((t) => themeCounts[t])
            .map((t) => ({ theme: t, count: themeCounts[t] }))
            .sort((a, b) => b.count - a.count)

          if (categoryThemes.length === 0) return null

          return (
            <section key={category} className="paper p-5">
              <h3 className="font-display text-lg text-olive-800 mb-3">{category}</h3>
              <ul className="space-y-2">
                {categoryThemes.map(({ theme, count }) => (
                  <li key={theme}>
                    <Link
                      href={`/archive?theme=${theme}`}
                      className="flex justify-between items-center text-olive-600 hover:text-olive-800 hover:underline"
                    >
                      <span>{formatTheme(theme)}</span>
                      <span className="text-xs text-gray-400">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        {uncategorized.length > 0 && (
          <section className="paper p-5">
            <h3 className="font-display text-lg text-olive-800 mb-3">Other Topics</h3>
            <ul className="space-y-2">
              {uncategorized.map(([theme, count]) => (
                <li key={theme}>
                  <Link
                    href={`/archive?theme=${theme}`}
                    className="flex justify-between items-center text-olive-600 hover:text-olive-800 hover:underline"
                  >
                    <span>{formatTheme(theme)}</span>
                    <span className="text-xs text-gray-400">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
