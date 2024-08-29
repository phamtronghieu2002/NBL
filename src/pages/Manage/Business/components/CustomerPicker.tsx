import { Key } from "antd/es/table/interface"
import { ComponentTitle } from "../../../../conponents/TitleC/ComponentTitle"
import { Button, Tooltip } from "antd"
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai"
import { CustomerTree } from "../../../../conponents/tree/CustomerTree"
import { useState } from "react"

interface IProps {
  onChange: (userId: Key[]) => void
  userId: number
}

export const CustomerPicker: React.FC<IProps> = ({ onChange, userId }) => {
  const [isExpand, setIsExpand] = useState<boolean>(true)

  const toggleShowMenu = () => setIsExpand((preState) => !preState)

  return isExpand ? (
    <>
      <ComponentTitle
        title="Khách hàng của tôi"
        right={
          <Tooltip title="Đóng lại" placement="right">
            <Button
              onClick={toggleShowMenu}
              icon={
                <AiOutlineMenuFold color="var(--root-text-color)" size={18} />
              }
              type="link"
            />
          </Tooltip>
        }
      />
      <div className="w-[250px] flex-1 overflow-auto  bg-white">
        <CustomerTree onChangeKey={onChange} userIdSelected={userId} />
      </div>
    </>
  ) : (
    <div className="flex flex-col items-center gap-4 bg-white h-full">
      <Tooltip title="Mở ra" placement="right">
        <Button
          onClick={toggleShowMenu}
          icon={
            <AiOutlineMenuUnfold size={18} color="var(--root-text-color)" />
          }
          type="link"
        />
      </Tooltip>

      <div
        style={{
          writingMode: "vertical-lr",
        }}
        className="text-base font-light"
      >
        Khách hàng của tôi
      </div>
    </div>
  )
}
