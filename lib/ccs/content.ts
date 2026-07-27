/**
 * Single source of truth for CCS Missions marketing + agent knowledge.
 * Both the marketing sections and Taylor Made's scripted engine read from here,
 * so copy stays consistent across the site and the conversation.
 */

export const BRAND = {
  shortName: 'CCS',
  name: 'Coastal Consolidated Solutions LLC',
  program: 'CCS Missions',
  region: 'Gulf Coast · Louisiana',
  tagline: 'The modern path to a self-sufficient Louisiana.',
  email: 'missions@ccsmissions.com',
  phone: '(504) 555-0142',
} as const

export type ServiceId =
  | 'solar'
  | 'water'
  | 'humidity'
  | 'mobility'
  | 'hurricane'
  | 'stormwater'

export type SpecialistId = 'ahanu' | 'etienne' | 'clara' | 'gideon'

export type Specialist = {
  id: SpecialistId
  name: string
  domain: string
  /** Short line shown in the "consulting" indicator. */
  consultingLabel: string
}

/**
 * Behind-the-scenes specialists. Taylor Made is the only agent that ever
 * speaks to the visitor; these are surfaced only as subtle indicators.
 * Add new specialists here — the UI and engine pick them up automatically.
 */
export const SPECIALISTS: Record<SpecialistId, Specialist> = {
  ahanu: {
    id: 'ahanu',
    name: 'Ahanu',
    domain: 'Solar, microgrids & clean power',
    consultingLabel: 'checking solar and microgrid notes with Ahanu',
  },
  etienne: {
    id: 'etienne',
    name: 'Etienne',
    domain: 'Water filtration, rainwater & stormwater',
    consultingLabel: 'pulling water and drainage details from Etienne',
  },
  clara: {
    id: 'clara',
    name: 'Clara',
    domain: 'Humidity control, dehumidification & AWG',
    consultingLabel: 'confirming humidity and AWG specs with Clara',
  },
  gideon: {
    id: 'gideon',
    name: 'Gideon',
    domain: 'Mobility, charging & pricing',
    consultingLabel: 'reviewing mobility and pricing with Gideon',
  },
}

export type Service = {
  id: ServiceId
  title: string
  /** Octicon name resolved in the UI layer. */
  icon:
    | 'SunIcon'
    | 'BeakerIcon'
    | 'MeterIcon'
    | 'ZapIcon'
    | 'ShieldCheckIcon'
    | 'WorkflowIcon'
  blurb: string
  highlights: string[]
  specialist: SpecialistId
  /** Seeded into the conversation when a visitor opens this service. */
  chatSeed: string
}

export const SERVICES: Service[] = [
  {
    id: 'solar',
    title: 'Solar Canopy Microgrids',
    icon: 'SunIcon',
    blurb:
      'Canopy-mounted solar paired with battery storage so your property keeps its own lights on — and can eliminate the electric bill.',
    highlights: [
      'Solar canopies over parking, patios and equipment yards',
      'Battery storage sized for real Gulf Coast outages',
      'Microgrid controls that island your property automatically',
    ],
    specialist: 'ahanu',
    chatSeed: 'I want to learn about solar canopy microgrids for my property.',
  },
  {
    id: 'water',
    title: 'AWG & Clean Water',
    icon: 'BeakerIcon',
    blurb:
      'Atmospheric Water Generation turns Louisiana humidity into clean drinking water, backed by rainwater harvesting and filtration.',
    highlights: [
      'AWG units that pull drinking water straight from the air',
      'Rainwater harvesting with multi-stage filtration',
      'Water independence that survives a boil-water advisory',
    ],
    specialist: 'etienne',
    chatSeed: 'Tell me how atmospheric water generation would work here.',
  },
  {
    id: 'humidity',
    title: 'Humidity Solutions',
    icon: 'MeterIcon',
    blurb:
      'Whole-property humidity control that protects structures, equipment and air quality — and feeds your AWG system while it works.',
    highlights: [
      'Whole-home and commercial dehumidification',
      'Mold, warping and corrosion prevention',
      'Humidity captured as usable drinking water',
    ],
    specialist: 'clara',
    chatSeed: 'Humidity is a problem at my property. What can CCS do?',
  },
  {
    id: 'mobility',
    title: 'Mobility & Charging',
    icon: 'ZapIcon',
    blurb:
      'EV charging fed by your own canopy, plus mobility services that cut the gasoline line item out of your life entirely.',
    highlights: [
      'Solar-fed EV charging for homes and fleets',
      'Charging services for commercial and multi-unit sites',
      'A realistic path to no gasoline at all',
    ],
    specialist: 'gideon',
    chatSeed: 'I am interested in EV charging powered by solar.',
  },
  {
    id: 'stormwater',
    title: 'Stormwater Solutions',
    icon: 'WorkflowIcon',
    blurb:
      'Drainage, retention and reuse engineered for Louisiana rainfall, so the water that used to flood you becomes a resource.',
    highlights: [
      'Site drainage and retention design',
      'Capture and reuse instead of runoff',
      'Coordinated with your water and solar systems',
    ],
    specialist: 'etienne',
    chatSeed: 'My property has drainage and stormwater problems.',
  },
  {
    id: 'hurricane',
    title: 'Hurricane Protection',
    icon: 'ShieldCheckIcon',
    blurb:
      'Membership plans that put you at the front of the response line before the storm ever forms.',
    highlights: [
      'Tier 1 — priority rapid response, $150/year',
      'Tier 2 — full inspection, estimates and insurance coordination, $400/year',
      'Complete post-hurricane documentation and support',
    ],
    specialist: 'gideon',
    chatSeed: 'I want to hear about the Hurricane Protection plans.',
  },
]

export type TierId = 'tier1' | 'tier2'

export type Tier = {
  id: TierId
  name: string
  price: number
  priceLabel: string
  cadence: string
  summary: string
  features: string[]
  recommended?: boolean
}

export const TIERS: Tier[] = [
  {
    id: 'tier1',
    name: 'Tier 1 — Rapid Response',
    price: 150,
    priceLabel: '$150',
    cadence: 'per year, due at the start of hurricane season',
    summary:
      'Priority rapid response for emergency services when the storm has already passed and every crew in the parish is booked.',
    features: [
      'Priority rapid-response queue placement',
      'Emergency tarping',
      'Emergency roof repairs',
      'Tree and debris removal',
      'Direct line to the CCS Missions response desk',
    ],
  },
  {
    id: 'tier2',
    name: 'Tier 2 — Comprehensive',
    price: 400,
    priceLabel: '$400',
    cadence: 'per year, due at the start of hurricane season',
    summary:
      'Everything in Tier 1, plus the inspection, estimating, insurance and documentation work that decides how much you actually recover.',
    features: [
      'Everything included in Tier 1',
      'Full property inspection',
      'Written repair estimates',
      'Ability to book vetted professionals through CCS',
      'Direct coordination with your insurance agent',
      'Complete post-hurricane documentation and support',
    ],
    recommended: true,
  },
]

export const VISION_POINTS = [
  {
    title: 'No electric bill',
    body: 'Full solar-powered living, sized so the meter stops being someone else’s decision.',
  },
  {
    title: 'No gasoline',
    body: 'Solar and battery power that runs the home, the EVs and the AWG machines from the same canopy.',
  },
  {
    title: 'No dirty water',
    body: 'Atmospheric Water Generation and rainwater harvesting for true water independence.',
  },
  {
    title: 'Food that keeps growing',
    body: 'Clean water systems that make growing food at home practical year-round.',
  },
  {
    title: 'Nothing wasted',
    body: 'Recycling uncommon materials — batteries and car tires included — instead of shipping them off.',
  },
  {
    title: 'Ready for the next one',
    body: 'Resilience planning so hurricane season is a schedule, not a crisis.',
  },
] as const
