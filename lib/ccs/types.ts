import type { ServiceId, SpecialistId, TierId } from './content'

export type MessageRole = 'agent' | 'visitor'

export type ChatMessage = {
  id: string
  role: MessageRole
  text: string
  at: number
  /** Set when this reply was informed by a behind-the-scenes specialist. */
  specialist?: SpecialistId
}

export type LeadFieldId =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'location'
  | 'propertyType'
  | 'primaryNeeds'
  | 'timeline'
  | 'budget'
  | 'hurricaneInterest'
  | 'notes'

export type Lead = Partial<Record<LeadFieldId, string>>

export type QuickReply = {
  label: string
  /** Sent to the engine as if the visitor typed it. */
  value: string
}

export type ConversationState = {
  messages: ChatMessage[]
  lead: Lead
  /** Field the last agent message asked for, if any. */
  pendingField: LeadFieldId | null
  askedFields: LeadFieldId[]
  topicsCovered: ServiceId[]
  specialistsConsulted: SpecialistId[]
  quickReplies: QuickReply[]
  /** Count of visitor turns — drives pacing of data collection. */
  exchanges: number
  tierInterest: TierId | null
  educated: boolean
  summary: string | null
}

/** A single agent utterance, optionally attributed to a specialist. */
export type AgentReply = {
  text: string
  specialist?: SpecialistId
  /** Simulated thinking time in ms before this reply appears. */
  delay?: number
}

export type EngineTurn = {
  replies: AgentReply[]
  state: ConversationState
}

/**
 * Swappable conversation backend. `scripted` ships today; a Vapi (or any
 * network/LLM) engine can drop in without touching the UI, and the same
 * interface leaves room for a future voice channel.
 */
export interface ChatEngine {
  id: string
  greeting(state: ConversationState): EngineTurn
  send(state: ConversationState, text: string): Promise<EngineTurn>
}

/** Command values used by quick replies (never typed by a visitor). */
export const COMMANDS = {
  summary: '__summary__',
  consult: '__consult__',
  tier1: '__tier1__',
  tier2: '__tier2__',
  vision: '__vision__',
} as const
