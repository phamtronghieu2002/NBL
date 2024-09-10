import { FC } from "react"
import React from "react"
import { ViahicleType } from "../../../../interface/interface"

interface ViahicleProviderProps {
  viahiclesStore: ViahicleType[]
  freshKey?: number
  keyword?: string
  type: number
  loading?: boolean
}

export interface ViahicleProviderContextProps {
  viahiclesStore: ViahicleProviderProps

  dispatch: {
    setTypeViahicle: (type: number) => void
    freshKey: () => void
    setKeyword: (keyword: string) => void
    setViahicle: (viahicle: ViahicleType[]) => void
    getIdViahicles: () => number[] // Assuming `id` is a string
    setLoading?: (loading: boolean) => void
  }
}

const initState: ViahicleProviderProps = {
  viahiclesStore: [],
  freshKey: 0,
  keyword: "",
  type: 1,
  loading: false,
}

export const viahiclesContext = React.createContext<
  ViahicleProviderContextProps | undefined
>(undefined)

const ViahicleProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viahiclesStore, setState] =
    React.useState<ViahicleProviderProps>(initState)

  const dispatch = {
    setTypeViahicle: (type: number) => {
      setState((prevState) => ({
        ...prevState,
        type: type,
      }))
    },
    setLoading: (loading: boolean) => {
      setState({ ...viahiclesStore, loading: loading })
    },
    freshKey: () => {
      setState({ ...viahiclesStore, freshKey: Math.random() })
    },
    setKeyword: (keyword: string) => {
      setState({ ...viahiclesStore, keyword: keyword })
    },
    setViahicle: (viahicle: ViahicleType[]) => {
      setState({ ...viahiclesStore, viahiclesStore: viahicle })
    },
    getIdViahicles: () => {
      return viahiclesStore.viahiclesStore
        .map((viahicle) => viahicle.id)
        .filter((id) => id !== undefined)
    },
  }

  return (
    <viahiclesContext.Provider value={{ viahiclesStore, dispatch }}>
      {children}
    </viahiclesContext.Provider>
  )
}

export default ViahicleProvider
