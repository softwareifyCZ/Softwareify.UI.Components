import { describe, expect, it } from 'vitest'
import {
  LIST_TABLE_BODY_MAX_Y,
  listPageRootClassName,
  listTableScroll,
} from './listPageTableLayout'

describe('listPageTableLayout', () => {
  it('uses a stable max body height token', () => {
    expect(LIST_TABLE_BODY_MAX_Y).toContain('100dvh')
  })

  it('builds desktop and mobile root class names', () => {
    expect(listPageRootClassName(false)).toContain('overflow-hidden')
    expect(listPageRootClassName(true)).not.toContain('overflow-hidden')
    expect(listPageRootClassName(false, { gap: 'gap-4' })).toContain('gap-4')
  })

  it('adds horizontal scroll only when requested on mobile', () => {
    expect(listTableScroll(false)).toEqual({ y: LIST_TABLE_BODY_MAX_Y })
    expect(listTableScroll(true, 960)).toEqual({ x: 960, y: LIST_TABLE_BODY_MAX_Y })
  })
})
