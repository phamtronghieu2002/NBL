import { FC } from "react"
import React from "react"
import { Button, Tabs } from "antd"
import type { TabsProps } from "antd"
import { TableC } from "../../../../conponents/TableC"

import { ViahicleType } from "../../../../interface/interface"
import getColumnViahicleNoGPS from "./columns"
import { useContext } from "react"
import {
  viahiclesContext,
  ViahicleProviderContextProps,
} from "../providers/ViahicleProvider"
import ModalImportExel from "../../../../conponents/modals/ModalImportExel"
import ModalAddViahicle from "../../../../conponents/modals/ModalAddViahicle"
interface ViahicleNoGPSType {
  viahicles: ViahicleType[]
}
const ViahicleNoGPS: FC<ViahicleNoGPSType> = ({ viahicles }) => {
  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  //handle logig reload
  const onReload = () => {
    dispatch.freshKey()
  }

  //get viahicle checked
  const getViahicleChecked = (viahicle: ViahicleType[]) => {
    dispatch?.setViahicle(viahicle)
  }

  return (
    <div className="mt-5">
      <TableC
        checkBox
        setViahicleChecked={getViahicleChecked}
        hiddenTitle={true}
        title="123"
        onReload={onReload}
        search={{
          width: 200,
          onSearch(q) {},
          limitSearchLegth: 3,
        }}
        right={
          <>
            <ModalAddViahicle
              type="add"
              button={<Button type="primary">Thêm xe</Button>}
            />
            <ModalImportExel
              button={<Button type="primary">Import Excel</Button>}
            />
          </>
        }
        props={{
          columns: getColumnViahicleNoGPS(dispatch?.setViahicle),
          dataSource: viahicles,
          size: "middle",
          pagination: {},
        }}
      />
    </div>
  )
}

export default ViahicleNoGPS
