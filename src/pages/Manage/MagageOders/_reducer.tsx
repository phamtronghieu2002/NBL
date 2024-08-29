import { IOrderInfo } from "../../../_types/ordersType"
import { store } from "../../../app/store"
import { orderPageActionType } from "./_actions"

export interface IAction {
  type: string
  payload?: any
}

interface ISearchParam {
  offset: number
  limit: number
  q?: string
  type?: string
}

interface IOrder {
  isLoading: boolean
  list: IOrderInfo[]
  totalPage: number
  param: ISearchParam
  reloadKey: number
}

export interface IInitialPageState {
  orders: IOrder
  userId: number
}

export const initialDevicePageState = (
  userIdDefault?: number,
): IInitialPageState => {
  const userId =
    userIdDefault || store?.getState()?.user?.access?.userInfo?.id || 9999
  return {
    orders: {
      isLoading: true,
      list: [],
      param: {
        offset: 0,
        limit: 50,
        q: "",
      },
      totalPage: 0,
      reloadKey: Math.random(),
    },
    userId: userId,
  }
}

export const devicePageReducer = (
  state: IInitialPageState,
  action: IAction,
): IInitialPageState => {
  switch (action?.type) {
    case orderPageActionType?.SET_ORDER_LOADING: {
      return {
        ...state,
        orders: {
          ...state?.orders,
          isLoading: action?.payload,
        },
      }
    }
    case orderPageActionType?.SET_ORDER_DATA: {
      return {
        ...state,
        orders: {
          ...state?.orders,
          list: action?.payload?.list,
          totalPage: action?.payload?.totalPage,
        },
      }
    }
    case orderPageActionType?.RELOAD_ORDER_DATA: {
      return {
        ...state,
        orders: {
          ...state?.orders,
          reloadKey: Math?.random(),
        },
      }
    }
    case orderPageActionType?.SET_USER_ID: {
      return {
        ...state,
        userId: action?.payload,
        orders: initialDevicePageState?.()?.orders,
      }
    }
    case orderPageActionType?.SET_ORDER_OFFSET: {
      return {
        ...state,
        orders: {
          ...state?.orders,
          param: {
            ...state?.orders?.param,
            offset: action?.payload,
          },
        },
      }
    }
    case orderPageActionType?.SET_ORDER_LIMIT: {
      return {
        ...state,
        orders: {
          ...state?.orders,
          param: {
            ...state?.orders?.param,
            limit: action?.payload,
          },
        },
      }
    }
    case orderPageActionType?.SET_ORDER_Q_SEARCH: {
      return {
        ...state,
        orders: {
          ...state?.orders,
          param: {
            ...initialDevicePageState?.()?.orders?.param,
            q: action?.payload,
          },
        },
      }
    }
    default: {
      return state
    }
  }
}
