import { TireProps } from "../interface/interface"

import { axiosInstance } from "../axios/serverInstanceNoAuth"

export const getTire = (license_plate: string) => {
  return axiosInstance.get(`/tire/get-all/${license_plate}`)
}

export const addTire = (data: TireProps) => {
  return axiosInstance.post("/tire/add-tire", data)
}

export const deleteTire = (id: number) => {
  return axiosInstance.patch(`/tire/delete-tire/${id}`)
}

export const updateTire = (id: number,data:TireProps) => {
  return axiosInstance.put(`/tire/update-tire/${id}`,data)
}
