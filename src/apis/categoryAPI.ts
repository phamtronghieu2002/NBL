import { axiosInstance } from "../axios/serverInstanceNoAuth"


import { CategoryType } from "../interface/interface"

export const getCategory = () => {
  return axiosInstance.get("/category/get-all")
}