import { createContext, useEffect, useState } from "react"
import { OderStatusList } from "./components/OderStatusList"

import { getOderStatusService } from "../../../../services/dev_oderStatusServices"
import { IOderStatusType } from "../../../../_types/devServerType"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  oderStatus?: IOderStatusType[]
}

export const DevOderStatus: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getOderStatusPropmise = getOderStatusService()

    Promise.all([getOderStatusPropmise])
      .then((fb: any) => {
        const _data = {
          oderStatus: fb?.[0]?.data,
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
        <OderStatusList />
      </div>
    </ServerPageContext.Provider>
  )
}
