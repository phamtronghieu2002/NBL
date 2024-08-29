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

export const FaviconUpdate: React.FC = () => {
  const { ui, reload } = useContext(UIAreaContext)
  const sv_static_file = useAppSelector(
    (state) => state?.interface?.page?.sv_static_file,
  )
  const content = JSON.parse(ui?.content || "{}")
  const favicon = content?.favicon
  const faviconUrl = `${sv_static_file}/${favicon}`

  return (
    <div className="flex flex-col gap-2 items-center">
      <UploadC
        defaultList={favicon ? handleData.getImgReviewList([faviconUrl]) : []}
        uploadPromiseProps={{
          api: API_URL.uploadFavicon,
          body: { id: `${ui?.id}` },
          fileKey: "favicon",
          onSuccess: () => {
            reload?.()
          },
        }}
        fillColor="#00000000"
        confirmText="Xác nhận thay đổi favicon"
      />
      <LTitle title="favicon" />
    </div>
  )
}
