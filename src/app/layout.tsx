import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Donahue Letters | WWII Correspondence 1943-1945',
  description: 'A family archive of World War II letters from Major John James Donahue to his wife Marie, documenting his service in Italy with the 985th Field Artillery Battalion.',
  keywords: ['WWII letters', 'World War II', 'family history', '985th Field Artillery Battalion', 'Italy campaign'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen bg-sepia-50 antialiased">
        <header className="border-b border-sepia-200 bg-sepia-100">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="font-display text-2xl text-olive-800 hover:text-olive-900">
                The Donahue Letters
              </a>
              <div className="flex gap-6">
                <a href="/archive" className="nav-link">Archive</a>
                <a href="/timeline" className="nav-link">Timeline</a>
                <a href="/map" className="nav-link">Map</a>
                <a href="/wiki" className="nav-link">Wiki</a>
              </div>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-sepia-200 bg-sepia-100 mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
            <p>A family archive preserving the letters of Major John James Donahue</p>
            <p className="mt-2">985th Field Artillery Battalion | Italy 1943-1945</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
