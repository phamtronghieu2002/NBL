import { axiosInstance } from "../axios/serverInstanceNoAuth"

import { CategoryType } from "../interface/interface"

export const addRemind = (data: any) => {
  return axiosInstance.post("/main/add-remind", data)
}

export const getRemindByLisencePlate = (lisense_plate: string) => {
  return axiosInstance.get("/main/get-vehicle-id/" + lisense_plate)
}


export const getRemindAll = () => {
  return axiosInstance.get("/main/get-all/")
}

