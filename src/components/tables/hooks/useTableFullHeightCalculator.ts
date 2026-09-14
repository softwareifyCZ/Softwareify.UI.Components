import { useCallback, useRef, useEffect, useState } from 'react'
import { isResizeDetectorAvailable } from '@/common/models/optionalDeps'

// Conditionally import react-resize-detector
let useResizeDetectorHook: any = null
const isResizeDetectorEnabled = isResizeDetectorAvailable()

if (isResizeDetectorEnabled) {
  try {
    const module = require('react-resize-detector')
    useResizeDetectorHook = module.useResizeDetector
  } catch {
    console.warn('react-resize-detector is marked as available but failed to import')
  }
}

/**
 * Measures the wrapper and header filter row so the table body gets a usable `scroll.y`.
 * When `scrollY` is set, that value wins; otherwise height is derived from the container.
 * Falls back to CSS-based height (100% of parent) if react-resize-detector is not installed.
 */
export const useTableFullHeightCalculator = (
  scrollY: string | number | undefined,
  tableHeaderRef: React.RefObject<HTMLDivElement | null>,
  isMobile: boolean,
) => {
  // Note: In antd v6, the rc-table internal Reference type was removed and Table no longer accepts
  // a ref prop. Height calculation uses the wrapper ref (tableWrapperRef) instead. The tableRef
  // below is maintained for potential future use but is not currently passed to the Table component.
  const tableRef = useRef<HTMLDivElement>(null)

  const recalculateTableHeight = useCallback(
    (wrapper: HTMLDivElement | null): number | string | undefined => {
      if (!wrapper) return undefined

      // querySelector used here for antd-generated DOM elements that aren't exposed via React refs.
      // The table header, footer, placeholder, and container are created internally by antd Table
      // component and have no ref alternative. Direct DOM access is necessary and appropriate here.
      const tableHeader = wrapper.querySelector('thead.ant-table-thead')?.clientHeight ?? 0
      // containerPadding: Top/bottom padding around table container (design system spacing, 2x standard 4px unit)
      const containerPadding = 8

      if (scrollY) {
        const heightValue = +scrollY + tableHeader - containerPadding

        // Apply styles to internal antd elements that can't be accessed via React refs.
        // These antd-generated placeholder and container divs must be styled directly to control
        // the table's visual height when fixed scrollY is specified.
        const emptyPlaceholder = wrapper.querySelector('div.ant-table-placeholder')
        if (emptyPlaceholder instanceof HTMLElement) {
          emptyPlaceholder.style.minHeight = `${heightValue}px`
          emptyPlaceholder.style.maxHeight = `${heightValue}px`
        }

        const spinLoading = wrapper.querySelector('div.ant-table-container')
        if (spinLoading instanceof HTMLElement) {
          spinLoading.style.minHeight = `${heightValue}px`
          spinLoading.style.maxHeight = `${heightValue}px`
        }

        return scrollY
      }

      const tableFooter = wrapper.querySelector('div.ant-table-footer')?.clientHeight ?? 0
      // tablePaging: Ant pagination height. Mobile (compact): 24px, Desktop (default): 40px
      const tablePaging = isMobile ? 24 : 40

      const container = wrapper.clientHeight ?? 0
      const filterSection = tableHeaderRef.current?.clientHeight ?? 0

      // filterSectionMargin: Space between filter controls and table body (design system spacing)
      const filterSectionMargin = 16

      const height =
        container - tableHeader - tableFooter - filterSection - containerPadding - filterSectionMargin - tablePaging

      const tableWrapper = wrapper.querySelector('div.ant-table-wrapper')
      if (tableWrapper instanceof HTMLElement) {
        tableWrapper.style.maxHeight = `${height + tableHeader}px`
        tableWrapper.style.height = '100%'
      }

      return height
    },
    [scrollY, tableHeaderRef, isMobile]
  )

  // State for resize detection fallback (when react-resize-detector is not available)
  const [_resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(null)
  const tableWrapperRefFallback = useRef<HTMLDivElement>(null)

  // Initialize ResizeObserver fallback if react-resize-detector is not available
  useEffect(() => {
    if (isResizeDetectorEnabled || !tableWrapperRefFallback.current) {
      return
    }

    const observerCallback = () => {
      if (tableWrapperRefFallback.current) {
        recalculateTableHeight(tableWrapperRefFallback.current)
      }
    }

    const observer = new ResizeObserver(observerCallback)
    observer.observe(tableWrapperRefFallback.current)
    setResizeObserver(observer)

    return () => {
      observer.disconnect()
    }
  }, [recalculateTableHeight])

  let tableWrapperRef: React.RefObject<HTMLDivElement>

  // Use react-resize-detector if available, otherwise use ResizeObserver fallback
  if (isResizeDetectorEnabled && useResizeDetectorHook) {
    const tableWrapperResizeDetector = useResizeDetectorHook({
      refreshMode: 'debounce',
      onResize: () => {
        if (tableWrapperResizeDetector.ref.current) {
          recalculateTableHeight(tableWrapperResizeDetector.ref.current)
        }
      },
      refreshRate: 1,
    })
    tableWrapperRef = tableWrapperResizeDetector.ref as React.RefObject<HTMLDivElement>
  } else {
    // Fallback to manual ResizeObserver
    tableWrapperRef = tableWrapperRefFallback as React.RefObject<HTMLDivElement>
  }

  const getTableHeight = useCallback((): number | string | undefined => {
    const wrapper = tableWrapperRef.current
    if (!wrapper) return undefined
    return recalculateTableHeight(wrapper)
  }, [recalculateTableHeight, tableWrapperRef])

  return {
    tableWrapperRef: tableWrapperRef,
    tableRef: tableRef,
    getTableHeight: getTableHeight,
  }
}
