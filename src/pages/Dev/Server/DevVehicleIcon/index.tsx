import { createContext, useEffect, useState } from "react"
import { VehicleIconList } from "./components/VehicleIconList"

import { getVehicleIconService } from "../../../../services/dev_vehicleIconServices"
import { IVehicleIconType } from "../../../../_types/devServerType"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  vehicleIcon?: IVehicleIconType[]
}

export const DevVehicleIcon: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getVehicleIconPropmise = getVehicleIconService()

    Promise.all([getVehicleIconPropmise])
      .then((fb: any) => {
        const _data = {
          vehicleIcon: fb?.[0]?.data,
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
        <VehicleIconList />
      </div>
    </ServerPageContext.Provider>
  )
}
