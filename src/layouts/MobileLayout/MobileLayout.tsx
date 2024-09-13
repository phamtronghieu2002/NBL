import { FC } from "react"

interface MobileLayoutProps {
  children?: React.ReactNode
}

const MobileLayout: FC<MobileLayoutProps> = ({ children }) => {
  return <div className="overflow-hidden pt-2 ">{children}</div>
}

export default MobileLayout
