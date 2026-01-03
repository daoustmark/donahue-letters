# Donahue WWII Letters Archive - Product Specification

## Overview

A wiki-style web application that presents Major John James Donahue's WWII letters as an interactive family archive. The app combines chronological browsing, geographic visualization, full-text search, and interconnected wiki pages to create a rich, explorable experience of family history.

---

## Core Concept

The archive treats **entities** (people, places, themes, military units, historical events) as first-class citizens with dedicated wiki pages. Letters link bidirectionally to these entities, creating a web of interconnected content that family members can explore.

**Design Philosophy:**
- Content-first: Letters are the primary artifact; everything else provides context
- Discovery-oriented: Multiple entry points to the same content
- Educational: Historical context enriches understanding without overwhelming
- Accessible: Works for all ages and technical abilities

---

## MVP Features

### 1. Interactive Timeline

**Purpose:** Visualize the chronological progression of letters alongside the war.

**User Experience:**
- Horizontal scrollable timeline spanning 1943-1945
- Two parallel tracks:
  - **Upper track:** Historical events (Italian Campaign milestones)
  - **Lower track:** Letters from John
- Visual density indicates periods of high/low correspondence
- Clicking a letter opens a preview card; click again for full letter page
- Zoom controls to view months, quarters, or entire war period

**Key Interactions:**
- Scroll/drag to navigate time
- Pinch/buttons to zoom
- Hover for quick preview
- Click for detail view
- Filter by theme (dims non-matching items)

**Data Requirements:**
- Each letter needs: date, title/excerpt, theme tags
- Historical events need: date, title, brief description, relevance to John's unit

---

### 2. Map Visualization

**Purpose:** Show the geographic journey of the 985th Field Artillery Battalion and locations mentioned in letters.

**User Experience:**
- Interactive map centered on Mediterranean/European theater
- Location markers sized by frequency of mention
- Route line showing battalion movement through campaign
- Clicking a marker shows:
  - Place name and description
  - List of letters mentioning this location
  - Quick link to place's wiki page

**Map Layers:**
- Base layer: Period-appropriate or subtle modern map
- Route layer: Battalion's journey with date annotations
- Letters layer: Markers for letter locations
- Context layer: Major battle sites, cities (toggleable)

**Key Interactions:**
- Pan and zoom
- Click markers for info popups
- Toggle layers on/off
- Filter by date range (syncs with timeline if both visible)

**Data Requirements:**
- Places need: coordinates (lat/lng), name, type, description
- Letters need: associated location (where written from, if known)
- Route data: ordered list of locations with dates

---

### 3. Digital Archive with Search

**Purpose:** Find specific letters or browse the complete collection.

**Search Capabilities:**
- Full-text search across all letter content
- Instant results as you type
- Search result snippets with highlighted matches
- Sort by relevance or date

**Browse/Filter Options:**
- Date range picker
- Filter by person (from, to, mentioned)
- Filter by place
- Filter by theme
- Combine multiple filters

**Archive View:**
- Card grid or list view (toggle)
- Each card shows: date, recipient, excerpt, theme tags
- Pagination or infinite scroll
- Quick actions: open letter, view on timeline, view on map

**Data Requirements:**
- Search index built from letter content and metadata
- Faceted metadata for filtering

---

### 4. "On This Day" Feature

**Purpose:** Create a daily touchpoint that surfaces relevant content.

**Home Page Widget:**
- Prominent placement on landing page
- Shows letters written on today's date (any year)
- Shows historical events from this date during WWII
- "Nothing on this day" fallback: show nearest date or random featured letter

**Dedicated Page:**
- Calendar navigation to explore any date
- Side-by-side: letters on left, historical events on right
- Share functionality for family to send interesting dates

**Optional Enhancement:**
- Email digest subscription for family members
- Daily notification with "On This Day" content

---

### 5. Historical Context Panels

**Purpose:** Enrich letters with what was happening in the war at that time.

**Implementation:**
- Sidebar or collapsible panel on letter pages
- Content synchronized to letter's date (±1 week)
- Sections:
  - "In the War" - major events happening
  - "985th Battalion" - what the unit was doing
  - "On the Home Front" - relevant US context

**Context Sources:**
- Timeline of 985th Field Artillery Battalion (from PDF appendix)
- Major WWII Italian Campaign events
- General WWII timeline

**Key Interactions:**
- Expand/collapse context panel
- Click events to see related letters
- Toggle between brief and detailed view

---

### 6. Wiki Pages

**Purpose:** Dedicated pages for entities that appear across multiple letters.

#### Page Types:

**People Pages:**
- Name, relationship to John, photo (if available)
- Biographical information
- Letters written by this person
- Letters written to this person
- Letters mentioning this person
- Related people (family connections)

**Place Pages:**
- Name, coordinates, map embed
- Historical significance during WWII
- Description from letters (how John described it)
- All letters mentioning this place
- Photos (historical or modern)

**Theme Pages:**
- Theme name and description
- Why this theme matters in context
- All letters tagged with this theme
- Key quotes from letters
- Related themes

**Military Unit Pages:**
- Unit designation and hierarchy
- Commanding officers
- Campaign history
- Timeline of movements
- Letters referencing unit activities

**Historical Event Pages:**
- Event name and date
- Description and significance
- Connection to John's experience
- Related letters (written around this time)
- External resources for learning more

#### Wiki Features:
- Automatic linking: recognized entities in letter text become links
- "See also" sections connecting related pages
- Breadcrumb navigation
- Search within wiki

---

### 7. Individual Letter Pages

**Purpose:** The primary content view for reading a letter.

**Layout:**
- Letter metadata header: date, from, to, location
- Full letter text (preserving original formatting where meaningful)
- Entity links highlighted in text (people, places)
- Theme tags displayed
- Historical context panel (collapsible sidebar)

**Navigation:**
- Previous/Next letter (chronological)
- "More letters from this period"
- "More letters with this theme"
- Breadcrumbs back to archive/timeline

**Features:**
- Print-friendly view
- Share link
- "View on timeline" / "View on map" quick actions

---

## Information Architecture

```
Home
├── On This Day (widget)
├── Featured Letter
├── Quick Links to Timeline, Map, Archive
│
├── Timeline
│   └── [Interactive Timeline View]
│
├── Map
│   └── [Interactive Map View]
│
├── Archive
│   ├── Search
│   ├── Browse All Letters
│   └── Filter Panel
│
├── Letters (individual pages)
│   └── /letters/[date-slug]
│
├── Wiki
│   ├── People
│   │   └── /wiki/people/[person-slug]
│   ├── Places
│   │   └── /wiki/places/[place-slug]
│   ├── Themes
│   │   └── /wiki/themes/[theme-slug]
│   ├── Military Units
│   │   └── /wiki/units/[unit-slug]
│   └── Historical Events
│       └── /wiki/events/[event-slug]
│
└── About
    ├── The Donahue Family
    ├── About This Archive
    └── How to Use This Site
```

---

## Data Model

### Letter
```
{
  id: string,
  slug: string,                    // URL-friendly identifier
  date: Date,
  from: PersonReference,
  to: PersonReference[],
  location: PlaceReference | null, // Where written from
  subject: string | null,          // If letter has explicit subject
  excerpt: string,                 // First ~150 chars for previews
  content: string,                 // Full letter text (markdown)
  themes: ThemeReference[],
  people_mentioned: PersonReference[],
  places_mentioned: PlaceReference[],
  source: {
    type: 'original' | 'transcript' | 'telegram',
    page_in_pdf: number | null
  }
}
```

### Person
```
{
  id: string,
  slug: string,
  name: string,
  aliases: string[],               // Nicknames, alternate spellings
  relationship_to_john: string,
  birth_date: Date | null,
  death_date: Date | null,
  bio: string,                     // Markdown
  photo_url: string | null,
  military_info: {                 // If applicable
    rank: string,
    unit: UnitReference,
    service_dates: string
  } | null
}
```

### Place
```
{
  id: string,
  slug: string,
  name: string,
  aliases: string[],               // Alternate names, spellings
  coordinates: {
    lat: number,
    lng: number
  },
  type: 'city' | 'country' | 'region' | 'military_installation' | 'landmark',
  country: string,
  description: string,             // Markdown - historical context
  johns_description: string | null, // How John described it in letters
  photo_urls: string[]
}
```

### Theme
```
{
  id: string,
  slug: string,
  name: string,
  description: string,             // Markdown
  icon: string | null,             // For visual identification
  key_quotes: {
    quote: string,
    letter_id: string
  }[]
}
```

### HistoricalEvent
```
{
  id: string,
  slug: string,
  date: Date,
  end_date: Date | null,           // For events spanning time
  title: string,
  description: string,             // Markdown
  significance: string,            // Why it matters to this archive
  scope: 'world' | 'theater' | 'unit' | 'personal',
  related_letter_ids: string[]
}
```

### MilitaryUnit
```
{
  id: string,
  slug: string,
  designation: string,             // "985th Field Artillery Battalion"
  branch: string,                  // "US Army"
  parent_unit: UnitReference | null,
  description: string,             // Markdown
  timeline: {
    date: Date,
    event: string,
    location: PlaceReference | null
  }[]
}
```

### RouteSegment (for map visualization)
```
{
  id: string,
  from_place: PlaceReference,
  to_place: PlaceReference,
  start_date: Date,
  end_date: Date,
  description: string | null
}
```

---

## Technical Architecture

### Recommended Stack

**Framework:** Next.js 14+ (App Router)
- Static site generation for performance
- React Server Components for efficient rendering
- Built-in routing matches our information architecture
- Excellent SEO capabilities

**Styling:** Tailwind CSS
- Rapid development
- Consistent design system
- Responsive by default

**Content Management:** MDX + JSON
- Letters stored as MDX files (markdown with components)
- Entity data in JSON files
- Version controlled with Git
- Easy for non-technical family members to edit

**Search:** Pagefind or Fuse.js
- Client-side search (no server needed)
- Indexes at build time
- Fast, relevant results

**Maps:** Leaflet.js with OpenStreetMap
- Free and open source
- Good customization options
- Historical map tiles available

**Timeline:** Custom React component or vis-timeline
- Needs to handle dual-track display
- Zoom/pan interactions
- Responsive design

**Hosting:** Vercel or Netlify
- Free tier sufficient for family site
- Automatic deployments from Git
- Edge caching for performance

### Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home
│   ├── timeline/
│   ├── map/
│   ├── archive/
│   ├── letters/[slug]/
│   ├── wiki/
│   │   ├── people/[slug]/
│   │   ├── places/[slug]/
│   │   ├── themes/[slug]/
│   │   ├── units/[slug]/
│   │   └── events/[slug]/
│   └── about/
│
├── components/
│   ├── layout/
│   ├── timeline/
│   ├── map/
│   ├── search/
│   ├── letter/
│   └── wiki/
│
├── content/
│   ├── letters/                  # MDX files for each letter
│   ├── people/                   # JSON or MDX for each person
│   ├── places/                   # JSON for places
│   ├── themes/                   # JSON or MDX for themes
│   ├── events/                   # JSON for historical events
│   └── units/                    # JSON for military units
│
├── lib/
│   ├── content.ts                # Content loading utilities
│   ├── search.ts                 # Search indexing
│   └── dates.ts                  # Date utilities
│
├── public/
│   ├── images/
│   └── maps/
│
└── styles/
```

---

## Content Preparation

### Phase 1: Letter Extraction
1. Extract each letter from PDF into individual MDX files
2. Capture metadata: date, from, to, location (if stated)
3. Preserve original text with minimal formatting cleanup
4. Note source page number for reference

### Phase 2: Entity Identification
1. Create person entries for all named individuals
2. Create place entries for all locations mentioned
3. Define theme categories based on letter content
4. Extract historical events from timeline appendix

### Phase 3: Linking
1. Tag each letter with relevant themes
2. Link letters to people mentioned
3. Link letters to places mentioned
4. Associate historical events with date ranges

### Phase 4: Enrichment
1. Add biographical info for key people
2. Add historical context for places
3. Add coordinates for map visualization
4. Source period photographs if available

---

## Design Guidelines

### Visual Style
- Clean, readable typography (serif for letter content)
- Warm, archival color palette (sepia tones, muted colors)
- Generous whitespace
- Period-appropriate touches without being kitschy
- Mobile-first responsive design

### Typography
- Letter content: Serif font (e.g., Crimson Text, Libre Baskerville)
- UI elements: Clean sans-serif (e.g., Inter, Source Sans)
- Emphasis on readability over decoration

### Accessibility
- WCAG 2.1 AA compliance minimum
- Keyboard navigation throughout
- Screen reader compatible
- Sufficient color contrast
- Resizable text

---

## Future Enhancements (Post-MVP)

### Family Engagement
- **Annotations:** Family members can add comments/memories to letters
- **Voice Recordings:** Audio narrations of letters by family members
- **Family Tree:** Interactive visualization of family relationships
- **User Accounts:** Simple auth for family members

### Content Expansion
- **Photo Gallery:** Family photos from the era
- **Document Archive:** Other documents (telegrams already included, military records)
- **Oral Histories:** Recorded interviews with family members who remember John/Marie

### Technical Enhancements
- **Email Digests:** Weekly "On This Day" emails
- **Print Book:** Generate formatted PDF for physical printing
- **Offline Access:** PWA for offline reading
- **Multi-language:** If family spans languages

---

## Success Metrics

For a family project, success is qualitative:
- Family members actually use and explore the site
- Younger generations learn about their family history
- Content is preserved for future generations
- Family feels connected to their heritage

---

## Project Decisions

| Decision | Choice | Notes |
|----------|--------|-------|
| **Access** | Public | No authentication required. Anyone with URL can view. |
| **Photos** | Add later | Family has photos from era; will be added post-MVP. Build with photo support. |
| **Domain** | Decide later | Use Vercel subdomain initially (e.g., `donahue-letters.vercel.app`). |
| **Family Input** | Build MVP first | Get working prototype, then gather family feedback. |
| **Content Management** | GitHub files | MDX for letters, JSON for entities. Version controlled. |
| **Technical Approach** | AI-assisted | Maintain clean, well-documented code for AI-assisted development. |
| **Content Preparation** | Extract all now | All letters extracted from PDF into individual MDX files. |

---

## Appendix: Content Inventory

Based on the source PDF:

### Letters (approximate)
- ~50+ letters spanning 1943-1945
- Primarily from John to Marie
- Several to daughter Patsy
- A few Western Union telegrams
- Letters from Marquette University president

### Key People to Document
- Major/Lt. Col. John James Donahue (author)
- Marie Donahue (wife, primary recipient)
- Patsy Donahue (daughter)
- Military colleagues (as mentioned)
- Father O'Donnell (Marquette)

### Key Places to Map
- North Africa (staging areas)
- Cassino, Italy
- Rome, Italy (Papal audience)
- Naples region
- Various Italian towns mentioned
- Home locations (Wisconsin)

### Themes Identified in PDF
- Catholic faith and practice
- Family longing and domestic life
- Italian civilians and culture
- Military life and conditions
- War observations
- V-E Day and war's end
- Papal audience experience

### Historical Events
- Italian Campaign timeline
- Battle of Monte Cassino
- Liberation of Rome
- V-E Day (May 8, 1945)
- 985th Field Artillery Battalion movements
