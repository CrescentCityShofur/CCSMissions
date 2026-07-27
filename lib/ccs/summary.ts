import { SERVICES, SPECIALISTS, TIERS } from './content'
import type { ConversationState, LeadFieldId } from './types'

const FIELD_LABELS: Record<LeadFieldId, string> = {
  fullName: 'Name',
  email: 'Email',
  phone: 'Phone',
  location: 'Location',
  propertyType: 'Property type',
  primaryNeeds: 'Primary needs',
  timeline: 'Timeline',
  budget: 'Budget',
  hurricaneInterest: 'Hurricane Protection',
  notes: 'Notes',
}

const FIELD_ORDER: LeadFieldId[] = [
  'fullName',
  'email',
  'phone',
  'location',
  'propertyType',
  'primaryNeeds',
  'timeline',
  'budget',
  'hurricaneInterest',
  'notes',
]

/**
 * Email-ready plain-text summary of a Taylor Made conversation.
 * Kept as text so it can be dropped straight into an email body.
 */
export function buildSummary(state: ConversationState): string {
  const lines: string[] = []
  const stamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  lines.push('CCS MISSIONS — NEW LEAD SUMMARY')
  lines.push(`Captured by Taylor Made · ${stamp}`)
  lines.push('')
  lines.push('CONTACT & PROPERTY')
  for (const field of FIELD_ORDER) {
    const value = state.lead[field]
    if (value) lines.push(`  ${FIELD_LABELS[field]}: ${value}`)
  }

  const missing = FIELD_ORDER.filter((f) => f !== 'notes' && !state.lead[f])
  if (missing.length > 0) {
    lines.push('')
    lines.push(`  Not shared: ${missing.map((f) => FIELD_LABELS[f]).join(', ')}`)
  }

  if (state.topicsCovered.length > 0) {
    lines.push('')
    lines.push('SERVICES DISCUSSED')
    for (const id of state.topicsCovered) {
      const service = SERVICES.find((s) => s.id === id)
      if (service) lines.push(`  - ${service.title}`)
    }
  }

  if (state.tierInterest) {
    const tier = TIERS.find((t) => t.id === state.tierInterest)
    lines.push('')
    lines.push('HURRICANE PROTECTION')
    lines.push(`  Interested in: ${tier?.name} (${tier?.priceLabel}/year)`)
  }

  if (state.specialistsConsulted.length > 0) {
    lines.push('')
    lines.push('SPECIALISTS CONSULTED')
    for (const id of state.specialistsConsulted) {
      const specialist = SPECIALISTS[id]
      lines.push(`  - ${specialist.name} — ${specialist.domain}`)
    }
  }

  lines.push('')
  lines.push('TRANSCRIPT')
  for (const message of state.messages) {
    const who = message.role === 'agent' ? 'Taylor Made' : 'Visitor'
    lines.push(`  ${who}: ${message.text}`)
  }

  return lines.join('\n')
}

/** Has the visitor shared enough for the summary to be worth sending? */
export function isSummaryWorthwhile(state: ConversationState): boolean {
  const { fullName, email, phone } = state.lead
  return Boolean(fullName && (email || phone)) && state.exchanges >= 3
}
