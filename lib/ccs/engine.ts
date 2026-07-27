import { scriptedEngine } from './scripted-engine'
import { vapiEngine } from './vapi-engine'
import type { ChatEngine } from './types'

/**
 * Chat backend selection. Set NEXT_PUBLIC_CHAT_ENGINE="vapi" once the Vapi
 * endpoint is live; everything else in the app is backend-agnostic.
 */
export function getChatEngine(): ChatEngine {
  return process.env.NEXT_PUBLIC_CHAT_ENGINE === 'vapi'
    ? vapiEngine
    : scriptedEngine
}

export { scriptedEngine, vapiEngine }
