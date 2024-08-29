import { IOrderInfo } from "../../../_types/ordersType"

export const orderPageAction = {
  setIsLoadingOrder(payload: boolean) {
    return {
      type: orderPageActionType?.SET_ORDER_LOADING,
      payload,
    }
  },
  setOrderData(payload: { list: IOrderInfo[]; totalPage: number }) {
    return {
      type: orderPageActionType?.SET_ORDER_DATA,
      payload,
    }
  },
  reloadOrderData() {
    return {
      type: orderPageActionType?.RELOAD_ORDER_DATA,
    }
  },
  setUserId(userId: number) {
    return {
      type: orderPageActionType?.SET_USER_ID,
      payload: userId,
    }
  },
  setOrderOffset(offset: number) {
    return {
      type: orderPageActionType?.SET_ORDER_OFFSET,
      payload: offset,
    }
  },
  setOrderLimit(limit: number) {
    return {
      type: orderPageActionType?.SET_ORDER_LIMIT,
      payload: limit,
    }
  },

  setOrderQSearch(q: string) {
    return {
      type: orderPageActionType?.SET_ORDER_Q_SEARCH,
      payload: q,
    }
  },
}

export const orderPageActionType = {
  SET_ORDER_LOADING: "SET_ORDER_LOADING",
  SET_ORDER_DATA: "SET_ORDER_DATA",
  RELOAD_ORDER_DATA: "RELOAD_ORDER_DATA",
  SET_ORDER_LIMIT: "SET_ORDER_LIMIT",
  SET_ORDER_OFFSET: "SET_ORDER_OFFSET",
  SET_ORDER_Q_SEARCH: "SET_ORDER_Q_SEARCH",

  SET_USER_ID: "SET_USER_ID",
}
