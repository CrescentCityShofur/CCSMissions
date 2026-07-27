import { SERVICES, TIERS, type ServiceId, type SpecialistId } from './content'
import { buildSummary, isSummaryWorthwhile } from './summary'
import {
  COMMANDS,
  type AgentReply,
  type ChatEngine,
  type ConversationState,
  type EngineTurn,
  type LeadFieldId,
  type QuickReply,
} from './types'

/* -------------------------------------------------------------------------- */
/* Knowledge: how Taylor Made answers each subject                             */
/* -------------------------------------------------------------------------- */

type Topic = {
  id: ServiceId
  specialist: SpecialistId
  keywords: string[]
  reply: string
}

const TOPICS: Topic[] = [
  {
    id: 'solar',
    specialist: 'ahanu',
    keywords: [
      'solar',
      'panel',
      'microgrid',
      'grid',
      'battery',
      'power',
      'electric bill',
      'electricity',
      'outage',
      'generator',
    ],
    reply:
      'Here is the short version: we build solar canopies — over parking, patios, equipment yards — and pair them with battery storage and microgrid controls. When the utility drops, your property islands itself and keeps running instead of waiting on a generator and a gas can. Sized right, that canopy is what finally ends the electric bill rather than just trimming it.',
  },
  {
    id: 'water',
    specialist: 'etienne',
    keywords: [
      'water',
      'awg',
      'atmospheric',
      'drinking',
      'well',
      'rainwater',
      'rain',
      'filtration',
      'filter',
      'boil',
    ],
    reply:
      'Louisiana air is the resource nobody bills you for. Atmospheric Water Generation condenses that humidity and filters it into clean drinking water, and we back it with rainwater harvesting so you have volume for irrigation and household use. Run it off your own solar and a boil-water advisory stops being your problem.',
  },
  {
    id: 'humidity',
    specialist: 'clara',
    keywords: [
      'humid',
      'humidity',
      'mold',
      'mildew',
      'damp',
      'moisture',
      'dehumidif',
      'air quality',
      'musty',
      'warping',
    ],
    reply:
      'Humidity down here is not a comfort issue, it is a structural one — mold, warped trim, corroded equipment, air that never feels clean. We design whole-property dehumidification around how your building actually breathes, and the water we pull out gets routed into the AWG side instead of down a drain.',
  },
  {
    id: 'mobility',
    specialist: 'gideon',
    keywords: [
      'ev',
      'charger',
      'charging',
      'car',
      'truck',
      'fleet',
      'gas',
      'gasoline',
      'tesla',
      'mobility',
    ],
    reply:
      'Charging is where the canopy pays you twice. The same array that powers the house feeds your EV charger, so the miles come off your roof instead of a pump. For commercial and multi-unit sites we set up shared charging that residents or crews can actually depend on.',
  },
  {
    id: 'stormwater',
    specialist: 'etienne',
    keywords: [
      'storm water',
      'stormwater',
      'flood',
      'flooding',
      'drain',
      'drainage',
      'runoff',
      'yard',
      'standing water',
      'retention',
    ],
    reply:
      'We treat drainage as capture, not disposal. That means grading, retention and conveyance sized for real Louisiana rainfall, then routing what we hold into reuse — irrigation, wash-down, storage. The water that used to sit in your yard becomes part of the system.',
  },
  {
    id: 'hurricane',
    specialist: 'gideon',
    keywords: [
      'hurricane',
      'storm',
      'tarp',
      'roof',
      'tree',
      'insurance',
      'claim',
      'protection plan',
      'tier',
      'season',
      'damage',
    ],
    reply:
      'This is the CCS Missions Hurricane Protection program, and it is the one thing I tell everyone on the coast to lock in early. Tier 1 is $150 a year and buys you priority rapid response — tarping, emergency roof repairs, tree and debris removal — ahead of everyone calling around after landfall. Tier 2 is $400 a year and adds the part that decides your recovery: full property inspection, written repair estimates, booking vetted professionals through us, direct coordination with your insurance agent, and complete post-hurricane documentation.',
  },
]

const VISION_REPLY =
  'The bigger picture we are building toward is a self-sufficient Louisiana: full solar-powered living with no electric bill, batteries that run the home, the EVs and the water machines, atmospheric water generation and rainwater harvesting so the water is clean and yours, food growing on that water, and even the awkward materials — batteries, car tires — recycled instead of dumped. No gasoline, no electric bill, no dirty water. Most families start with one piece of that and grow into it.'

const CONSULT_REPLY =
  'Let us get eyes on the property. A site assessment covers roof and canopy potential, your electrical service, humidity and drainage conditions, and what a phased build would actually cost. I can hand your details to the CCS Missions team and they will reach out to schedule.'

/* -------------------------------------------------------------------------- */
/* Progressive data collection                                                 */
/* -------------------------------------------------------------------------- */

type Slot = {
  id: LeadFieldId
  question: string
  quickReplies?: QuickReply[]
}

const SLOTS: Slot[] = [
  {
    id: 'fullName',
    question: 'Before we go further — what should I call you?',
  },
  {
    id: 'email',
    question:
      'What is the best email for you? That is where your summary and any estimates land.',
  },
  {
    id: 'location',
    question:
      'Where is the property? City or ZIP is plenty for now, a full address if you have it handy.',
  },
  {
    id: 'propertyType',
    question: 'And is this a residential, commercial, or multi-unit property?',
    quickReplies: [
      { label: 'Residential', value: 'Residential' },
      { label: 'Commercial', value: 'Commercial' },
      { label: 'Multi-unit', value: 'Multi-unit' },
    ],
  },
  {
    id: 'primaryNeeds',
    question:
      'In your own words, what is the thing you most want fixed or changed at that property?',
  },
  {
    id: 'timeline',
    question: 'What kind of timeline are you working with?',
    quickReplies: [
      { label: 'Right away', value: 'As soon as possible' },
      { label: '1-3 months', value: 'Within 1 to 3 months' },
      { label: '3-12 months', value: 'Within 3 to 12 months' },
      { label: 'Just researching', value: 'Just researching for now' },
    ],
  },
  {
    id: 'phone',
    question:
      'What is a good phone number, in case the team needs to talk through the site details?',
  },
  {
    id: 'budget',
    question:
      'Do you have a budget range in mind? Totally fine to skip this one — it just helps us phase the build sensibly.',
    quickReplies: [
      { label: 'Under $10k', value: 'Under $10,000' },
      { label: '$10k - $30k', value: '$10,000 to $30,000' },
      { label: '$30k - $75k', value: '$30,000 to $75,000' },
      { label: '$75k+', value: '$75,000 or more' },
      { label: 'Rather not say', value: 'Prefer not to share' },
    ],
  },
  {
    id: 'hurricaneInterest',
    question:
      'Last practical question: do you want to be covered under Hurricane Protection this season?',
    quickReplies: [
      { label: 'Tier 1 — $150', value: 'Tier 1' },
      { label: 'Tier 2 — $400', value: 'Tier 2' },
      { label: 'Not right now', value: 'Not interested right now' },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const EMAIL_RE = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i
const PHONE_RE = /(\+?1[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}/

function cleanName(raw: string): string {
  const stripped = raw
    .replace(/^(hi|hey|hello)[,!\s]*/i, '')
    .replace(/\b(my name is|my name's|i am|i'm|im|this is|it's|its|call me)\b/gi, '')
    .replace(/[.!]+$/, '')
    .trim()
  const candidate = stripped || raw.trim()
  return candidate
    .split(/\s+/)
    .slice(0, 4)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function detectTopics(text: string): Topic[] {
  const haystack = ` ${text.toLowerCase()} `
  return TOPICS.filter((topic) =>
    topic.keywords.some((keyword) => haystack.includes(keyword)),
  )
}

function detectTier(text: string): 'tier1' | 'tier2' | null {
  const value = text.toLowerCase()
  if (/tier\s*2|\$?400|comprehensive/.test(value)) return 'tier2'
  if (/tier\s*1|\$?150|rapid response/.test(value)) return 'tier1'
  return null
}

function isDeclining(text: string): boolean {
  return /\b(no|nope|not now|not interested|skip|rather not|pass|maybe later|prefer not)\b/i.test(
    text,
  )
}

function nextSlot(state: ConversationState): Slot | null {
  return (
    SLOTS.find(
      (slot) => !state.lead[slot.id] && !state.askedFields.includes(slot.id),
    ) ?? null
  )
}

function buildQuickReplies(
  state: ConversationState,
  slot: Slot | null,
): QuickReply[] {
  if (slot?.quickReplies) return slot.quickReplies

  const options: QuickReply[] = []
  const uncovered = SERVICES.filter(
    (service) =>
      service.id !== 'hurricane' && !state.topicsCovered.includes(service.id),
  ).slice(0, 2)

  for (const service of uncovered) {
    options.push({ label: service.title, value: service.chatSeed })
  }

  if (!state.topicsCovered.includes('hurricane')) {
    options.push({
      label: 'Hurricane Protection plans',
      value: 'Tell me about the Hurricane Protection plans.',
    })
  }
  if (!state.educated) {
    options.push({ label: 'The bigger vision', value: COMMANDS.vision })
  }
  if (state.tierInterest) {
    const tier = TIERS.find((t) => t.id === state.tierInterest)
    options.push({
      label: `Enroll in ${tier?.name.split('—')[0].trim()}`,
      value: state.tierInterest === 'tier2' ? COMMANDS.tier2 : COMMANDS.tier1,
    })
  }
  options.push({ label: 'Book a site assessment', value: COMMANDS.consult })
  if (isSummaryWorthwhile(state) && !state.summary) {
    options.push({ label: 'Send me my summary', value: COMMANDS.summary })
  }
  return options.slice(0, 5)
}

/* -------------------------------------------------------------------------- */
/* Engine                                                                      */
/* -------------------------------------------------------------------------- */

export function createInitialState(): ConversationState {
  return {
    messages: [],
    lead: {},
    pendingField: null,
    askedFields: [],
    topicsCovered: [],
    specialistsConsulted: [],
    quickReplies: [],
    exchanges: 0,
    tierInterest: null,
    educated: false,
    summary: null,
  }
}

export const scriptedEngine: ChatEngine = {
  id: 'scripted',

  greeting(state) {
    const quickReplies: QuickReply[] = [
      { label: 'Cut my electric bill', value: SERVICES[0].chatSeed },
      { label: 'Clean water from the air', value: SERVICES[1].chatSeed },
      {
        label: 'Hurricane Protection plans',
        value: 'Tell me about the Hurricane Protection plans.',
      },
      { label: 'The bigger vision', value: COMMANDS.vision },
    ]

    return {
      replies: [
        {
          text: "Hi, I'm Taylor Made with Coastal Consolidated Solutions. I help Gulf Coast families and businesses get off the grid's schedule — solar canopies, clean water out of the air, humidity under control, and a real plan for hurricane season.",
          delay: 400,
        },
        {
          text: 'No forms here. Just tell me what is going on at your property and I will take it from there. What brought you in today?',
          delay: 900,
        },
      ],
      state: { ...state, quickReplies },
    }
  },

  async send(previous, rawText) {
    const text = rawText.trim()
    let state: ConversationState = {
      ...previous,
      lead: { ...previous.lead },
      exchanges: previous.exchanges + 1,
      quickReplies: [],
    }
    const replies: AgentReply[] = []

    /* --- Commands from quick replies ------------------------------------- */

    if (text === COMMANDS.vision) {
      state = { ...state, educated: true }
      replies.push({ text: VISION_REPLY, delay: 700 })
      return finish(state, replies)
    }

    if (text === COMMANDS.consult) {
      replies.push({ text: CONSULT_REPLY, specialist: 'gideon', delay: 700 })
      return finish(state, replies)
    }

    if (text === COMMANDS.tier1 || text === COMMANDS.tier2) {
      const tierId = text === COMMANDS.tier2 ? 'tier2' : 'tier1'
      const tier = TIERS.find((t) => t.id === tierId)
      state = {
        ...state,
        tierInterest: tierId,
        lead: {
          ...state.lead,
          hurricaneInterest: `${tier?.name} (${tier?.priceLabel}/year)`,
        },
      }
      replies.push({
        text: `Locking in ${tier?.name} at ${tier?.priceLabel} for the year. Use the secure checkout on the Hurricane Protection section and your coverage starts as soon as it clears — I will note it on your file either way.`,
        specialist: 'gideon',
        delay: 600,
      })
      return finish(state, replies)
    }

    if (text === COMMANDS.summary) {
      return summarize(state, replies)
    }

    /* --- Answer to a question Taylor Made asked -------------------------- */

    if (state.pendingField) {
      const field = state.pendingField
      const skipped = isDeclining(text) && text.length < 40

      if (field === 'email' && !skipped && !EMAIL_RE.test(text)) {
        replies.push({
          text: 'I want to make sure that reaches you — could you give me the email again, like name@domain.com?',
          delay: 500,
        })
        return finish(state, replies, { keepPending: true })
      }

      if (!skipped) {
        let value = text
        if (field === 'fullName') value = cleanName(text)
        if (field === 'email') value = (text.match(EMAIL_RE) ?? [text])[0]
        if (field === 'phone') value = (text.match(PHONE_RE) ?? [text])[0]
        if (field === 'hurricaneInterest') {
          const tier = detectTier(text)
          if (tier) {
            const found = TIERS.find((t) => t.id === tier)
            value = `${found?.name} (${found?.priceLabel}/year)`
            state = { ...state, tierInterest: tier }
          } else {
            value = 'Not interested at this time'
          }
        }
        state = { ...state, lead: { ...state.lead, [field]: value } }
        replies.push({ text: acknowledge(field, state), delay: 450 })
      } else {
        replies.push({
          text: 'No problem at all, we can leave that blank.',
          delay: 400,
        })
      }
      state = { ...state, pendingField: null }
    }

    /* --- Subject matter -------------------------------------------------- */

    const topics = detectTopics(text).slice(0, 2)
    if (topics.length > 0) {
      const covered = new Set(state.topicsCovered)
      const consulted = new Set(state.specialistsConsulted)
      for (const topic of topics) {
        replies.push({
          text: topic.reply,
          specialist: topic.specialist,
          delay: 900,
        })
        covered.add(topic.id)
        consulted.add(topic.specialist)
      }
      state = {
        ...state,
        topicsCovered: [...covered],
        specialistsConsulted: [...consulted],
      }

      const tier = detectTier(text)
      if (tier) state = { ...state, tierInterest: tier }

      if (!state.lead.primaryNeeds && !state.askedFields.includes('primaryNeeds')) {
        state = {
          ...state,
          lead: { ...state.lead, primaryNeeds: text.slice(0, 400) },
        }
      }
    } else if (replies.length === 0) {
      replies.push({
        text: state.educated
          ? 'Got it — tell me a little more about the property and I will point you at the right piece of this. Power, water, humidity, drainage, charging, storm season: any of those is a good starting thread.'
          : 'That helps. Most people come to us for one specific headache — the bill, the water, the humidity, the drainage, or hurricane season — and then realize those systems all feed each other.',
        delay: 700,
      })
      if (!state.educated) {
        state = { ...state, educated: true }
        replies.push({ text: VISION_REPLY, delay: 1000 })
      }
    }

    /* --- Sell the plans when the moment is right ------------------------- */

    if (
      !state.topicsCovered.includes('hurricane') &&
      state.exchanges >= 4 &&
      !state.tierInterest
    ) {
      const hurricane = TOPICS.find((t) => t.id === 'hurricane')
      if (hurricane) {
        replies.push({
          text: 'One thing I would be doing you a disservice not to mention: whatever we build, hurricane season still comes. Tier 1 at $150 a year keeps you in the priority response line for tarping, emergency roof work and tree removal. Tier 2 at $400 adds full inspection, written estimates, insurance coordination and complete documentation.',
          specialist: 'gideon',
          delay: 1100,
        })
        state = {
          ...state,
          topicsCovered: [...state.topicsCovered, 'hurricane'],
          specialistsConsulted: [
            ...new Set([...state.specialistsConsulted, 'gideon' as const]),
          ],
        }
      }
    }

    /* --- Offer to wrap up ------------------------------------------------ */

    if (
      isSummaryWorthwhile(state) &&
      !state.summary &&
      nextSlot(state) === null
    ) {
      replies.push({
        text: 'I think I have what the team needs. Want me to put together your summary so a CCS Missions specialist can pick this up?',
        delay: 800,
      })
      return finish(state, replies)
    }

    return finish(state, replies)
  },
}

/* -------------------------------------------------------------------------- */
/* Turn assembly                                                               */
/* -------------------------------------------------------------------------- */

function acknowledge(field: LeadFieldId, state: ConversationState): string {
  switch (field) {
    case 'fullName':
      return `Good to meet you, ${state.lead.fullName}.`
    case 'email':
      return 'Perfect, I have that on your file.'
    case 'phone':
      return 'Noted — the team will use that only for scheduling.'
    case 'location':
      return `${state.lead.location} — we work that area regularly.`
    case 'propertyType':
      return `A ${String(state.lead.propertyType).toLowerCase()} property, understood.`
    case 'primaryNeeds':
      return 'That is exactly the kind of detail that shapes the design.'
    case 'timeline':
      return 'Thanks — that tells me how to phase this.'
    case 'budget':
      return 'Appreciate you sharing that.'
    case 'hurricaneInterest':
      return state.tierInterest
        ? 'Smart call. I have that flagged on your file.'
        : 'Understood, I will leave the plans off your file for now.'
    default:
      return 'Got it.'
  }
}

function finish(
  state: ConversationState,
  replies: AgentReply[],
  options?: { keepPending?: boolean },
): EngineTurn {
  if (options?.keepPending) {
    return {
      replies,
      state: { ...state, quickReplies: buildQuickReplies(state, null) },
    }
  }

  const slot = state.exchanges >= 1 ? nextSlot(state) : null
  let next = state

  if (slot) {
    replies.push({ text: slot.question, delay: 800 })
    next = {
      ...state,
      pendingField: slot.id,
      askedFields: [...state.askedFields, slot.id],
    }
  }

  return { replies, state: { ...next, quickReplies: buildQuickReplies(next, slot) } }
}

function summarize(
  state: ConversationState,
  replies: AgentReply[],
): EngineTurn {
  const summary = buildSummary(state)
  const next: ConversationState = { ...state, summary, pendingField: null }

  replies.push({
    text: `Here is what I am sending over for ${state.lead.fullName ?? 'you'} — a CCS Missions specialist will follow up personally.`,
    delay: 600,
  })

  return {
    replies,
    state: {
      ...next,
      quickReplies: [
        { label: 'Book a site assessment', value: COMMANDS.consult },
        { label: 'Enroll in Tier 2 — $400', value: COMMANDS.tier2 },
        { label: 'Enroll in Tier 1 — $150', value: COMMANDS.tier1 },
      ],
    },
  }
}
