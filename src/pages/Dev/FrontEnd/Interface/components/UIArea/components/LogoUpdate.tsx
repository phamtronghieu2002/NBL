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

export const LogoUpdate: React.FC = () => {
  const { ui, reload } = useContext(UIAreaContext)
  const sv_static_file = useAppSelector(
    (state) => state?.interface?.page?.sv_static_file,
  )
  const content = JSON.parse(ui?.content || "{}")
  const logo = content?.logo
  const logoUrl = `${sv_static_file}/${logo}`

  return (
    <div className="flex flex-col gap-2 items-center">
      <UploadC
        defaultList={logo ? handleData.getImgReviewList([logoUrl]) : []}
        uploadPromiseProps={{
          api: API_URL.uploadLogo,
          body: { id: `${ui?.id}` },
          fileKey: "logo",
          onSuccess: () => {
            reload?.()
          },
        }}
        fillColor="#00000000"
        confirmText="Xác nhận thay đổi Logo"
      />
      <LTitle title="Logo trang" />
    </div>
  )
}
