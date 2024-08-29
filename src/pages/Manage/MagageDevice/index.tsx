import {
  Dispatch,
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react"
import { DeviceList } from "./components/DeviceList"
import { getDeviceService } from "../../../services/manage_deviceServices"
import { CustomerTree } from "../../../conponents/tree/CustomerTree"
import { ComponentTitle } from "../../../conponents/TitleC/ComponentTitle"
import {
  IAction,
  IInitialPageState,
  devicePageReducer,
  initialDevicePageState,
} from "./_reducer"
import { devicePageAction } from "./_actions"
import { Key } from "antd/es/table/interface"
import { store } from "../../../app/store"
import { CustomerPicker } from "../Business/components/CustomerPicker"

interface IServerPageContext {
  state: IInitialPageState
  dispatch?: Dispatch<IAction>
}

export const ServerPageContext = createContext<IServerPageContext>({
  state: initialDevicePageState(),
})

interface IProps {}

export const ManageDevice: React.FC<IProps> = () => {
  const [state, dispatch] = useReducer(
    devicePageReducer,
    initialDevicePageState(),
  )

  const getData = () => {
    dispatch(devicePageAction?.setIsLoadingDevice(true))
    const customer_id =
      store?.getState?.()?.user?.child?.object?.[state?.userId]?.customer_id

    const getDevicePromise = getDeviceService(
      state?.device?.param?.offset,
      state?.device?.param?.limit,
      state?.device?.param?.q || undefined,
      customer_id || undefined,
    )

    Promise.all([getDevicePromise])
      .then((fb: any) => {
        dispatch(
          devicePageAction?.setDeviceData({
            list: fb?.[0]?.data,
            totalPage: fb?.[0]?.totalPage,
          }),
        )
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        dispatch(devicePageAction?.setIsLoadingDevice(false))
      })
  }

  const onTreeChangeKey = useCallback((key: Key[]) => {
    dispatch(devicePageAction?.setUserId?.(Number(key?.[0])))
  }, [])

  useEffect(() => {
    getData()
  }, [
    state?.device?.reloadKey,
    state?.device?.param?.limit,
    state?.device?.param?.offset,
    state?.device?.param?.q,
  ])

  const contextValue = {
    state,
    dispatch,
  }

  // console.log(state)

  return (
    <ServerPageContext.Provider value={contextValue}>
      <div className="h-full flex gap-4">
        <div className="h-full flex flex-col">
          <CustomerPicker onChange={onTreeChangeKey} userId={state?.userId} />
          {/* <CustomerTreeSearch /> */}
        </div>
        <div className="flex-1 w-[400px]">
          <DeviceList />
        </div>
      </div>
    </ServerPageContext.Provider>
  )
}
