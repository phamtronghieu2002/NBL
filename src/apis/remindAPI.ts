import axios from "axios"
import { axiosInstance } from "../axios/serverInstanceNoAuth"

import { CategoryType } from "../interface/interface"
import { getTokenParam } from "../utils/_param"
import storage from "../utils/storage"

export const getIconRemindViahicleGPS = () => {
  return axiosInstance.get(`/main/get-category-all`)
}

export const addRemind = (data: any) => {
  return axios.post(
    "http://26.73.188.74:3005/api/v1/remind/main/add-remind",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-mobicam-token": storage.getAccessToken(),
      },
    },
  )
}

export const updateRemind = (id: number, data: any) => {
  return axiosInstance.put("/main/update/" + id, data)
}

export const getTimeRemind = (id: number) => {
  return axiosInstance.get("/main/get-schedule/" + id)
}

export const AutoFinishRemind = (id: number) => {
  return axiosInstance.post("/main/finish-remind/" + id)
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
