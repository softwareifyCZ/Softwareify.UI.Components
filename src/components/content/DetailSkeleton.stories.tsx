import type { Meta, StoryObj } from "@storybook/react"
import DetailSkeleton from "./DetailSkeleton"

const meta: Meta<typeof DetailSkeleton> = {
  title: "Content/DetailSkeleton",
  component: DetailSkeleton,
}

export default meta
type Story = StoryObj<typeof DetailSkeleton>

export const Project: Story = {
  args: { variant: "project" },
}
