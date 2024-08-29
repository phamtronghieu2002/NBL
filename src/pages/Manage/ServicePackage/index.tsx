import { createContext, useEffect, useState } from "react"
import { getPackageService } from "../../../services/manage_servicePackageServices"
import { PackageList } from "./components/PackageList"
import { IPackage } from "../../../_types/devServerType"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  packageList?: IPackage[]
}

export const ManageServicePackage: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getPakagePromise = getPackageService()

    Promise.all([getPakagePromise])
      .then((fb: any) => {
        const _data = {
          packageList: fb?.[0]?.data,
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
        <PackageList />
      </div>
    </ServerPageContext.Provider>
  )
}
