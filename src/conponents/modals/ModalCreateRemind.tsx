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
import { FormInstance } from "antd/lib"
import { ac } from "vitest/dist/types-e3c9754d.js"
import { api } from "../../_helper"
import { MaskLoader } from "../Loader"
import { ViahicleType } from "../../interface/interface"
import { addRemind } from "../../apis/remindAPI"
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
}> = ({ action, onReload, remindData, type }) => {
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (formData: any) => {
    // call api thêm nhắc nhở
    // setLoading(true)
    await addRemind(formData)
    // action?.closeModal?.()
    api.message?.success("Thêm nhắc nhở thành công")
    onReload?.()
  }

  const { viahiclesStore } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps
  const viahicleSelected = viahiclesStore.viahiclesStore
  const formRef = useRef<FormInstance<any>>(null)

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
        okCallback: () => {
          // call api update nhắc nhở
          setLoading(true)
          // await addRemind(formData)
          // action?.closeModal?.()
          api.message?.success("Cập nhật nhắc nhở thành công")
          onReload?.()
        },
      }
    }
  }

  // handle add remind
  const onsubmit = () => {
    formRef.current
      ?.validateFields()
      .then((values) => {
        // Xử lý dữ liệu form trước khi submit
        const processedValues = {
          ...values,
          expiration_time: values.expiration_time
            ? values.expiration_time.valueOf() // Chuyển đổi date thành timestamp
            : null,
          vehicles: values.vehicles
            ? [values.vehicles]
            : viahiclesStore?.viahiclesStore.map(
                (item: ViahicleType) => item.license_plate,
              ),
          is_notified: values.is_notified ? 1 : 0,
        }

        handleSubmit(processedValues) // Gửi dữ liệu đã xử lý
      })
      .catch((errorInfo) => {
        console.log("Lỗi xác thực:")
      })
  }

  return (
    <div>
      {loading && <MaskLoader />}
      <FormAddRemind
        initialValues={remindData}
        ref={formRef}
        viahicleSelected={viahicleSelected}
        onSubmit={handleSubmit}
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
          remindData={remindData}
          onReload={onReload}
          action={action}
        />
      )}
    />
  )
}

export default ModalCreateRemind
