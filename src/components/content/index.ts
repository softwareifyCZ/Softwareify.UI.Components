/**
 * Page content helpers: loading skeletons, empty states, and split action rows.
 *
 * - {@link ContentLoader} — skeleton layouts while data loads
 * - {@link ContentState} — centered empty / no-data UI
 * - {@link ActionColumnRow} — N columns with dividers (e.g. mobile actions)
 * - {@link DetailSkeleton} — full-page header + stat tiles + content skeleton
 * - {@link MobileActionSplitRow} — two-slot action row (mobile card actions)
 */

export { default as ContentLoader } from "./ContentLoader"
export type { ContentLoaderProps, ContentLoaderVariant } from "./ContentLoader"

export { default as ContentState } from "./ContentState"
export type { ContentStateProps } from "./ContentState"

export { default as ActionColumnRow } from "./ActionColumnRow"
export type { ActionColumnRowProps } from "./ActionColumnRow"

export { default as DetailSkeleton } from "./DetailSkeleton"
export type { DetailSkeletonProps, DetailSkeletonVariant } from "./DetailSkeleton"

export { default as MobileActionSplitRow } from "./MobileActionSplitRow"
export type { MobileActionSplitRowProps } from "./MobileActionSplitRow"
