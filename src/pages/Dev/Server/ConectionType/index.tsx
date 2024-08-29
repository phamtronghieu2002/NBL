import { createContext, useEffect, useState } from "react"
import { getConnectionTypeService } from "../../../../services/connectionTypeServices"
import { IConnectionType } from "../../../../_types/devServerType"
import { ConnectionTypeList } from "./components/ConnectionTypeList"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  connectionType?: IConnectionType[]
}

export const ConnectionType: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getConnectionTypeServicePromise = getConnectionTypeService()

    Promise.all([getConnectionTypeServicePromise])
      .then((fb: any) => {
        const _data = {
          connectionType: fb?.[0]?.data,
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
        <ConnectionTypeList />
      </div>
    </ServerPageContext.Provider>
  )
}
