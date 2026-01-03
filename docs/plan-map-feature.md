# Map Feature Implementation Plan

## Overview

Implement an interactive map showing the geographic journey of the 985th Field Artillery Battalion through the Italian Campaign, with markers for places mentioned in letters and a route line showing movement over time.

**Approach**: Start with basic functionality, but architect for future enhancements (layer toggles, date filtering, timeline sync).

**Map Style**: Historical overlay - WWII-era map tiles where available, with fallback to muted modern tiles.

---

## Technology Stack

### Core
- **Leaflet.js** - Lightweight, mobile-friendly, excellent plugin ecosystem
- **react-leaflet** - React bindings for Leaflet (v4.x for React 18 compatibility)

### Map Tiles (Historical Focus)
Primary options for WWII-era aesthetic:
1. **Stamen Watercolor** - Artistic, historical feel (though being deprecated, still works)
2. **OpenStreetMap with sepia filter** - Fallback with CSS `filter: sepia(0.3)`
3. **Thunderforest Pioneer** - Vintage-style tiles (requires free API key)
4. **Custom overlay** - Could add historical map overlay for Italy specifically

Recommendation: Use Stamen Terrain or Watercolor for base, with CSS sepia tint to match site palette.

### Why Not Other Options
- **Mapbox GL**: Overkill for this use case, requires API key, larger bundle
- **Google Maps**: Requires API key, doesn't fit vintage aesthetic
- **OpenLayers**: More complex API than needed

---

## Data Architecture

### Places Data Structure
Move from hardcoded to `content/places.json`:

```json
{
  "places": [
    {
      "id": "rome",
      "name": "Rome",
      "aliases": ["Roma"],
      "coordinates": { "lat": 41.9028, "lng": 12.4964 },
      "type": "city",
      "country": "Italy",
      "description": "Capital of Italy, liberated June 4, 1944",
      "significance": "Site of John's papal audience at Santa Susanna"
    }
  ]
}
```

### Route Data Structure
Create `content/route.json`:

```json
{
  "segments": [
    {
      "id": "training-to-africa",
      "from": "fort-sill",
      "to": "north-africa",
      "startDate": "1943-07-01",
      "endDate": "1943-08-08",
      "description": "Deployment to North Africa"
    }
  ],
  "waypoints": [
    {
      "id": "fort-sill",
      "name": "Fort Sill, Oklahoma",
      "coordinates": { "lat": 34.65, "lng": -98.4 },
      "arrivalDate": null,
      "departureDate": "1943-07-01",
      "description": "Training base"
    },
    {
      "id": "north-africa",
      "name": "North Africa (Tunisia)",
      "coordinates": { "lat": 36.8, "lng": 10.18 },
      "arrivalDate": "1943-08-08",
      "departureDate": "1943-09-09",
      "description": "Staging area before Italian invasion"
    }
  ]
}
```

### Letter-Place Linking
Already exists in letter frontmatter (`location`, `places_mentioned`). The map component will:
1. Load all letters
2. Extract unique locations
3. Match against places.json
4. Build bidirectional links

---

## Component Architecture

```
src/
├── app/map/
│   ├── page.tsx              # Server component - loads data
│   └── map-client.tsx        # Client component - renders Leaflet
├── components/map/
│   ├── MapContainer.tsx      # Wrapper handling dynamic import
│   ├── PlaceMarker.tsx       # Individual place marker with popup
│   ├── RouteLayer.tsx        # Polyline for battalion route
│   ├── MapLegend.tsx         # Legend component
│   └── MapControls.tsx       # Layer toggles, zoom controls
└── lib/
    └── places.ts             # Place data loading utilities
```

### Key Technical Consideration: SSR
Leaflet requires browser APIs (window, document). Must use dynamic import:

```tsx
// map-client.tsx
'use client'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/map/MapContainer'), {
  ssr: false,
  loading: () => <MapSkeleton />
})
```

---

## Implementation Phases

### Phase 1: Basic Interactive Map (MVP)
**Goal**: Replace placeholder with working map showing place markers

1. Install dependencies: `npm install leaflet react-leaflet @types/leaflet`
2. Create `content/places.json` with known locations
3. Create `MapContainer` client component with:
   - Leaflet map centered on Italy (lat: 42, lng: 13, zoom: 6)
   - Stamen Terrain tiles with sepia CSS filter
   - CircleMarkers for each place, sized by mention count
   - Popups showing place name, letter count, link to filtered archive
4. Create `map-client.tsx` with dynamic import
5. Update `page.tsx` to pass data to client component
6. Keep existing "Places Mentioned" and "Battalion Route" sections below map

**Deliverables**:
- Working interactive map
- Clickable markers with popups
- Responsive (works on mobile)
- Matches site's sepia aesthetic

### Phase 2: Route Visualization
**Goal**: Show battalion movement as connected line

1. Create `content/route.json` with waypoint data
2. Research approximate coordinates for:
   - Salerno (40.68, 14.77) - landing site
   - Cassino (41.49, 13.83) - winter line
   - Anzio (41.45, 12.62) - if relevant
   - Rome (41.90, 12.50) - liberation
   - Northern positions (approximate from letters)
3. Create `RouteLayer` component:
   - Polyline connecting waypoints in order
   - Olive green color (#545f44) to match site palette
   - Dotted line style for historical feel
   - Markers at major stops with date labels
4. Add route toggle in UI

**Deliverables**:
- Connected route line on map
- Date annotations at key points
- Toggle to show/hide route

### Phase 3: Layer Controls
**Goal**: User can toggle different map layers

1. Create `MapControls` component:
   - Checkbox/toggle for: Places, Route, Battle Sites
   - Collapsible panel or floating control
2. Add battle site markers (Monte Cassino, Salerno, etc.) as separate layer
3. Implement layer state management
4. Add `MapLegend` explaining marker types

**Deliverables**:
- Layer toggle UI
- Three toggleable layers
- Legend

### Phase 4: Date Filtering (Future)
**Goal**: Filter map markers by date range

1. Add date range slider component
2. Filter visible markers based on:
   - Letters written in date range
   - Route segments active in date range
3. Consider syncing with Timeline page (shared state via URL params)

---

## Approximate Waypoint Coordinates

Based on Italian Campaign history and letter locations:

| Location | Lat | Lng | Date | Notes |
|----------|-----|-----|------|-------|
| Fort Sill, OK | 34.65 | -98.40 | Pre-Jul 1943 | Training |
| Tunisia (staging) | 36.80 | 10.18 | Aug 1943 | First letter from overseas |
| Salerno | 40.68 | 14.77 | Sep 1943 | Allied landing |
| Naples area | 40.85 | 14.27 | Oct-Dec 1943 | Multiple letters |
| Cassino front | 41.49 | 13.83 | Jan-May 1944 | Winter Line |
| Rome | 41.90 | 12.50 | Jun 1944 | Liberation, Santa Susanna |
| Northern Italy | 43.77 | 11.25 | Jul 1944-Apr 1945 | Florence area (approx) |
| Venice area | 45.44 | 12.32 | May 1945 | V-E Day letter mentions gondola |

---

## Styling

### Map Container
```css
.map-container {
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  filter: sepia(0.2) saturate(0.9);
}
```

### Marker Styles
- **Place markers**: Sepia circles, size based on mention count (min 8px, max 24px)
- **Route line**: Olive green (#6b7856), 3px width, dashed
- **Waypoint markers**: Olive circles with white border
- **Battle sites**: Muted red markers (optional layer)

### Popup Styles
- Match `.paper` class styling
- Sepia background
- Serif font for place names
- Link to archive filtered by location

---

## File Changes Summary

### New Files
- `content/places.json` - Place data with coordinates
- `content/route.json` - Battalion route waypoints
- `src/components/map/MapContainer.tsx` - Main map component
- `src/components/map/PlaceMarker.tsx` - Marker with popup
- `src/components/map/RouteLayer.tsx` - Route polyline
- `src/components/map/MapLegend.tsx` - Legend component
- `src/components/map/MapControls.tsx` - Layer toggles
- `src/app/map/map-client.tsx` - Client wrapper with dynamic import
- `src/lib/places.ts` - Place data utilities

### Modified Files
- `src/app/map/page.tsx` - Convert to server component passing data to client
- `package.json` - Add leaflet, react-leaflet dependencies
- `src/app/globals.css` - Add map-specific styles

---

## Estimated Effort

| Phase | Scope | Files |
|-------|-------|-------|
| Phase 1 | Basic map with markers | 6-8 files |
| Phase 2 | Route visualization | 2-3 files |
| Phase 3 | Layer controls | 2-3 files |
| Phase 4 | Date filtering | 3-4 files (future) |

**Recommendation**: Implement Phase 1 and Phase 2 together, as the route is a key visual element. Phase 3 can follow. Phase 4 is a future enhancement.

---

## Open Questions Resolved

1. ✅ **Scope**: Start basic, design for full (answered by Mark)
2. ✅ **Map style**: Historical overlay with fallback (answered by Mark)
3. ✅ **Route data**: Use approximations from letters + campaign history (answered by Mark)

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Historical tile service unreliable | Fallback to OSM + sepia filter |
| Leaflet SSR issues | Dynamic import with ssr: false |
| Mobile touch conflicts | Use Leaflet's built-in mobile handling |
| Route accuracy | Document that route is approximate; link to authoritative sources |

---

## Next Steps

1. Mark approves this plan
2. Implement Phase 1 (basic map with markers)
3. Test on desktop and mobile
4. Implement Phase 2 (route line)
5. Commit working map feature
6. Phase 3+ based on priorities
