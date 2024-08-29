import { createContext, useEffect, useState } from "react"
import { PermissionList } from "./components/PermissionList"

import { getRoleService } from "../../../../services/dev_roleServices"
import { IPermission } from "../../../../_types/devServerType"
import { getPermissionService } from "../../../../services/dev_permissionServices"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  oderStatus?: IPermission[]
}

export const DevPermission: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getPermissionPromise = getPermissionService()

    Promise.all([getPermissionPromise])
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
        <PermissionList />
      </div>
    </ServerPageContext.Provider>
  )
}
