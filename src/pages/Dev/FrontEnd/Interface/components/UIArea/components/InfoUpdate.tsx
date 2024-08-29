import React, { useContext, useRef, useState } from "react"
import { PlusOutlined, SaveFilled } from "@ant-design/icons"
import { Button, Image, Upload } from "antd"
import type { GetProp, UploadFile, UploadProps } from "antd"
import ImgCrop from "antd-img-crop"
import { UIAreaContext } from ".."
import { useAppSelector } from "../../../../../../../app/hooks"
import { LTitle } from "../../../../../../../conponents/TitleC/ComponentTitle"
import { UploadC } from "../../../../../../../conponents/UploadC"
import { handleData } from "../../../../../../../utils/handleData"
import { API_URL } from "../../../../../../../services/API"
import { FormC } from "../../../../../../../conponents/FormC"
import { PAGE_INTERFACE_INFO_FORM } from "../../../../../../../items/FORM_ITEMS"
import { FormInstance } from "antd/lib"
import { updateUIService } from "../../../../../../../services/interfaceServices"
import { api } from "../../../../../../../_helper"
import { getString } from "../../../../../../../utils/getString"
import { _app } from "../../../../../../../utils/_app"

export const InfoUpdate: React.FC = () => {
  const { ui, reload, setIsReloading } = useContext(UIAreaContext)
  const props = JSON.parse(ui?.content || "{}")

  const formRef = useRef<FormInstance<any>>(null)

  const onFinish = (vals: any) => {
    const body = {
      keyword: vals?.keyword,
      name: vals?.name,
      content: JSON.stringify({ ...props, ...(vals || {}) }),
      publish: 1,
    }

    if (!ui?.id) return api.message?.error("Không tìm thấy UI")

    const update = () => {
      setIsReloading?.(true)

      updateUIService(ui?.id, body)
        .then((fb: any) => {
          if (fb?.result) {
            api.message?.success(getString?.errorAxiosSuccess(fb))
          }
        })
        .catch((error) => {
          api.message?.error(getString?.errorAxiosParams(error))
          console.log(error)
        })
        .finally(() => {
          setIsReloading?.(false)
        })
    }

    api.modal?.confirm({
      title: "Xác nhận",
      content: "Xác nhận cập nhật thông tin",
      onOk: update,
    })
  }

  const handleSubmit = () => {
    formRef?.current?.submit?.()
  }

  const defaultData = {
    name: ui?.name,
    keyword: ui?.keyword,
    ...props,
  }

  return (
    <div className="">
      <FormC
        initialValues={defaultData}
        onFinish={onFinish}
        ref={formRef}
        chunk={3}
        fields={PAGE_INTERFACE_INFO_FORM}
      />
      <div>
        <Button type="primary" icon={<SaveFilled />} onClick={handleSubmit}>
          Lưu
        </Button>
      </div>
    </div>
  )
}
