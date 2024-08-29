import { createContext, useEffect, useState } from "react"
import { getModelTypeService } from "../../../services/dev_modelTypeServices"
import { getModelService } from "../../../services/dev_modelServices"
import { getDiskService } from "../../../services/dev_diskServices"
import { getConnectionTypeService } from "../../../services/connectionTypeServices"
import { ModelList } from "./components/ModelList"
import { IModel } from "../../../_types/devServerType"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  modelList?: IModel[]
  // modelType?: IModelTypeType[]
}

export const ManageModel: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getModelPromise = getModelService()
    // const getModelTypePromise = getModelTypeService()
    // const getDiskPromise = getDiskService()
    // const getConnectionTypePromise = getConnectionTypeService()

    Promise.all([
      getModelPromise,
      // getModelTypePromise,
      // getDiskPromise,
      // getConnectionTypePromise,
    ])
      .then((fb: any) => {
        const _data = {
          modelList: fb?.[0]?.data,
          // modelTypeList: fb?.[0]?.data,
          // diskList: fb?.[1]?.data,
          // connectionTypeList: fb?.[1]?.data,
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
        <ModelList />
      </div>
    </ServerPageContext.Provider>
  )
}
