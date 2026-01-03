# Donahue Letters - Progress

## Last Updated: 2026-01-03

## Current Status

MVP is complete and functional. The site has all core pages working:
- Home page with On This Day feature
- 30 letters extracted from PDF into MDX files
- Archive with search/filter
- Timeline with historical events
- **Interactive Map with Leaflet.js** (fully implemented)
- Wiki index

**The site runs at**: `npm run dev` → http://localhost:3000 (or next available port)

## Recent Work

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
3. **Historical context panels** - Add sidebar on letter pages showing what was happening in the war
4. **About pages** - Create `/about`, `/about/family`, `/about/how-to-use`
5. **Map enhancements** - Layer toggles, date filtering, timeline sync (Phase 3-4 from plan)

## Technical Notes

### Architecture Decisions
- Using MDX for letters allows future enhancement with React components in content
- Content is loaded at build time via `gray-matter` for frontmatter parsing
- Person names are currently hardcoded in helper functions - should eventually move to JSON data files

### Content Structure
- Letters use consistent frontmatter schema (see CLAUDE.md)
- Themes are free-form slugs - could benefit from a themes.json with descriptions
- People mentioned are slugs - need people.json with full bios

### Known Issues
- Wiki pages link to detail pages that don't exist yet
- Search only filters by metadata, not full letter content
