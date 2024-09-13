import { axiosInstance } from "../axios/serverInstanceNoAuth"


import { CategoryType } from "../interface/interface"

export const getCategory = () => {
  return axiosInstance.get("/category/get-all/get-all/by-user")
}

export const createCategory = (name: string,desc:string,icon:string) => {
  return axiosInstance.post("/category/add",{
    name,
    desc,
    icon
  })
}