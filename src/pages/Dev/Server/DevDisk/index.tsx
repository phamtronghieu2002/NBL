import { createContext, useEffect, useState } from "react"
import {
  IConnectionType,
  IDeviceStatusType,
  IDiskType,
} from "../../../../_types/devServerType"
import { DiskList } from "./components/DiskList"
import { getDeviceStatusService } from "../../../../services/dev_deviceStatusServices"
import { getDiskService } from "../../../../services/dev_diskServices"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  disk?: IDiskType[]
}

export const DevDisk: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getDiskPromise = getDiskService()

    Promise.all([getDiskPromise])
      .then((fb: any) => {
        const _data = {
          disk: fb?.[0]?.data,
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
        <DiskList />
      </div>
    </ServerPageContext.Provider>
  )
}
