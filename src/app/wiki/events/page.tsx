import Link from 'next/link'

export const metadata = {
  title: 'Historical Events | Wiki | The Donahue Letters',
  description:
    'Key events of World War II referenced in or relevant to the Donahue letters collection.',
}

const events = [
  {
    id: 'salerno-landing',
    name: 'Allied Landing at Salerno',
    date: 'September 9, 1943',
    category: 'Italian Campaign',
    description:
      "Operation Avalanche was the main Allied amphibious landing on mainland Italy. The 985th Field Artillery Battalion, John's unit, landed at Salerno as part of the invasion force. The landing was fiercely contested, with German forces nearly pushing the Allies back into the sea before reinforcements arrived.",
    relevance: "John's unit participated in this invasion, marking the beginning of his combat experience in Italy.",
  },
  {
    id: 'naples-liberation',
    name: 'Liberation of Naples',
    date: 'October 1, 1943',
    category: 'Italian Campaign',
    description:
      'Naples was the first major European city to be liberated by the Allies. The Germans had destroyed the port facilities and left the city booby-trapped, but the Neapolitan uprising helped accelerate the liberation. Naples became a crucial supply port for Allied operations.',
    relevance:
      'Naples served as the primary logistics hub for Allied forces in Italy, and John passed through multiple times.',
  },
  {
    id: 'monte-cassino',
    name: 'Battle of Monte Cassino',
    date: 'January - May 1944',
    category: 'Italian Campaign',
    description:
      "Four major assaults were required to break through the German Winter Line at Monte Cassino. The ancient Benedictine monastery, destroyed in the February 1944 bombing, became a symbol of the campaign's brutality. The Polish II Corps finally captured the ruins on May 18, 1944.",
    relevance:
      "John's artillery battalion supported operations in the Cassino sector during this prolonged battle.",
  },
  {
    id: 'anzio-landing',
    name: 'Anzio Landing',
    date: 'January 22, 1944',
    category: 'Italian Campaign',
    description:
      "Operation Shingle was an amphibious landing behind German lines intended to outflank the Winter Line. However, the beachhead became trapped for four months due to cautious leadership and fierce German counterattacks. The breakout finally came in late May 1944.",
    relevance: 'Referenced in the letters as part of the overall Italian Campaign context.',
  },
  {
    id: 'rome-liberation',
    name: 'Liberation of Rome',
    date: 'June 4, 1944',
    category: 'Italian Campaign',
    description:
      'Rome became the first Axis capital to fall to the Allies. The city was declared an open city to prevent destruction, and American forces entered on June 4, 1944. The liberation was overshadowed two days later by the D-Day invasion of Normandy.',
    relevance:
      'John visited Rome multiple times after its liberation, including attending a papal audience at Santa Susanna church.',
  },
  {
    id: 'd-day',
    name: 'D-Day: Normandy Invasion',
    date: 'June 6, 1944',
    category: 'World War II',
    description:
      "Operation Overlord was the largest amphibious invasion in history. Allied forces landed on five beaches in Normandy, France, beginning the liberation of Western Europe. The invasion drew attention and resources away from the Italian Campaign.",
    relevance:
      "While John fought in Italy, D-Day represented the opening of the second front that would eventually end the war in Europe.",
  },
  {
    id: 'gothic-line',
    name: 'Gothic Line Campaign',
    date: 'August 1944 - April 1945',
    category: 'Italian Campaign',
    description:
      "The Gothic Line was Germany's last major defensive line in Italy, stretching across the Apennine Mountains. The Allies broke through in late summer 1944 but were unable to exploit the breakthrough before winter. Fighting continued through the winter of 1944-45.",
    relevance:
      "John's unit was stationed in the Florence area during the Gothic Line campaign, providing artillery support for operations in the mountains.",
  },
  {
    id: 've-day',
    name: 'V-E Day: Victory in Europe',
    date: 'May 8, 1945',
    category: 'World War II',
    description:
      'Victory in Europe Day marked the formal acceptance of Nazi Germany\'s unconditional surrender. German forces in Italy had already surrendered on May 2, 1945, several days before the general capitulation.',
    relevance:
      "John's V-E Day letter from Venice describes his emotions and the celebration marking the end of the war in Europe.",
  },
  {
    id: 'german-surrender-italy',
    name: 'German Surrender in Italy',
    date: 'May 2, 1945',
    category: 'Italian Campaign',
    description:
      'The surrender of German forces in Italy was the first major German surrender of the war, coming six days before V-E Day. Nearly one million German soldiers surrendered, ending the Italian Campaign.',
    relevance:
      "John was present in Italy when the surrender occurred, marking the end of his combat service.",
  },
]

export default function EventsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/wiki" className="hover:text-olive-600">
            Wiki
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-700">Historical Events</span>
        </nav>
        <h1 className="font-display text-4xl text-olive-900 mb-4">Historical Events</h1>
        <p className="text-gray-600">
          Key events of World War II that are referenced in or provide context for the Donahue
          letters.
          <Link href="/timeline" className="text-olive-600 hover:underline ml-2">
            View the timeline →
          </Link>
        </p>
      </header>

      {/* Italian Campaign Events */}
      <section className="mb-10">
        <h2 className="font-display text-2xl text-olive-800 mb-6">Italian Campaign</h2>
        <div className="relative border-l-2 border-olive-300 pl-6 space-y-8">
          {events
            .filter((e) => e.category === 'Italian Campaign')
            .map((event) => (
              <article key={event.id} className="relative">
                <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-olive-500 border-2 border-white" />
                <div className="paper p-5">
                  <p className="text-sm text-olive-600 mb-1">{event.date}</p>
                  <h3 className="font-display text-xl text-olive-800 mb-2">{event.name}</h3>
                  <p className="text-gray-700 mb-3">{event.description}</p>
                  <p className="text-sm text-olive-700 bg-olive-50 p-3 rounded">
                    <strong>Connection to the letters:</strong> {event.relevance}
                  </p>
                </div>
              </article>
            ))}
        </div>
      </section>

      {/* World Events */}
      <section>
        <h2 className="font-display text-2xl text-olive-800 mb-6">World Events</h2>
        <div className="relative border-l-2 border-sepia-300 pl-6 space-y-8">
          {events
            .filter((e) => e.category === 'World War II')
            .map((event) => (
              <article key={event.id} className="relative">
                <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-sepia-500 border-2 border-white" />
                <div className="paper p-5">
                  <p className="text-sm text-sepia-600 mb-1">{event.date}</p>
                  <h3 className="font-display text-xl text-olive-800 mb-2">{event.name}</h3>
                  <p className="text-gray-700 mb-3">{event.description}</p>
                  <p className="text-sm text-olive-700 bg-olive-50 p-3 rounded">
                    <strong>Connection to the letters:</strong> {event.relevance}
                  </p>
                </div>
              </article>
            ))}
        </div>
      </section>
    </div>
  )
}
