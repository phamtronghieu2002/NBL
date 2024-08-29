import { createContext, useEffect, useState } from "react"
import { ILevelType } from "../../../../_types/devServerType"
import { LevelList } from "./components/LevelList"

import { getLevelService } from "../../../../services/dev_levelServices"

interface IServerPageContext {
  data?: IData
  isLoading?: boolean
  reload?: () => void
}

export const ServerPageContext = createContext<IServerPageContext>({})

interface IProps {}
interface IData {
  level?: ILevelType[]
}

export const DevLevel: React.FC<IProps> = () => {
  const [data, setData] = useState<IData>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getData = () => {
    setIsLoading(true)
    const getLevelPromise = getLevelService()

    Promise.all([getLevelPromise])
      .then((fb: any) => {
        const _data = {
          level: fb?.[0]?.data,
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
        <LevelList />
      </div>
    </ServerPageContext.Provider>
  )
}
