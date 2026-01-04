import type { HistoricalEvent } from '@/types/content'
import { formatShortDate } from '@/lib/dates'

interface EventCardProps {
  event: HistoricalEvent
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="border-l-2 border-olive-300 pl-3 py-2">
      <div className="text-xs text-olive-600 font-medium">
        {formatShortDate(event.date)}
      </div>
      <h4 className="text-sm font-medium text-olive-900 mt-0.5">
        {event.title}
      </h4>
      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
        {event.description}
      </p>
      {event.significance && (
        <p className="text-xs text-olive-700 mt-1 italic">
          {event.significance}
        </p>
      )}
    </div>
  )
}
