import { scriptedEngine } from './scripted-engine'
import type { ChatEngine, ConversationState } from './types'

/**
 * Vapi-backed engine (drop-in).
 *
 * The UI never talks to a provider directly — it only talks to this interface,
 * so wiring Vapi (or any LLM/voice backend) is a matter of implementing `send`
 * and pointing NEXT_PUBLIC_CHAT_ENGINE at "vapi".
 *
 * TODO (backend): create `app/api/chat/route.ts` that forwards the transcript
 * to Vapi with the Taylor Made assistant + tool definitions for the Ahanu /
 * Etienne / Clara / Gideon specialists, and returns:
 *   { replies: AgentReply[], lead: Lead, specialistsConsulted: SpecialistId[] }
 * The same endpoint can later be swapped to Vapi's voice transport without any
 * UI change, because messages and lead state already live in ConversationState.
 */
export const vapiEngine: ChatEngine = {
  id: 'vapi',

  greeting(state) {
    // The greeting is deterministic copy, so reuse it verbatim.
    return scriptedEngine.greeting(state)
  },

  async send(state: ConversationState, text: string) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: state.messages,
        lead: state.lead,
        text,
      }),
    })

    if (!response.ok) {
      // Never leave the visitor stranded — fall back to the scripted flow.
      return scriptedEngine.send(state, text)
    }

    const data = (await response.json()) as {
      replies?: { text: string; specialist?: string }[]
      lead?: ConversationState['lead']
      specialistsConsulted?: ConversationState['specialistsConsulted']
    }

    return {
      replies: (data.replies ?? []).map((reply) => ({
        text: reply.text,
        specialist: reply.specialist as never,
        delay: 600,
      })),
      state: {
        ...state,
        lead: { ...state.lead, ...(data.lead ?? {}) },
        specialistsConsulted: [
          ...new Set([
            ...state.specialistsConsulted,
            ...(data.specialistsConsulted ?? []),
          ]),
        ],
      },
    }
  },
}
