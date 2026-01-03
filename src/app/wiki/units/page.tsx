import Link from 'next/link'

export const metadata = {
  title: 'Military Units | Wiki | The Donahue Letters',
  description: 'Learn about the military units mentioned in the Donahue WWII letters collection.',
}

const units = [
  {
    id: '985th-field-artillery',
    name: '985th Field Artillery Battalion',
    type: 'Field Artillery Battalion',
    description:
      "Major John Donahue's unit, attached to various divisions during the Italian Campaign. The 985th FA Battalion provided artillery support from North Africa through Italy, participating in major operations from Salerno to the Po Valley.",
    campaigns: ['North African Campaign (1943)', 'Italian Campaign (1943-1945)'],
    details: [
      'Equipped with 155mm howitzers',
      'Landed at Salerno in September 1943',
      'Supported operations at Cassino',
      'Participated in the liberation of Rome',
      'Operated in the Gothic Line campaign near Florence',
      'Present at the German surrender in Italy (May 1945)',
    ],
  },
  {
    id: 'fifth-army',
    name: 'U.S. Fifth Army',
    type: 'Field Army',
    description:
      'The primary American ground force in the Italian Campaign. Commanded by General Mark Clark, the Fifth Army fought from Salerno to the Alps, facing some of the most difficult terrain and determined resistance of the war.',
    campaigns: ['Italian Campaign (1943-1945)'],
    details: [
      'Activated in January 1943',
      'Led the invasion of mainland Italy at Salerno',
      'Fought through the Winter Line and at Cassino',
      'Liberated Rome on June 4, 1944',
      'Battled through the Gothic Line',
      'Accepted German surrender in Italy on May 2, 1945',
    ],
  },
  {
    id: 'fifteenth-air-force',
    name: 'Fifteenth Air Force',
    type: 'Air Force',
    description:
      "Based in Italy, the Fifteenth Air Force conducted strategic bombing missions over Europe. John's brother Jim served in this command.",
    campaigns: ['Strategic Bombing of Europe (1943-1945)'],
    details: [
      'Activated November 1943 in Tunisia',
      'Moved to bases in southern Italy',
      'Conducted bombing raids on Germany, Austria, and the Balkans',
      'Targeted oil refineries, aircraft factories, and transportation',
    ],
  },
]

export default function UnitsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/wiki" className="hover:text-olive-600">
            Wiki
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-700">Military Units</span>
        </nav>
        <h1 className="font-display text-4xl text-olive-900 mb-4">Military Units</h1>
        <p className="text-gray-600">
          The military organizations mentioned in the letters, from John's artillery battalion to
          the armies and air forces operating in the Mediterranean Theater.
        </p>
      </header>

      <div className="space-y-8">
        {units.map((unit) => (
          <article key={unit.id} className="paper p-6">
            <h2 className="font-display text-2xl text-olive-800 mb-2">{unit.name}</h2>
            <p className="text-olive-600 text-sm mb-4">{unit.type}</p>
            <p className="text-gray-700 mb-4">{unit.description}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-olive-700 mb-2">Campaigns</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {unit.campaigns.map((campaign) => (
                    <li key={campaign}>• {campaign}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-olive-700 mb-2">Key Facts</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {unit.details.slice(0, 4).map((detail) => (
                    <li key={detail}>• {detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
