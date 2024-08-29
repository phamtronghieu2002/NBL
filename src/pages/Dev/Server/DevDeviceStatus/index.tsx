import { createContext, useEffect, useState } from "react"
import {
  IConnectionType,
  IDeviceStatusType,
} from "../../../../_types/devServerType"
import { DeviceStatusList } from "./components/DeviceStatusList"
import { getDeviceStatusService } from "../../../../services/dev_deviceStatusServices"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  deviceStatus?: IDeviceStatusType[]
}

export const DevDeviceStatus: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getDeviceStatusServicePromise = getDeviceStatusService()

    Promise.all([getDeviceStatusServicePromise])
      .then((fb: any) => {
        const _data = {
          deviceStatus: fb?.[0]?.data,
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
        <DeviceStatusList />
      </div>
    </ServerPageContext.Provider>
  )
}
