'use client'

import { Button, IconButton, Stack, Text } from '@primer/react'
import {
  CommentDiscussionIcon,
  XIcon,
} from '@primer/octicons-react'
import { useChat } from './chat-provider'
import { Conversation } from './conversation'

/**
 * Persistent launcher + panel. Taylor Made stays reachable from every section
 * of the page, and shares one conversation state with the hero chat.
 */
export function ChatWidget() {
  const { widgetOpen, setWidgetOpen, state } = useChat()

  const agentTurns = state.messages.filter(
    (message) => message.role === 'agent',
  ).length

  return (
    <div
      style={{
        position: 'fixed',
        right: 'var(--base-size-16)',
        bottom: 'var(--base-size-16)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 'var(--base-size-12)',
      }}
    >
      {widgetOpen ? (
        <div
          role="dialog"
          aria-label="Chat with Taylor Made"
          style={{
            width: 'min(92vw, 420px)',
            backgroundColor: 'var(--bgColor-default)',
            border: '1px solid var(--borderColor-default)',
            borderRadius: 'var(--borderRadius-large)',
            boxShadow: 'var(--shadow-floating-large)',
            overflow: 'hidden',
          }}
        >
          <Stack
            direction="horizontal"
            gap="condensed"
            align="center"
            justify="space-between"
            wrap="nowrap"
            padding="condensed"
            style={{
              backgroundColor: 'var(--bgColor-inset)',
              borderBottom: '1px solid var(--borderColor-default)',
            }}
          >
            <Stack direction="vertical" gap="none">
              <Text size="small" weight="semibold">
                Taylor Made
              </Text>
              <Text size="small" style={{ color: 'var(--fgColor-muted)' }}>
                CCS Missions concierge
              </Text>
            </Stack>
            <IconButton
              icon={XIcon}
              aria-label="Close chat"
              variant="invisible"
              onClick={() => setWidgetOpen(false)}
            />
          </Stack>
          <div style={{ padding: 'var(--base-size-12)' }}>
            <Conversation height={380} />
          </div>
        </div>
      ) : null}

      {!widgetOpen ? (
        <Button
          variant="primary"
          size="large"
          leadingVisual={CommentDiscussionIcon}
          count={agentTurns > 0 ? agentTurns : undefined}
          onClick={() => setWidgetOpen(true)}
          sx={{ boxShadow: 'var(--shadow-floating-medium)' }}
        >
          Talk to Taylor Made
        </Button>
      ) : null}
    </div>
  )
}
