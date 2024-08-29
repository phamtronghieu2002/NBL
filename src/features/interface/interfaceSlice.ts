import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../../app/store"
import { IUserInfo } from "../../_types/userType"
import { IServerMenu } from "../../_types/interfaceType"
import storage from "../../utils/storage"
import { _app } from "../../utils/_app"
import { _const } from "../../_constant"
import {
  MAP_LINE_TYPE_ITEMS,
  MAP_TYPE_ITEMS,
  VEHICLE_FONT_OPTIONS,
  VEHICLE_SCALE_OPTIONS,
} from "../../items/MAP_TYPE_ITEMS"

const initialSetting = _app?.getSetting()

export interface IRouteModalProps {
  isOpen: boolean
  imei?: string
  startTime?: number
  endTime?: number
}

interface IPageInterface {
  logo: string
  favicon: string
  banner: string[]
  title: string
  props: {
    [key: string]: string
  }

  sv_static_file: string
}

export interface IState {
  menu: IServerMenu[]
  menuObj: { [key: string]: IServerMenu }

  setting: {
    map_mapType: number
    map_mapLineType: number
    map_vehicleFrameWidth: number
    map_showLabel: boolean
    map_labelSize: number
    map_iconSize: number
    map_followVehicle: boolean
    map_followVehiclePlayback: boolean
    map_cursorHoverPlayback: boolean
    map_showParkingMarker: boolean
    map_markerClusterGroup: boolean
    map_showArrowMarker: boolean
    map_showRouteOnline: boolean
  }

  page: IPageInterface

  routeModal: IRouteModalProps

  online: {
    countdown: number
  }
}

const initialState: IState = {
  menu: [],
  menuObj: {},

  setting: {
    map_mapType: initialSetting?.map_mapType ?? MAP_TYPE_ITEMS?.[0]?.value,
    map_mapLineType:
      initialSetting?.map_mapLineType ?? MAP_LINE_TYPE_ITEMS?.[1]?.value,
    map_showLabel: initialSetting?.map_showLabel ?? false,
    map_labelSize:
      initialSetting?.map_labelSize ?? VEHICLE_FONT_OPTIONS?.[1]?.value,
    map_iconSize:
      initialSetting?.map_iconSize ?? VEHICLE_SCALE_OPTIONS?.[1]?.value,
    map_followVehicle: initialSetting?.map_followVehicle ?? false,
    map_cursorHoverPlayback: initialSetting?.map_cursorHoverPlayback ?? true,
    map_showParkingMarker: initialSetting?.map_showParkingMarker ?? true,
    map_markerClusterGroup: initialSetting?.map_markerClusterGroup ?? true,
    map_showArrowMarker: initialSetting?.map_showArrowMarker ?? true,
    map_followVehiclePlayback:
      initialSetting?.map_followVehiclePlayback ?? true,
    map_showRouteOnline: initialSetting?.map_showRouteOnline ?? true,

    map_vehicleFrameWidth:
      initialSetting?.map_vehicleFrameWidth ??
      _const?.interface?.map_vehicleFrameWidth,
  },

  page: {
    logo: "",
    favicon: "",
    banner: [],
    props: {},
    sv_static_file: "",
    title: "GIÁM SÁT HÀNH TRÌNH",
  },

  routeModal: {
    isOpen: false,
  },

  online: {
    countdown: -1,
  },
}

export const counterSlice = createSlice({
  name: "interface",
  initialState,
  reducers: {
    setMenu: (state, actions: { payload: IServerMenu[] }) => {
      state.menu = actions.payload

      const menu = [...actions.payload]

      const menuPathObj: { [key: string]: IServerMenu } = {}

      const setPathObj = (menu: IServerMenu) => {
        if (menu?.link && menu?.type != "title") {
          menuPathObj[menu?.link] = menu
        }

        if (menu?.child) {
          menu?.child?.forEach?.((m) => setPathObj(m))
        }
      }
      menu?.forEach?.((m) => setPathObj(m))

      state.menuObj = menuPathObj
    },

    settingApp: (
      state,
      actions: {
        payload: {
          key: string
          value: any
        }
      },
    ) => {
      const key = actions?.payload?.key
      const value = actions?.payload?.value

      if (!key) return
      state.setting = { ...state?.setting, [key]: value }

      storage.setItem(_const?.storeKey?.setting, state?.setting)
    },

    setRouteModalState: (
      state,
      actions: {
        payload: IRouteModalProps
      },
    ) => {
      state.routeModal = { ...state?.routeModal, ...actions?.payload }
    },

    setPageInterface: (
      state,
      actions: {
        payload: IPageInterface
      },
    ) => {
      state.page = actions?.payload
    },

    setDeviceOnlineCountDown: (state, actions: { payload: number }) => {
      state.online.countdown = actions?.payload
    },
    reduceDeviceOnlineCountDown: (state) => {
      if (state.online.countdown < 0) {
        return
      }
      state.online.countdown = state.online.countdown - 1
    },
  },
})

export const {
  setMenu,
  settingApp,
  setRouteModalState,
  setPageInterface,
  setDeviceOnlineCountDown,
  reduceDeviceOnlineCountDown,
} = counterSlice.actions

export default counterSlice.reducer
