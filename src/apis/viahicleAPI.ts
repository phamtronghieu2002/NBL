import { axiosInstance } from "../axios/serverInstanceNoAuth"

import { ViahicleType } from "../interface/interface"

export const getViahicle = (keyword: string) => {
  return axiosInstance.get("/main/get-all?keyword=" + keyword)
}

export const addViahicle = (data: ViahicleType) => {
  return axiosInstance.post("/vehicle-no-gps/add-vehicle", [data])
}

export const addViahicles = (data: ViahicleType[]) => {
  return axiosInstance.post("/vehicle-no-gps/get-all", data)
}

export const deleteViahicle = (id: number) => {
  return axiosInstance.put(`/vehicle-no-gps/delete-vehicle/${id}`)
}

export const updateViahicle = (id: number, data: ViahicleType) => {
  console.log("====================================")
  console.log("cac ban oi", data)
  console.log("====================================")
  return axiosInstance.put(`/vehicle-no-gps/update-vehicle/${id}`, data)
}
