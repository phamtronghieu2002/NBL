import axios from "axios"
import { axiosInstance } from "../axios/serverInstanceNoAuth"

import { CategoryType } from "../interface/interface"
import { getTokenParam } from "../utils/_param"
import storage from "../utils/storage"
import { store } from "../app/store"
const SERVER_DOMAIN_REMIND = import.meta.env.VITE_HOST_REMIND_SERVER_DOMAIN

export const getIconRemindViahicleGPS = () => {
  return axiosInstance.get(`/main/get-category-all`)
}

export const addRemind = (data: any) => {
  return axios.post(`${SERVER_DOMAIN_REMIND}main/add-remind`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-mobicam-token": storage.getAccessToken(),
    },
  })
}

export const updateRemind = (id: number, data: any) => {
  return axios.put(`${SERVER_DOMAIN_REMIND}main/update/` + id, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-mobicam-token": storage.getAccessToken(),
    },
  })
}

export const getTimeRemind = (id: number) => {
  return axiosInstance.get("/main/get-schedule/" + id)
}

export const AutoFinishRemind = (id: number) => {
  return axiosInstance.post("/main/finish-remind/" + id, {
    token: storage?.getAccessToken(),
  })
}
export const getRemindByLisencePlate = (lisense_plate: string) => {
  return axiosInstance.get("/main/get-vehicle-id/" + lisense_plate)
}

export const getRemindAll = () => {
  return axiosInstance.get("/main/get-all/")
}

export const getRemindSearch = (keyword: string, lisense_plate: string) => {
  return axiosInstance.get(
    "/main/get-all?keyword=" + keyword + "&vehicle_id=" + `'${lisense_plate}'`,
  )
}

export const TurnOnRemind = (id: number) => {
  return axiosInstance.patch("/main/update-notified-on/" + id)
}

export const TurnOffRemind = (id: number) => {
  return axiosInstance.patch("/main/update-notified-off/" + id)
}

export const getRemindVehicleGPS = (
  lisense_plate: string,
  keyword: string = "",
) => {
  return axiosInstance.get(
    `/main/gps/get-all?vehicle_id=${lisense_plate}&keyword=${keyword}`,
  )
}
