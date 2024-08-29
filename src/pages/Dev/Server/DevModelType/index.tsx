import { createContext, useEffect, useState } from "react"
import { IModelTypeType } from "../../../../_types/devServerType"
import { ModelTypeList } from "./components/ModelTypeList"

import { getLevelService } from "../../../../services/dev_levelServices"
import { getModelTypeService } from "../../../../services/dev_modelTypeServices"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  modelType?: IModelTypeType[]
}

export const DevModelType: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getModelTypePromise = getModelTypeService()

    Promise.all([getModelTypePromise])
      .then((fb: any) => {
        const _data = {
          modelType: fb?.[0]?.data,
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
        <ModelTypeList />
      </div>
    </ServerPageContext.Provider>
  )
}
