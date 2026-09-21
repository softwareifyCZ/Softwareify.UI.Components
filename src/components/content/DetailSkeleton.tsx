import { Card, Skeleton, Space } from "antd"
import type { CSSProperties } from "react"
import { spacing } from "@/config"

export type DetailSkeletonVariant = "project"

export type DetailSkeletonProps = {
  variant?: DetailSkeletonVariant
  className?: string
  style?: CSSProperties
}

/**
 * Full-page skeleton for a header + stat tiles + content layout while its
 * data loads (dashboards, overview pages, detail pages).
 */
const DetailSkeleton = ({ variant = "project", className, style }: DetailSkeletonProps) => {
  void variant // one shape today; kept for forward-compatible API

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", gap: spacing.lg, ...style }}
    >
      <Card>
        <Skeleton
          active
          avatar={{ size: 48, shape: "circle" }}
          title={{ width: "35%" }}
          paragraph={{ rows: 1, width: "20%" }}
        />
      </Card>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: spacing.md,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <Skeleton active paragraph={{ rows: 1 }} title={{ width: "60%" }} />
          </Card>
        ))}
      </div>
      <Card>
        <Space direction="vertical" style={{ width: "100%" }} size={spacing.md}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} active title={false} paragraph={{ rows: 1, width: "100%" }} />
          ))}
        </Space>
      </Card>
    </div>
  )
}

export default DetailSkeleton
