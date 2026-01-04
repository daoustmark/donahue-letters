'use client'

import { useState } from 'react'
import type { HistoricalEvent } from '@/types/content'
import { EventCard } from './EventCard'

interface ContextSectionProps {
  title: string
  icon: string
  events: HistoricalEvent[]
  defaultOpen?: boolean
}

export function ContextSection({ title, icon, events, defaultOpen = true }: ContextSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  if (events.length === 0) {
    return null
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h3 className="text-sm font-semibold text-olive-800">{title}</h3>
          <span className="text-xs text-gray-500">({events.length})</span>
        </div>
        <span className="text-olive-600 text-sm">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="space-y-3 mt-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
