import { FC } from "react"
import { ModalCView } from "../ModalC/ModalC"
import React from "react"
import type { FormProps } from "antd"
import { Button, Input, Form } from "antd"
import { MaskLoader } from "../Loader"
import {
  addViahicle,
  deleteViahicle,
  getViahicle,
  updateViahicle,
} from "../../apis/viahicleAPI"
import { api } from "../../_helper"
import {
  ViahicleProviderContextProps,
  viahiclesContext,
} from "../../pages/manager/RemindMobile/providers/ViahicleProvider"
import { ViahicleType } from "../../interface/interface"
interface ModalAddViahicleProps {
  button: React.ReactNode
  type?: string
  data?: any
}

const onFinish: FormProps<ViahicleType>["onFinish"] = (values) => {
  console.log("Success:", values)
}

const onFinishFailed: FormProps<ViahicleType>["onFinishFailed"] = (
  errorInfo,
) => {
  console.log("Failed:", errorInfo)
}

const FormAdd: FC<{
  action: any
  initialValues?: ViahicleType
  data?: any
  type?: string
}> = ({ action, initialValues, data, type }) => {
  const [loading, setLoading] = React.useState(false)
  const { viahiclesStore, dispatch } = React.useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  const [form] = Form.useForm()
  const id: number = initialValues?.id ?? 0

  const getAction = () => {
    if (type == "add") {
      return {
        title: "Thêm Phương tiện",
        okButton: "Thêm",
        okCallback: () => {
          // validate form
          form
            .validateFields()
            .then(async (values) => {
              //call api thêm phương tiện
     
              setLoading(true)
              await addViahicle({
                ...values,
              })
              api.message?.success("Thêm phương tiện thành công")
              dispatch.freshKey()
              setLoading(false)
            })
            .catch((errorInfo) => {
              console.log("Validation Failed:", errorInfo)
            })
        },
      }
    }
    if (type == "delete") {
      return {
        title: "Xoá Phương tiện",
        okButton: "Xoá",
        okCallback: async () => {
          //call api xóa phương tiện

          setLoading(true)
          await deleteViahicle(id)
          api.message?.success("xóa phương tiện thành công")
          dispatch.freshKey()
          setLoading(false)
          action?.closeModal()
        },
      }
    }
    if (type == "update") {
      return {
        title: "Chỉnh sửa phương tiện",
        okButton: "Lưu",
        okCallback: () => {
          form
            .validateFields()
            .then(async (values) => {
              //call api chỉnh sửa phương tiện
              setLoading(true)
              await updateViahicle(id,values)
              api.message?.success("cập nhật phương tiện thành công")
              dispatch.freshKey()
              setLoading(false)
              action?.closeModal()
            })
            .catch((errorInfo) => {
              console.log("Validation Failed:", errorInfo)
            })
        },
      }
    }
  }

  return (
    <div>
      {type == "delete" ? (
        <p>Bạn có chắc chắn muốn xoá phương tiện này không?</p>
      ) : (
        <Form
          form={form}
          name="basic"
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            label="Biển số xe"
            name="license_plate"
            rules={[{ required: true, message: "Vui lòng nhập biển số xe!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giấy phép"
            name="license"
            rules={[
              { required: true, message: "Vui lòng nhập giấy phép lái xe!" },
            ]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            label="Tải trọng"
            name="viahicleWeight"
            rules={[{ required: true, message: "Vui lòng nhập tải trọng!" }]}
          >
            <Input />
          </Form.Item> */}
        </Form>
      )}
      <div className="flex justify-end gap-2">
        <Button onClick={action?.closeModal}>Hủy</Button>
        <Button
          onClick={getAction()?.okCallback}
          type="primary"
          htmlType="submit"
        >
          {getAction()?.okButton}
        </Button>
      </div>

      {loading && <MaskLoader />}
    </div>
  )
}

const ModalAddViahicle: FC<ModalAddViahicleProps> = ({
  data,
  button,
  type,
}) => {
  console.log("====================================")
  console.log("data", data)
  console.log("====================================")
  const getAction = () => {
    if (type === "add") {
      return {
        title: "Thêm phương tiện",
      }
    }
    if (type === "delete") {
      return {
        title: `Xoá xe ${data?.license_plate}`,
      }
    }
    if (type === "update") {
      return {
        title: `Chỉnh sửa xe ${data?.license_plate}`,
      }
    }
    return {}
  }

  return (
    <ModalCView
      modalProps={{
        width: 400,
      }}
      button={button}
      title={getAction()?.title}
      children={(action) => {
        return <FormAdd type={type} initialValues={data} action={action} />
      }}
    />
  )
}

export default ModalAddViahicle
