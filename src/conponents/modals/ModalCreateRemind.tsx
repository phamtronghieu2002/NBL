import { FC, useEffect, useRef, useState } from "react"
import { ModalCView } from "../ModalC/ModalC"
import { Button } from "antd"
import FormAddRemind from "../../pages/manager/Remind/components/Form/FormAddRemind"
import { FileExcelOutlined } from "@ant-design/icons"
import { useContext } from "react"
import {
  viahiclesContext,
  ViahicleProviderContextProps,
} from "../../pages/manager/Remind/providers/ViahicleProvider"
import { api } from "../../_helper"
import { MaskLoader } from "../Loader"
import { ViahicleType } from "../../interface/interface"
import { addRemind, updateRemind } from "../../apis/remindAPI"
import { log } from "console"
import { createCategory } from "../../apis/categoryAPI"
import moment from "moment"
interface ModalCreateRemindProps {
  remindData?: any
  button: React.ReactNode
  isShow?: boolean
  onReload?: () => void
  type?: string
}

const Form: FC<{
  action: any
  onReload?: () => void
  remindData?: any
  type?: string
}> = ({ action, onReload, remindData = {}, type }) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: any, callback: any) => {
      
    console.log('====================================');
    console.log("formData >>", formData);
    console.log('====================================');
    const cate_name = formData["cat_name"]
    if (cate_name) {
      const cat = await createCategory(cate_name,"", "")
      formData["remind_category_id"] = cat.data
      callback()
    }
    // call api thêm nhắc nhở
    setLoading(true)
    await addRemind(formData)
    action?.closeModal?.()
    api.message?.success("Thêm nhắc nhở thành công")
    onReload?.()
  }
  const handleUpdate = async (formData: any, callback: any) => {
    console.log("formData", formData)
    // call api sửa nhắc nhở
    // setLoading(true)
    // await updateRemind(remindData?.remind_id, formData)
    // action?.closeModal?.()
    // api.message?.success("cập nhật nhắc nhở thành công")
    // onReload?.()
  }
  const handleFormData: any = type == "add" ? handleSubmit : handleUpdate

  const { viahiclesStore } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps
  const viahicleSelected = viahiclesStore.viahiclesStore
  const buttonRef = useRef<HTMLButtonElement>(null)

  const getAction = () => {
    if (type == "add") {
      return {
        title: "Thêm nhắc nhở",
        okButton: "Thêm",
        okCallback: onsubmit,
      }
    }

    if (type == "update") {
      return {
        title: "Chỉnh sửa nhắc nhở",
        okButton: "Lưu",
        okCallback: onsubmit,
      }
    }
  }

  // handle add remind
  const onsubmit = () => {
    buttonRef.current?.click()
  }

  return (
    <div>
      {loading && <MaskLoader />}
      <FormAddRemind
        initialValues={remindData}
        // initialValues={
        //   {
        //     // note_repair: "123",
        //     // current_kilometers: 10,
        //     // remind_category_id: 1,
        //     // cumulative_kilometers: 20,
        //   }
        // }
        ref={buttonRef}
        viahicleSelected={viahicleSelected}
        onSubmit={handleFormData}
      />
      <div className="actions flex justify-end">
        <Button
          className="mr-3"
          onClick={() => {
            action?.closeModal?.()
          }}
        >
          Hủy
        </Button>
        <Button type="primary" onClick={getAction()?.okCallback}>
          {getAction()?.okButton}
        </Button>
      </div>
    </div>
  )
}

const ModalCreateRemind: FC<ModalCreateRemindProps> = ({
  isShow = false,
  button,
  onReload,
  remindData,
  type = "add",
}) => {
  const { viahiclesStore } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps
  console.log("viahiclesStore", viahiclesStore)

  const isTimestamp = (value: any) => {
    return typeof value === "number" && value > 1000000000
  }

  const convertTimestampsToMoment = (data: any) => {
    const convertedData = { ...data }

    Object.keys(convertedData).forEach((key) => {
      if (isTimestamp(convertedData[key])) {
        // Chỉ chuyển đổi nếu là timestamp
        convertedData[key] = moment(convertedData[key])
      }
    })

    return convertedData
  }

  const getAction = () => {
    if (type === "add") {
      return {
        title: "Tạo nhắc nhở",
      }
    }

    if (type === "update") {
      return {
        title: `sửa nhắc nhở`,
      }
    }
  }

  return (
    <ModalCView
      isShow={isShow}
      isValidToOpen={viahiclesStore.viahiclesStore.length > 0}
      button={button}
      title={getAction()?.title}
      children={(action) => (
        <Form
          type={type}
          remindData={convertTimestampsToMoment(remindData)}
          onReload={onReload}
          action={action}
        />
      )}
    />
  )
}

export default ModalCreateRemind
