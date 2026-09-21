import type { ReactNode } from "react"
import ActionColumnRow from "./ActionColumnRow"

export type MobileActionSplitRowProps = {
  left: ReactNode
  right: ReactNode
  className?: string
  gap?: number
}

/** Two equal-width action slots side by side with a divider — e.g. a mobile card's action row. */
const MobileActionSplitRow = ({ left, right, className, gap }: MobileActionSplitRowProps) => (
  <ActionColumnRow items={[left, right]} className={className} gap={gap} />
)

export default MobileActionSplitRow
