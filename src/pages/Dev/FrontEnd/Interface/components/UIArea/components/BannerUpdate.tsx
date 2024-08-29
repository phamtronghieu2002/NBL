import React, { useContext, useState } from "react"
import { PlusOutlined } from "@ant-design/icons"
import { Image, Upload } from "antd"
import type { GetProp, UploadFile, UploadProps } from "antd"
import ImgCrop from "antd-img-crop"
import { UIAreaContext } from ".."
import { useAppSelector } from "../../../../../../../app/hooks"
import { LTitle } from "../../../../../../../conponents/TitleC/ComponentTitle"
import { UploadC } from "../../../../../../../conponents/UploadC"
import { handleData } from "../../../../../../../utils/handleData"
import { API_URL } from "../../../../../../../services/API"
import { _array } from "../../../../../../../utils/_array"
import { getString } from "../../../../../../../utils/getString"

export const BannerUpdate: React.FC = () => {
  const { ui, reload } = useContext(UIAreaContext)
  const sv_static_file = useAppSelector(
    (state) => state?.interface?.page?.sv_static_file,
  )
  const content = JSON.parse(ui?.content || "{}")
  const logo = content?.logo
  const logoUrl = `${sv_static_file}/${logo}`

  const bannerList = ui ? _array.getbannerListByUI?.(ui, sv_static_file) : []
  return (
    <div className="flex flex-col gap-2 items-center">
      <UploadC
        defaultList={
          logo ? handleData.getImgReviewListByPathList(bannerList) : []
        }
        uploadPromiseProps={{
          api: API_URL.uploadBanner,
          body: {
            id: `${ui?.id}`,
            property: JSON.stringify([`___banner_ss${getString.uuidv4()}`]),
          },
          fileKey: "banner",
          onSuccess: () => {
            reload?.()
          },
        }}
        removePromiseProps={{
          api: API_URL.deleteImage,
          body: (file: UploadFile<any>) => ({
            id: `${ui?.id}`,
            path: file?.uid,
            property: file?.name,
          }),
          onSuccess: () => {
            reload?.()
          },
        }}
        fillColor="#00000000"
        confirmText="Xác nhận tải lên Banner"
        lim={10}
      />
      {/* <LTitle title="Logo trang" /> */}
    </div>
  )
}
