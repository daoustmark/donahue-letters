# Historical Context Panels - Implementation Plan

## Overview

Add collapsible sidebar panels to letter pages showing what was happening in the war at the time of each letter. Content is synchronized to the letter's date (±7 days).

## Data Sources

Primary sources for historical context:
1. **985th-Unit-History-On-the-Target.pdf** - Day-by-day battalion operations (Oct 1943 - May 1945)
2. **Major John James Donahue WWII Letters.pdf** - Battalion timeline appendix
3. **External sources** - Major WWII Italian Campaign events

## Data Structure

### 1. content/battalion-timeline.json
Battalion-specific events from "On the Target" and letters PDF:

```json
{
  "events": [
    {
      "id": "bt-1943-10-28",
      "date": "1943-10-28",
      "title": "985th arrives at Naples",
      "description": "Battalion arrives at Naples harbor and moves to staging area",
      "location": "naples",
      "scope": "unit",
      "source": "On the Target, p.10"
    }
  ]
}
```

### 2. content/historical-events.json
Major WWII events (theater and world scope):

```json
{
  "events": [
    {
      "id": "he-1944-06-04",
      "date": "1944-06-04",
      "title": "Liberation of Rome",
      "description": "Allied forces enter Rome, the first Axis capital to fall",
      "significance": "985th participated in the advance on Rome",
      "scope": "theater"
    }
  ]
}
```

### 3. content/home-front.json
U.S. home front context (optional, Phase 2):

```json
{
  "events": [
    {
      "id": "hf-1944-06-06",
      "date": "1944-06-06",
      "title": "D-Day News Reaches America",
      "description": "Radio broadcasts and newspapers report the Normandy invasion",
      "scope": "world"
    }
  ]
}
```

## Implementation Steps

### Phase 1: Data Extraction

1. **Extract battalion timeline from "On the Target"** (pages 10-20)
   - Day-by-day operations: arrivals, movements, actions
   - Combat statistics where dated
   - Key personnel changes
   - Create ~50-100 battalion events

2. **Extract major Italian Campaign events**
   - Battle of Monte Cassino phases (Jan-May 1944)
   - Anzio landing and breakout
   - Liberation of Rome
   - Gothic Line operations
   - Po Valley campaign
   - V-E Day
   - Create ~30-50 theater events

### Phase 2: Content Loading

Add to `src/lib/content.ts`:

```typescript
// Get all historical events
export function getAllHistoricalEvents(): HistoricalEvent[]

// Get battalion timeline events
export function getBattalionEvents(): HistoricalEvent[]

// Get events near a date (within days window)
export function getEventsNearDate(date: Date, withinDays: number): {
  battalion: HistoricalEvent[]
  theater: HistoricalEvent[]
  world: HistoricalEvent[]
}
```

### Phase 3: Component Architecture

```
src/components/historical-context/
├── HistoricalContextPanel.tsx    # Main collapsible sidebar
├── ContextSection.tsx            # Individual section (Battalion, War, etc.)
├── EventCard.tsx                 # Single event display
└── index.ts                      # Exports
```

**HistoricalContextPanel** props:
```typescript
interface Props {
  letterDate: Date
  windowDays?: number  // default: 7
  defaultExpanded?: boolean
}
```

### Phase 4: Layout Integration

Modify letter page layout from single column to sidebar layout:

**Current:**
```
┌─────────────────────────────┐
│         Letter              │
│         Content             │
│         (max-w-3xl)         │
└─────────────────────────────┘
```

**New:**
```
┌─────────────────────────────────────────────┐
│  Letter Content    │  Historical Context   │
│  (main area)       │  (collapsible sidebar) │
│                    │  - In the War          │
│                    │  - 985th Battalion     │
│                    │  - On the Home Front   │
└─────────────────────────────────────────────┘
```

On mobile: Context panel moves below letter content as collapsible accordion.

## UI/UX Design

### Desktop Layout
- Main content: 60-65% width
- Sidebar: 35-40% width (max-w-sm)
- Sidebar is sticky, scrolls independently
- Collapse button to hide sidebar entirely

### Mobile Layout
- Full-width letter content
- Context panel below letter as collapsible sections
- Sections collapsed by default to avoid overwhelming

### Visual Design
- Muted sepia/olive tones to match existing aesthetic
- Clear section headers with icons
- Event cards with date prominently displayed
- Source citations in small text
- Links to related letters/wiki pages

## File Changes Summary

### New Files
- `content/battalion-timeline.json`
- `content/historical-events.json`
- `src/components/historical-context/HistoricalContextPanel.tsx`
- `src/components/historical-context/ContextSection.tsx`
- `src/components/historical-context/EventCard.tsx`
- `src/components/historical-context/index.ts`

### Modified Files
- `src/lib/content.ts` - Add event loading functions
- `src/app/letters/[slug]/page.tsx` - Add sidebar layout
- `src/types/content.ts` - May need minor type updates

## Success Criteria

1. Each letter page shows relevant historical context
2. Context updates based on letter date
3. Battalion events accurately reflect "On the Target" data
4. Sidebar is collapsible and responsive
5. Performance: no perceptible load time increase

## Estimated Scope

- Data extraction: 30-50 battalion events, 20-30 theater events
- Component work: 4 new components
- Integration: Layout changes to letter page
- Testing: Verify context appears correctly for sample letters
