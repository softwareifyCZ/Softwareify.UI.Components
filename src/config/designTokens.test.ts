import { describe, expect, it } from 'vitest'
import { brand, colors, fontSize, spacing } from './designTokens'

describe('designTokens', () => {
  it('exposes the Softwareify brand primary color', () => {
    expect(brand.primary).toBe('#ED1C24')
  })

  it('exposes semantic color tokens', () => {
    expect(colors.success).toMatch(/^#/)
    expect(colors.error).toMatch(/^#/)
  })

  it('exposes typography and spacing scales', () => {
    expect(fontSize.base).toBe(14)
    expect(spacing.md).toBeGreaterThan(spacing.sm)
  })
})
