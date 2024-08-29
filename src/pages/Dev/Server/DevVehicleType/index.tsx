import { createContext, useEffect, useState } from "react"
import { VehicleTypeList } from "./components/VehicleTypeList"

import { getVehicleIconService } from "../../../../services/dev_vehicleIconServices"
import {
  IVehicleIconType,
  IVehicleTypeType,
} from "../../../../_types/devServerType"
import { getVehicleTypeService } from "../../../../services/dev_vehicleTypeServices"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  vehicleIcon?: IVehicleIconType[]
  vehicleType?: IVehicleTypeType[]
}

export const DevVehicleType: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getVehicleIconPropmise = getVehicleIconService()
    const getVehicleTypePropmise = getVehicleTypeService()

    Promise.all([getVehicleIconPropmise, getVehicleTypePropmise])
      .then((fb: any) => {
        const _data = {
          vehicleIcon: fb?.[0]?.data || [],
          vehicleType: fb?.[1]?.data || [],
        }
        setData(_data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    getData()
  }, [])

  const contextValue = {
    data,
    isLoading,
    reload: getData,
  }

  return (
    <ServerPageContext.Provider value={contextValue}>
      <div className="h-full">
        <VehicleTypeList />
      </div>
    </ServerPageContext.Provider>
  )
}
