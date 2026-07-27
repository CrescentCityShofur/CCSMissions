import { Stack, Text } from '@primer/react'
import { BRAND } from '@/lib/ccs/content'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LOGO SLOT
 * The official purple + gold "CCS | Coastal Consolidated Solutions LLC" lockup
 * has not been uploaded yet. This is a token-based typographic stand-in that
 * matches the mark's structure. To swap in the real artwork, drop the file at
 * public/images/ccs-logo.png and replace the markup below with:
 *
 *   <Image src="/images/ccs-logo.png" alt="CCS | Coastal Consolidated Solutions LLC" ... />
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function BrandMark({ size = 'medium' }: { size?: 'small' | 'medium' }) {
  const isSmall = size === 'small'

  return (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="nowrap">
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: isSmall ? 'var(--base-size-28)' : 'var(--base-size-40)',
          height: isSmall ? 'var(--base-size-28)' : 'var(--base-size-40)',
          borderRadius: 'var(--borderRadius-medium)',
          backgroundColor: 'var(--bgColor-done-emphasis)',
          color: 'var(--fgColor-onEmphasis)',
          fontFamily: 'var(--fontStack-sansSerifDisplay)',
          fontWeight: 700,
          letterSpacing: '0.02em',
          fontSize: isSmall ? 'var(--text-body-size)' : 'var(--text-subtitle-size)',
          boxShadow: 'inset 0 0 0 1px var(--borderColor-attention-emphasis)',
          flexShrink: 0,
        }}
      >
        CCS
      </span>
      <Stack direction="vertical" gap="none">
        <Text
          size={isSmall ? 'small' : 'medium'}
          weight="semibold"
          sx={{ lineHeight: 1.2, whiteSpace: 'nowrap' }}
        >
          {BRAND.program}
        </Text>
        <Text
          size="small"
          sx={{
            color: 'var(--fgColor-muted)',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          {BRAND.name}
        </Text>
      </Stack>
      <span className="sr-only">
        CCS — Coastal Consolidated Solutions LLC
      </span>
    </Stack>
  )
}
