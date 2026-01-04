# Donahue Letters - Progress

## Last Updated: 2026-01-03

## Current Status

MVP is complete and functional. The site has all core pages working:
- Home page with On This Day feature
- 30 letters extracted from PDF into MDX files
- Archive with search/filter
- Timeline with historical events
- **Interactive Map with Leaflet.js** (fully implemented)
- **Historical Context Panels** on letter pages (newly implemented)
- Wiki index

**The site runs at**: `npm run dev` → http://localhost:3000 (or next available port)

## Recent Work

### 2026-01-03: Historical Context Panels
- Implemented collapsible sidebar on letter pages showing events within ±7 days
- Downloaded "On the Target" (985th Field Artillery Battalion unit history) as primary source
- Created `content/battalion-timeline.json` with 22 battalion events (Nov 1943 - Aug 1945)
- Created `content/historical-events.json` with 28 Italian Campaign and WWII events
- Built historical context components:
  - `HistoricalContextPanel.tsx` - Main collapsible sidebar
  - `ContextSection.tsx` - Collapsible sections for Battalion, Theater, World events
  - `EventCard.tsx` - Individual event display with date, title, description
- Created `src/lib/dates.ts` for client-safe date formatting utilities
- Added content loading functions: `getEventsNearDate()`, `getBattalionEvents()`, `getHistoricalEvents()`
- Updated letter page layout to two-column grid on desktop, stacked on mobile
- "On This Day" feature now includes historical events

### 2026-01-03: Interactive Map Feature
- Implemented full interactive map using Leaflet.js + react-leaflet v4
- Created `content/places.json` with 10 locations (coordinates, descriptions)
- Created `content/route.json` with 8 battalion waypoints
- Built map components:
  - `MapContainer.tsx` - Leaflet map with Stamen Terrain tiles + sepia filter
  - `PlaceMarker.tsx` - CircleMarkers with popups showing place info and letter links
  - `RouteLayer.tsx` - Dashed polyline showing battalion movement through Italy
- Dynamic import with SSR disabled for Leaflet compatibility
- Responsive design works on mobile
- Places Mentioned section shows letter counts from actual data
- Battalion Route section shows chronological journey with descriptions

### 2026-01-03: Initial Build
- Extracted all 30 letters from source PDF into individual MDX files
- Set up Next.js 14 with App Router and Tailwind CSS
- Created content loading library (`src/lib/content.ts`)
- Fixed date parsing bug (gray-matter returns Date objects, not strings)
- Built all MVP pages:
  - Home with On This Day, featured letter, statistics
  - Individual letter pages with full content and navigation
  - Archive with search, theme/year filters, grid/list views
  - Timeline combining letters with WWII historical events
  - Map with places mentioned and battalion route
  - Wiki index page

## Next Steps

Priority items to work on:

1. **Wiki detail pages** - Create actual pages for `/wiki/people/[slug]`, `/wiki/places/[slug]`, etc.
2. **Full-text search** - Add Pagefind or Fuse.js for searching letter content
3. **About pages** - Create `/about`, `/about/family`, `/about/how-to-use`
4. **Map enhancements** - Layer toggles, date filtering, timeline sync (Phase 3-4 from plan)
5. **More battalion events** - Expand battalion-timeline.json with more detailed operations

## Technical Notes

### Architecture Decisions
- Using MDX for letters allows future enhancement with React components in content
- Content is loaded at build time via `gray-matter` for frontmatter parsing
- Person names are currently hardcoded in helper functions - should eventually move to JSON data files
- Historical events use JSON files that can be easily extended
- Date utilities split into client-safe (`dates.ts`) and server-only (`content.ts`) modules

### Content Structure
- Letters use consistent frontmatter schema (see CLAUDE.md)
- Themes are free-form slugs - could benefit from a themes.json with descriptions
- People mentioned are slugs - need people.json with full bios
- Historical events have `scope` field: 'unit' (985th), 'theater' (Italian Campaign), 'world' (global WWII)

### Primary Source Documents
- `docs/Major John James Donahue WWII Letters.pdf` - Original letters (76 pages)
- `docs/985th-Unit-History-On-the-Target.pdf` - Battalion unit history (77 pages)

### Known Issues
- Wiki pages link to detail pages that don't exist yet
- Search only filters by metadata, not full letter content
