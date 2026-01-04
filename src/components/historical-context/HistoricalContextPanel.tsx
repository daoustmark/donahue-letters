'use client'

import { useState } from 'react'
import type { HistoricalEvent } from '@/types/content'
import { ContextSection } from './ContextSection'

interface HistoricalContextPanelProps {
  battalionEvents: HistoricalEvent[]
  theaterEvents: HistoricalEvent[]
  worldEvents: HistoricalEvent[]
  letterDate: string
  windowDays?: number
}

export function HistoricalContextPanel({
  battalionEvents,
  theaterEvents,
  worldEvents,
  letterDate,
  windowDays = 7,
}: HistoricalContextPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const totalEvents = battalionEvents.length + theaterEvents.length + worldEvents.length

  if (totalEvents === 0) {
    return null
  }

  return (
    <aside className="lg:sticky lg:top-4 lg:self-start">
      <div className="bg-sepia-50 border border-sepia-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between p-4 bg-sepia-100 border-b border-sepia-200"
        >
          <div>
            <h2 className="text-sm font-semibold text-olive-900">Historical Context</h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Events within {windowDays} days of this letter
            </p>
          </div>
          <span className="text-olive-600 text-lg">
            {isCollapsed ? '+' : '−'}
          </span>
        </button>

        {!isCollapsed && (
          <div className="p-4">
            <ContextSection
              title="985th Battalion"
              icon="🎖️"
              events={battalionEvents}
              defaultOpen={true}
            />
            <ContextSection
              title="In the War"
              icon="⚔️"
              events={theaterEvents}
              defaultOpen={true}
            />
            <ContextSection
              title="World Events"
              icon="🌍"
              events={worldEvents}
              defaultOpen={worldEvents.length <= 2}
            />
          </div>
        )}
      </div>
    </aside>
  )
}
