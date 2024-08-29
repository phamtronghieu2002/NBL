import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react"
import { getInterfaceListService } from "../../../../services/interfaceServices"
import { IInterface } from "../../../../_types/interfaceType"
import { List } from "./components/List"
import { Content } from "./components/Content"
import { useParams, useSearchParams } from "react-router-dom"

interface IPageContext {
  pickedId?: number
  isLoading?: boolean
  list?: IInterface[]
  setPickedId?: (id: number) => void
  reload?: () => void
}
export const PageContext = createContext<IPageContext>({})

export const InterfaceManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const _pId = Number(searchParams?.get("ui-id"))
  const [rerenderKey, setRerenderKey] = useState<number>(Math.random())
  const [pickedId, setPickedId_] = useState<number>(_pId)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [list, setList] = useState<IInterface[]>([])

  const setSearchParamsVal = (key: string, val: string) => {
    setSearchParams((preParam) => {
      preParam?.set(key, `${val}`)
      return preParam
    })
  }

  const setPickedId = (id: number) => {
    setSearchParamsVal("ui-id", `${id}`)
  }

  const reload = () => {
    setRerenderKey?.(Math.random())
  }

  useEffect(() => {
    setPickedId_(_pId)
  }, [_pId])

  useEffect(() => {
    setIsLoading(true)

    const getInterfaceListPromise = getInterfaceListService()

    Promise.all([getInterfaceListPromise])
      .then(([interfaceListFb]: any) => {
        if (interfaceListFb?.result) {
          setList(interfaceListFb?.data)
        }
      })
      .catch((error) => {
        console.log("InterfaceManager:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [rerenderKey])

  const contextValue = { list, isLoading, pickedId, setPickedId, reload }

  return (
    <PageContext.Provider value={contextValue}>
      <div className="flex gap-4 h-full">
        <div className="w-[250px] bg-white h-full">
          <List />
        </div>
        <div className="flex-1 bg-white h-full overflow-auto">
          <Content />
        </div>
      </div>
    </PageContext.Provider>
  )
}
