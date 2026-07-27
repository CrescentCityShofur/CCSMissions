'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { SpecialistId } from '@/lib/ccs/content'
import { getChatEngine } from '@/lib/ccs/engine'
import { createInitialState } from '@/lib/ccs/scripted-engine'
import type { ChatMessage, ConversationState } from '@/lib/ccs/types'

type ChatContextValue = {
  state: ConversationState
  /** True while Taylor Made is composing a reply. */
  thinking: boolean
  /** Specialist currently being consulted behind the scenes, if any. */
  activeSpecialist: SpecialistId | null
  widgetOpen: boolean
  setWidgetOpen: (open: boolean) => void
  send: (text: string) => void
  /** Send a message and surface the conversation (used by service cards). */
  startWith: (text: string, options?: { focus?: 'widget' | 'hero' }) => void
  savingLead: boolean
  leadSaved: boolean
}

const ChatContext = createContext<ChatContextValue | null>(null)

const HERO_ANCHOR_ID = 'taylor-made-conversation'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const engine = useMemo(() => getChatEngine(), [])
  const [state, setState] = useState<ConversationState>(createInitialState)
  const [thinking, setThinking] = useState(false)
  const [activeSpecialist, setActiveSpecialist] = useState<SpecialistId | null>(
    null,
  )
  const [widgetOpen, setWidgetOpen] = useState(false)
  const [savingLead, setSavingLead] = useState(false)
  const [leadSaved, setLeadSaved] = useState(false)

  const stateRef = useRef(state)
  stateRef.current = state
  const busyRef = useRef(false)
  const idRef = useRef(0)
  const greetedRef = useRef(false)

  const makeMessage = useCallback(
    (
      role: ChatMessage['role'],
      text: string,
      specialist?: SpecialistId,
    ): ChatMessage => {
      idRef.current += 1
      return {
        id: `m${idRef.current}`,
        role,
        text,
        at: Date.now(),
        specialist,
      }
    },
    [],
  )

  const persistLead = useCallback(async (next: ConversationState) => {
    setSavingLead(true)
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: next.lead,
          summary: next.summary,
          specialistsConsulted: next.specialistsConsulted,
          transcript: next.messages.map((message) => ({
            role: message.role,
            text: message.text,
          })),
        }),
      })
      setLeadSaved(response.ok)
    } catch {
      setLeadSaved(false)
    } finally {
      setSavingLead(false)
    }
  }, [])

  /** Play a set of agent replies out with pacing + specialist indicators. */
  const playTurn = useCallback(
    async (
      replies: Awaited<ReturnType<typeof engine.send>>['replies'],
      turnState: ConversationState,
    ) => {
      let current = turnState
      for (const reply of replies) {
        setActiveSpecialist(reply.specialist ?? null)
        await sleep(reply.delay ?? 600)
        current = {
          ...current,
          messages: [
            ...current.messages,
            makeMessage('agent', reply.text, reply.specialist),
          ],
        }
        setState(current)
      }
      setActiveSpecialist(null)
      return current
    },
    [makeMessage],
  )

  const send = useCallback(
    (rawText: string) => {
      const text = rawText.trim()
      if (!text || busyRef.current) return
      busyRef.current = true
      setThinking(true)

      const withVisitor: ConversationState = {
        ...stateRef.current,
        messages: [
          ...stateRef.current.messages,
          makeMessage('visitor', text),
        ],
        quickReplies: [],
      }
      setState(withVisitor)

      void (async () => {
        try {
          const hadSummary = Boolean(withVisitor.summary)
          const turn = await engine.send(withVisitor, text)
          const final = await playTurn(turn.replies, turn.state)
          setState(final)
          if (final.summary && !hadSummary) void persistLead(final)
        } finally {
          setThinking(false)
          busyRef.current = false
        }
      })()
    },
    [engine, makeMessage, persistLead, playTurn],
  )

  const startWith = useCallback(
    (text: string, options?: { focus?: 'widget' | 'hero' }) => {
      if (options?.focus === 'widget') {
        setWidgetOpen(true)
      } else {
        const anchor = document.getElementById(HERO_ANCHOR_ID)
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          setWidgetOpen(true)
        }
      }
      send(text)
    },
    [send],
  )

  /* Greet once, on mount, so the visitor lands in an open conversation. */
  useEffect(() => {
    if (greetedRef.current) return
    greetedRef.current = true
    const turn = engine.greeting(stateRef.current)
    setThinking(true)
    void (async () => {
      const final = await playTurn(turn.replies, turn.state)
      setState(final)
      setThinking(false)
    })()
  }, [engine, playTurn])

  const value = useMemo<ChatContextValue>(
    () => ({
      state,
      thinking,
      activeSpecialist,
      widgetOpen,
      setWidgetOpen,
      send,
      startWith,
      savingLead,
      leadSaved,
    }),
    [
      state,
      thinking,
      activeSpecialist,
      widgetOpen,
      send,
      startWith,
      savingLead,
      leadSaved,
    ],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChat must be used inside <ChatProvider>')
  return context
}

export { HERO_ANCHOR_ID }
