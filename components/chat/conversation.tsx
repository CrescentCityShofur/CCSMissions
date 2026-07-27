'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Button,
  FormControl,
  IconButton,
  Label,
  Spinner,
  Stack,
  Text,
  TextInput,
} from '@primer/react'
import { CheckIcon, CopyIcon, PaperAirplaneIcon } from '@primer/octicons-react'
import { SPECIALISTS, type SpecialistId } from '@/lib/ccs/content'
import type { ChatMessage } from '@/lib/ccs/types'
import { useChat } from './chat-provider'

function AgentAvatar({ size = 32 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 'var(--borderRadius-full)',
        backgroundColor: 'var(--bgColor-done-emphasis)',
        color: 'var(--fgColor-onEmphasis)',
        boxShadow: 'inset 0 0 0 1px var(--borderColor-attention-emphasis)',
        fontSize: 'var(--text-caption-size)',
        fontWeight: 700,
        letterSpacing: '0.04em',
      }}
    >
      TM
    </span>
  )
}

function Bubble({ message }: { message: ChatMessage }) {
  const isAgent = message.role === 'agent'
  const specialist = message.specialist
    ? SPECIALISTS[message.specialist as SpecialistId]
    : null

  return (
    <Stack
      direction="horizontal"
      gap="condensed"
      align="start"
      justify={isAgent ? 'start' : 'end'}
      wrap="nowrap"
    >
      {isAgent ? <AgentAvatar /> : null}
      <div
        style={{
          maxWidth: '86%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isAgent ? 'flex-start' : 'flex-end',
          gap: 'var(--base-size-4)',
        }}
      >
        <div
          style={{
            backgroundColor: isAgent
              ? 'var(--bgColor-muted)'
              : 'var(--bgColor-accent-muted)',
            border: `1px solid ${
              isAgent
                ? 'var(--borderColor-default)'
                : 'var(--borderColor-accent-emphasis)'
            }`,
            borderRadius: 'var(--borderRadius-large)',
            padding: 'var(--base-size-12) var(--base-size-16)',
          }}
        >
          <Text
            size="medium"
            style={{ display: 'block', lineHeight: 1.55, whiteSpace: 'pre-line' }}
          >
            {message.text}
          </Text>
        </div>
        {specialist ? (
          <Label variant="done" size="small">
            {`Informed by ${specialist.name} · ${specialist.domain}`}
          </Label>
        ) : null}
      </div>
    </Stack>
  )
}

function ThinkingRow() {
  const { activeSpecialist } = useChat()
  const specialist = activeSpecialist ? SPECIALISTS[activeSpecialist] : null

  return (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="nowrap">
      <AgentAvatar />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--base-size-8)',
          backgroundColor: 'var(--bgColor-muted)',
          border: '1px solid var(--borderColor-default)',
          borderRadius: 'var(--borderRadius-large)',
          padding: 'var(--base-size-8) var(--base-size-16)',
        }}
      >
        <Spinner size="small" srText={null} />
        <Text size="small" style={{ color: 'var(--fgColor-muted)' }}>
          {specialist
            ? `Taylor Made is ${specialist.consultingLabel}…`
            : 'Taylor Made is typing…'}
        </Text>
      </div>
    </Stack>
  )
}

function SummaryCard() {
  const { state, savingLead, leadSaved } = useChat()
  const [copied, setCopied] = useState(false)

  if (!state.summary) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(state.summary ?? '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bgColor-inset)',
        border: '1px solid var(--borderColor-attention-emphasis)',
        borderRadius: 'var(--borderRadius-large)',
      }}
    >
      <Stack direction="vertical" gap="condensed" padding="normal">
        <Stack
          direction="horizontal"
          gap="condensed"
          align="center"
          justify="space-between"
          wrap="wrap"
        >
          <Stack direction="horizontal" gap="condensed" align="center">
            <Text size="small" weight="semibold">
              Lead summary for the CCS Missions team
            </Text>
            {savingLead ? (
              <Label variant="secondary" size="small">
                Saving
              </Label>
            ) : leadSaved ? (
              <Label variant="success" size="small">
                Saved
              </Label>
            ) : null}
          </Stack>
          <Button
            size="small"
            leadingVisual={copied ? CheckIcon : CopyIcon}
            onClick={copy}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </Stack>
        <pre
          style={{
            margin: 0,
            maxHeight: 240,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--fontStack-monospace)',
            fontSize: 'var(--text-codeBlock-size)',
            color: 'var(--fgColor-muted)',
          }}
        >
          {state.summary}
        </pre>
      </Stack>
    </div>
  )
}

export function Conversation({ height = 460 }: { height?: number }) {
  const { state, thinking, send } = useChat()
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [state.messages, thinking, state.summary])

  const submit = () => {
    if (!draft.trim() || thinking) return
    send(draft)
    setDraft('')
  }

  return (
    <Stack direction="vertical" gap="condensed">
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with Taylor Made"
        style={{ height, overflowY: 'auto', padding: 'var(--base-size-4)' }}
      >
        <Stack direction="vertical" gap="normal">
          {state.messages.map((message) => (
            <Bubble key={message.id} message={message} />
          ))}
          {thinking ? <ThinkingRow /> : null}
          <SummaryCard />
        </Stack>
      </div>

      {state.quickReplies.length > 0 && !thinking ? (
        <Stack direction="horizontal" gap="condensed" wrap="wrap">
          {state.quickReplies.map((reply) => (
            <Button
              key={reply.value}
              size="small"
              onClick={() => send(reply.value)}
            >
              {reply.label}
            </Button>
          ))}
        </Stack>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <Stack
          direction="horizontal"
          gap="condensed"
          align="center"
          wrap="nowrap"
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <FormControl>
              <FormControl.Label visuallyHidden>
                Message Taylor Made
              </FormControl.Label>
              <TextInput
                block
                size="large"
                value={draft}
                placeholder="Tell Taylor Made what is going on…"
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing &&
                    event.keyCode !== 229
                  ) {
                    event.preventDefault()
                    submit()
                  }
                }}
              />
            </FormControl>
          </div>
          <IconButton
            type="submit"
            icon={PaperAirplaneIcon}
            aria-label="Send message"
            variant="primary"
            size="large"
            disabled={thinking || draft.trim().length === 0}
          />
        </Stack>
      </form>
    </Stack>
  )
}
