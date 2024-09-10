import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
} from "antd"
import TextArea from "antd/es/input/TextArea"
import { FC, useContext, useEffect, useState, forwardRef } from "react"
import moment from "moment"
import { use } from "i18next"
import {
  CategoryType,
  TireProps,
  ViahicleType,
} from "../../../../../interface/interface"
import {
  ViahicleProviderContextProps,
  viahiclesContext,
} from "../../providers/ViahicleProvider"
import ModalCreateTireMobile from "../../../../../conponents/modals/ModalCreateTireMobile"
import { Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { FormInstance } from "antd/lib"
import { getCategory } from "../../../../../apis/categoryAPI"
import { api } from "../../../../../_helper"
import { getTire } from "../../../../../apis/tireAPI"
import { t } from "i18next"
import MultiDateTimePicker, {
  DateTimeRange,
} from "./MultiRangeDateWithTimePickerProps"

interface FormAddRemindProps {
  viahicleSelected?: ViahicleType[]
  initialValues?: any
  onSubmit: (formData: any) => void
}

const FormAddRemind = forwardRef<HTMLButtonElement, FormAddRemindProps>(
  ({ onSubmit, initialValues, viahicleSelected }, ref) => {
    const [isName, setIsName] = useState<boolean>(false)
    const [isTireSelect, setIsTireSelect] = useState<boolean>(false)
    const [tires, setTires] = useState<any>([])

    const [isReloadTableTire, setIsReloadTableTire] = useState<number>(
      Math.random(),
    )
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined) // State để lưu URL của ảnh preview

    const [categories, setCategories] = useState<CategoryType[]>([])

    const { viahiclesStore } = useContext(
      viahiclesContext,
    ) as ViahicleProviderContextProps

    const [vhiahicleTire, setViahicleTire] = useState<ViahicleType | null>(null)
    const initDateDate: DateTimeRange[] = [
      {
        start: 1725555600000,
        end: 1725555600000,
        time: "00:12:00",
      },
      {
        start: 1725555600000,
        end: 1725555600000,
        time: "06:00:00",
      },
    ]

    const fetchTire = async () => {
      try {
        const res = await getTire(vhiahicleTire?.license_plate || "", "")

        setTires(res?.data)
      } catch (error) {
        // api.message?.error("Lỗi khi lấy dữ liệu lốp")
      }

      // setIsReloadTableTire(Math.random())
    }

    const fetchCategory = async () => {
      const res = await getCategory()
      setCategories(res.data)
    }
    const [form] = Form.useForm()

    useEffect(() => {
      // call api to get remindType

      form.setFieldsValue({ remind_category_id: 2 })
      form.setFieldsValue({ is_notified: true })
      // form.setFieldsValue({ viahicles: viahiclesStore.viahiclesStore.map((items: ViahicleType) => items?.id) });

      fetchCategory()
    }, [])

    useEffect(() => {
      if (vhiahicleTire) {
        fetchTire()
      }
    }, [vhiahicleTire?.license_plate])

    const handleSelectViahicle = (value: string) => {
      const viahicle: any = viahicleSelected?.find(
        (item: ViahicleType) => item?.license_plate == value,
      )
      setViahicleTire(viahicle)
    }

    const handleSelectTypeRemind = (value: any) => {
      if (value === "khac") {
        setIsName(true)
      } else {
        setIsName(false)
      }

      if (value === 1) {
        setIsTireSelect(true)
        fetchTire()
      } else {
        setIsTireSelect(false)
      }
    }

    // Hàm xử lý khi ảnh được chọn
    const handleImageUpload = (file: any) => {
      const reader = new FileReader()
      reader.onload = () => {
        setImageUrl(reader.result as string)
        const formData = new FormData()
        formData.append("image", file)
        form.setFieldsValue({ img: formData })
      }
      reader.readAsDataURL(file)
      return false
    }

    const handleGetDataForm = () => {
      form
        ?.validateFields()
        .then((values) => {
          const processedValuesForm = {
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
          onSubmit(processedValuesForm) // Gửi dữ liệu đã xử lý
        })
        .catch(() => {
          console.log("Lỗi xác thực:")
        })
    }

    return (
      <div>
        <Form
          form={form}
          onFinish={onSubmit}
          initialValues={initialValues}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          disabled={false}
          style={{ maxWidth: 600 }}
        >
          {/* loại nhắc nhở */}
          <Form.Item
            name="remind_category_id"
            style={{ gap: 10 }}
            label="Loại nhắc nhở"
          >
            <Select
              className="select-type-remind"
              onChange={handleSelectTypeRemind}
              defaultValue={1}
            >
              {categories.map((item: CategoryType) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}

              <Select.Option value="khac">Khác</Select.Option>
            </Select>
          </Form.Item>

          {/* chọn phương tiện */}
          {isTireSelect && (
            <>
              <Form.Item
                name="vehicles"
                rules={[{ required: true, message: "Vui lòng chọn xe" }]}
                style={{ gap: 10 }}
                label="Chọn xe"
              >
                <Select
                  className="select-viahicle"
                  onChange={(value: any) => {
                    handleSelectViahicle(value)
                    form.validateFields(["vehicles"])
                  }}
                >
                  {viahicleSelected?.map((item: ViahicleType) => (
                    <Select.Option
                      key={item.license_plate}
                      value={item.license_plate}
                    >
                      {item?.license_plate}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="relative">
                <Form.Item
                  className="flex-1"
                  name="tire"
                  rules={[{ required: true, message: "Vui lòng chọn lốp" }]}
                  style={{ gap: 10 }}
                  label="Chọn Lốp"
                >
                  <Select className="select-viahicle">
                    {tires.map((item: TireProps) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item?.seri}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <ModalCreateTireMobile
                  isAddTireButton={false}
                  data={vhiahicleTire}
                  isReload={isReloadTableTire}
                  isInModalRemind
                  onRefresh={fetchTire}
                  type="add"
                  button={
                    <Button
                      disabled={!vhiahicleTire}
                      className="absolute right-[-20px] top-0"
                      icon={<PlusOutlined />}
                    >
                      Thêm lốp
                    </Button>
                  }
                />
              </div>
            </>
          )}

          {/* tên nhắc nhở */}
          {isName && (
            <Form.Item
              name="customRemindName"
              rules={[
                { required: true, message: "Vui lòng nhập tên loại nhắc nhở" },
              ]}
              style={{ gap: 10 }}
              label="Tên loại nhắc nhở"
            >
              <Input
                onChange={() => form.validateFields(["customRemindName"])}
              />
            </Form.Item>
          )}

          {viahiclesStore.type ? (
            <>
              <Form.Item
                name="current_kilometers"
                label="KM đầu kì"
                rules={[{ required: true, message: "Vui lòng nhập KM đầu kì" }]}
              >
                <InputNumber
                  onChange={(value) => {
                    form.setFieldsValue({ current_kilometers: value })
                    form.validateFields(["current_kilometers"])
                  }}
                  min={0}
                />
                <span style={{ marginLeft: 10, display: "inline-block" }}>
                  (KM)
                </span>
              </Form.Item>
              <Form.Item
                name="cumulative_kilometers"
                label="Cảnh báo sau"
                rules={[
                  { required: true, message: "Vui lòng nhập KM cảnh báo" },
                ]}
              >
                <InputNumber
                  onChange={(value) => {
                    form.setFieldsValue({ cumulative_kilometers: value })
                    form.validateFields(["cumulative_kilometers"])
                  }}
                />
                <span style={{ marginLeft: 10, display: "inline-block" }}>
                  (KM)
                </span>
              </Form.Item>
              <Form.Item
            name="km_before"
            label="Nhắc nhở trước"
            rules={[
              { required: true, message: "Vui lòng nhập số ngày nhắc trước" },
            ]}
          >
            <InputNumber
              onChange={(value) => {
                form.setFieldsValue({ time_before: value })
                form.validateFields(["time_before"])
              }}
            />
            <span style={{ marginLeft: "10px", display: "inline-block" }}>
              km
            </span>
          </Form.Item>
            </>
          ):<></>}         

          <Form.Item
            name="expiration_time"
            label="Ngày nhắc nhở"
            rules={[{ required: true, message: "Vui lòng chọn ngày nhắc nhở" }]}
          >
            <DatePicker
              disabledDate={(current) => {
                return current && current < moment().endOf("day")
              }}
              onChange={() => form.validateFields(["remindDate"])}
            />
          </Form.Item>

  
          <MultiDateTimePicker initialValues={initDateDate} />
          {/* Upload ảnh */}
          <Form.Item name="img" label="Hình ảnh">
            <Upload
              beforeUpload={handleImageUpload}
              listType="picture-card"
              showUploadList={false}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="preview" style={{ width: "100%" }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="note_repair" label="Ghi chú">
            <TextArea />
          </Form.Item>

          <Form.Item
            name="is_notified"
            label="Bật thông báo"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>

          {/*  */}
        </Form>

        <button onClick={handleGetDataForm} ref={ref}></button>
      </div>
    )
  },
)

export default FormAddRemind
