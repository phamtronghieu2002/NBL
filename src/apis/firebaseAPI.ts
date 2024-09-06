import { axiosFireBaseInstance } from "../axios/serverInstanceNoAuth"

export const addFirebaseToken = (token:string) => {
        return axiosFireBaseInstance.post("/add", {token})
}



