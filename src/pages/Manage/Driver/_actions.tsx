import { IDeviceInfo } from "../../../_types/deviceType"

export const pageAction = {
  setIsLoadingDevice(payload: boolean) {
    return {
      type: pageActionType?.SET_DATA_LOADING,
      payload,
    }
  },
  setData(payload: { list: IDeviceInfo[]; totalPage: number }) {
    return {
      type: pageActionType?.SET_DATA_DATA,
      payload,
    }
  },
  reloadData() {
    return {
      type: pageActionType?.RELOAD_DATA_DATA,
    }
  },
  setUserId(userId: number) {
    return {
      type: pageActionType?.SET_USER_ID,
      payload: userId,
    }
  },
  setDataOffset(offset: number) {
    return {
      type: pageActionType?.SET_DATA_OFFSET,
      payload: offset,
    }
  },
  setDataLimit(limit: number) {
    return {
      type: pageActionType?.SET_DATA_LIMIT,
      payload: limit,
    }
  },

  setDataQSearch(q: string) {
    return {
      type: pageActionType?.SET_DATA_Q_SEARCH,
      payload: q,
    }
  },
}

export const pageActionType = {
  SET_DATA_LOADING: "SET_DATA_LOADING",
  SET_DATA_DATA: "SET_DATA_DATA",
  RELOAD_DATA_DATA: "RELOAD_DATA_DATA",
  SET_DATA_LIMIT: "SET_DATA_LIMIT",
  SET_DATA_OFFSET: "SET_DATA_OFFSET",
  SET_DATA_Q_SEARCH: "SET_DATA_Q_SEARCH",

  SET_USER_ID: "SET_USER_ID",
}
