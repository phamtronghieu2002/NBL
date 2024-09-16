import { FC } from "react"
import React from "react"
import { Tabs } from "antd"
import type { TabsProps } from "antd"
import { TableC } from "../../../../conponents/TableC"
import getColumnViahicleGPS from "./columns"
import { ViahicleType } from "../../../../interface/interface"
import { useContext } from "react"
import {
  viahiclesContext,
  ViahicleProviderContextProps,
} from "../providers/ViahicleProvider" // Import the ViahicleProviderProps type 12
import { MaskLoader } from "../../../../conponents/Loader"

interface ViahicleGPSType {
  viahicles: ViahicleType[]
}

const ViahicleGPS: FC<ViahicleGPSType> = ({ viahicles }) => {
  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps


  //handle logig reload
  const onReload = () => {
    dispatch.freshKey()
  }

  //get viahicle checked
  const setViahicleChecked = (viahicle: ViahicleType[]) => {
    dispatch?.setViahicle(viahicle)
  }

  return (
    <div className="mt-5">
      {viahiclesStore.loading && <MaskLoader />}
      <TableC
        setViahicleChecked={setViahicleChecked}
        checkBox
        title="123"
        hiddenTitle={true}
        onReload={onReload}
        search={{
          width: 200,
          onSearch(q) {
            dispatch?.setKeyword(q)
          },
          limitSearchLegth: 3,
        }}
        right={<></>}
        props={{
          columns: getColumnViahicleGPS(dispatch?.setViahicle),
          dataSource: viahicles,
          size: "middle",
          pagination: {},
        }}
      />
    </div>
  )
}

export default ViahicleGPS
