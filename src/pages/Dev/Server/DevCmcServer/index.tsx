import { createContext, useEffect, useState } from "react"
import { ICmcServer, IModelTypeType } from "../../../../_types/devServerType"
import { CMCServerList } from "./components/CMCServerList"

import { getCmcServerService } from "../../../../services/dev_cmcServerServices"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  cmcList?: ICmcServer[]
}

export const DevCmcServer: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getCmcServerPromise = getCmcServerService()

    Promise.all([getCmcServerPromise])
      .then((fb: any) => {
        const _data = {
          cmcList: fb?.[0]?.data,
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
        <CMCServerList />
      </div>
    </ServerPageContext.Provider>
  )
}
