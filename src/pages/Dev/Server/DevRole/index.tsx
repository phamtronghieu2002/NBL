import { createContext, useEffect, useState } from "react"
import { RoleList } from "./components/RoleList"

import { getRoleService } from "../../../../services/dev_roleServices"
import { IRoleType } from "../../../../_types/devServerType"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  oderStatus?: IRoleType[]
}

export const DevRole: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getRolePromise = getRoleService()

    Promise.all([getRolePromise])
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
        <RoleList />
      </div>
    </ServerPageContext.Provider>
  )
}
