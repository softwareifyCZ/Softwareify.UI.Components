import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "antd"
import { ArrowRightOutlined, EditOutlined } from "@ant-design/icons"
import MobileActionSplitRow from "./MobileActionSplitRow"

const meta: Meta<typeof MobileActionSplitRow> = {
  title: "Content/MobileActionSplitRow",
  component: MobileActionSplitRow,
}

export default meta
type Story = StoryObj<typeof MobileActionSplitRow>

export const Default: Story = {
  args: {
    left: <Button type="primary" shape="circle" size="large" icon={<ArrowRightOutlined />} />,
    right: <Button shape="circle" size="large" icon={<EditOutlined />} />,
  },
}
