import { IDeviceInfo } from "../../../_types/deviceType"
import { IDriver } from "../../../_types/driverType"
import { store } from "../../../app/store"
import { pageActionType } from "./_actions"

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

interface IPageProp {
  isLoading: boolean
  list: IDriver[]
  totalPage: number
  param: ISearchParam
  reloadKey: number
}

export interface IInitialPageState {
  device: IPageProp
  userId: number
}

export const initialDevicePageState = (
  userIdDefault?: number,
): IInitialPageState => {
  const userId =
    userIdDefault || store?.getState()?.user?.access?.userInfo?.id || 9999
  return {
    device: {
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
    case pageActionType?.SET_DATA_LOADING: {
      return {
        ...state,
        device: {
          ...state?.device,
          isLoading: action?.payload,
        },
      }
    }
    case pageActionType?.SET_DATA_DATA: {
      return {
        ...state,
        device: {
          ...state?.device,
          list: action?.payload?.list,
          totalPage: action?.payload?.totalPage,
        },
      }
    }
    case pageActionType?.RELOAD_DATA_DATA: {
      return {
        ...state,
        device: {
          ...state?.device,
          reloadKey: Math?.random(),
        },
      }
    }
    case pageActionType?.SET_USER_ID: {
      return {
        ...state,
        userId: action?.payload,
        device: initialDevicePageState?.()?.device,
      }
    }
    case pageActionType?.SET_DATA_OFFSET: {
      return {
        ...state,
        device: {
          ...state?.device,
          param: {
            ...state?.device?.param,
            offset: action?.payload,
          },
        },
      }
    }
    case pageActionType?.SET_DATA_LIMIT: {
      return {
        ...state,
        device: {
          ...state?.device,
          param: {
            ...state?.device?.param,
            limit: action?.payload,
          },
        },
      }
    }
    case pageActionType?.SET_DATA_Q_SEARCH: {
      return {
        ...state,
        device: {
          ...state?.device,
          param: {
            ...initialDevicePageState?.()?.device?.param,
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
