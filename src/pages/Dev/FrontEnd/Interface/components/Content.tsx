import { useContext } from "react"
import { PageContext } from "../InterfaceManager"
import { Empty } from "antd"
import { UIArea } from "./UIArea"

export const Content: React.FC = () => {
  const { list, pickedId, isLoading } = useContext(PageContext)

  const ui = list?.find?.((ui) => ui?.id == pickedId)

  return (
    <div className="h-full overflow-auto">
      {ui ? (
        <UIArea ui={ui} key={pickedId} />
      ) : (
        <div className="justify-center items-center flex h-full">
          <Empty description="Chọn một cấu hình UI để hiển thị"></Empty>
        </div>
      )}
    </div>
  )
}
