import { useState } from "react"
import { ComponentTitle } from "../../../../conponents/TitleC/ComponentTitle"
import { EditMenuModal } from "../../../../conponents/modals/EditMenuModal"
import { MenuHead } from "../../../../layouts/MainLayout/components/MenuHead"
import { MenuList } from "./components/MenuList"
import { Button } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"

export const MenuManagerPage: React.FC = () => {
  const [rerenderKey, setRerenderKey] = useState<number>(Math.random())

  return (
    <div className="h-full menu-table-page-scroll">
      <MenuList rerenderKey={rerenderKey} />
    </div>
  )
}
