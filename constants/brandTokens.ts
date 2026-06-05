/**
 * Mobile brand tokens (earthy warm): heritage green, orange, rust, cream.
 *
 * Single source of truth for the brand palette used by `constants/Colors.ts`.
 * Keep values in hex so they can also be referenced by design docs.
 */
export const brandColors = {
  cream: '#F5EFE8',
  heritageGreen: '#5F6E3D',
  orange: '#E08433',
  sand: '#D6C8AF',
  rust: '#5D2413',
  golden: '#ECAB47',
} as const;

// Spacing/Radius/shadow tokens are included for future parity with `docs/branding.md`.
export const brandRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 999,
} as const;

export const brandShadows = {
  sm: '0 2px 8px rgba(93, 36, 19, 0.08)',
  md: '0 8px 24px rgba(93, 36, 19, 0.12)',
  lg: '0 16px 40px rgba(93, 36, 19, 0.16)',
} as const;

