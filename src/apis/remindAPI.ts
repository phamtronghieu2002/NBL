import { axiosInstance } from "../axios/serverInstanceNoAuth"

import { CategoryType } from "../interface/interface"

export const addRemind = (data: any) => {
  return axiosInstance.post("/main/add-remind", data)
}

export const updateRemind = (id: number, data: any) => {
  return axiosInstance.put("/main/update/" + id, data)
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

//localhost:3005/api/v1/remind/main/gps/get-all?vehicle_id=08F596398A&keyword=

export const getRemindVehicleGPS = (
  lisense_plate: string,
  keyword: string = "",
) => {
  return axiosInstance.get(
    `/main/gps/get-all?vehicle_id=${lisense_plate}&keyword=${keyword}`,
  )
}
