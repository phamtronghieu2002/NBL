import { FC } from "react"

interface MobileLayoutProps {
  children?: React.ReactNode
}

const MobileLayout: FC<MobileLayoutProps> = ({ children }) => {
  return <div className="h-[100vh] overflow-scroll pt-2">{children}</div>
}

export default MobileLayout
