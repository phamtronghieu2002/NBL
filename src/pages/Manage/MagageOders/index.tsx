import {
  Dispatch,
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react"
import { OrderList } from "./components/OrderList"
import { getDeviceService } from "../../../services/manage_deviceServices"
import { CustomerTree } from "../../../conponents/tree/CustomerTree"
import { ComponentTitle } from "../../../conponents/TitleC/ComponentTitle"
import {
  IAction,
  IInitialPageState,
  devicePageReducer,
  initialDevicePageState,
} from "./_reducer"
import { orderPageAction } from "./_actions"
import { Key } from "antd/es/table/interface"
import { store } from "../../../app/store"
import { getOrderService } from "../../../services/manage_orderServices"

interface IServerPageContext {
  state: IInitialPageState
  dispatch?: Dispatch<IAction>
}

export const ServerPageContext = createContext<IServerPageContext>({
  state: initialDevicePageState(),
})

interface IProps {}

export const ManageOrders: React.FC<IProps> = () => {
  const [state, dispatch] = useReducer(
    devicePageReducer,
    initialDevicePageState(),
  )

  const getData = () => {
    dispatch(orderPageAction?.setIsLoadingOrder(true))
    const customer_id =
      store?.getState?.()?.user?.child?.object?.[state?.userId]?.customer_id

    const getDevicePromise = getOrderService(
      state?.orders?.param?.offset,
      state?.orders?.param?.limit,
      state?.orders?.param?.q || undefined,
      customer_id || undefined,
    )

    Promise.all([getDevicePromise])
      .then((fb: any) => {
        dispatch(
          orderPageAction?.setOrderData({
            list: fb?.[0]?.data,
            totalPage: fb?.[0]?.totalPage,
          }),
        )
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        dispatch(orderPageAction?.setIsLoadingOrder(false))
      })
  }

  const onTreeChangeKey = useCallback((key: Key[]) => {
    dispatch(orderPageAction?.setUserId?.(Number(key?.[0])))
  }, [])

  useEffect(() => {
    getData()
  }, [
    state?.orders?.reloadKey,
    state?.orders?.param?.limit,
    state?.orders?.param?.offset,
    state?.orders?.param?.q,
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
          <ComponentTitle title="Khách hàng của tôi" />
          <div className="w-[250px] flex-1 overflow-auto  bg-white">
            <CustomerTree
              onChangeKey={onTreeChangeKey}
              userIdSelected={state?.userId}
            />
          </div>
        </div>
        <div className="flex-1 w-[400px]">
          <OrderList />
        </div>
      </div>
    </ServerPageContext.Provider>
  )
}
