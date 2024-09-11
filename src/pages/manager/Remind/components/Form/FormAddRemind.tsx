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
import { FC, useContext, useEffect, useState, forwardRef, useRef } from "react"
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
import ModalCreateTire from "../../../../../conponents/modals/ModalCreateTire"
import { Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { getCategory } from "../../../../../apis/categoryAPI"
import { api } from "../../../../../_helper"
import { getTire } from "../../../../../apis/tireAPI"
import { t } from "i18next"
import MultiDateTimePicker from "./MultiRangeDateWithTimePickerProps"
import { log } from "console"

interface FormAddRemindProps {
  viahicleSelected?: ViahicleType[]
  initialValues?: any
  onSubmit: (formData: any, callback: any,images:any) => void
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

    const [timeSelect, setTimeSelect] = useState<any>([])

    const buttonDateRef = useRef<HTMLButtonElement>(null)

    const [randomKey, setRandomKey] = useState<number>(Math.random())
    const [imageFiles, setImageFiles] = useState<any[]>([])
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
      setCategories(res?.data)
    }
    const [form] = Form.useForm()

    useEffect(() => {
      // call api to get remindType
      if (Object.keys(initialValues).length === 0) {
        form.setFieldsValue({
          is_notified: true,
          note_repair: "Tới hạn thay dầu rồi,đi thay dầu thôi !!",
        })
      } else {
        initialValues.expiration_time = moment(
          initialValues?.expiration_timeStamp,
        )

        const tire = initialValues?.tire
        if (tire) {
          handleSelectViahicle(viahiclesStore?.viahiclesStore[0]?.license_plate)
        }
        form.setFieldsValue({
          ...initialValues,
          vehicles: viahiclesStore?.viahiclesStore[0]?.license_plate,
          tire: initialValues?.tire,
        })
        form.setFieldValue("cycle", initialValues?.cycle)
      }
      fetchCategory()
    }, [])
    //  handle getDataForm
    console.log("viahicle Store >>>", viahiclesStore)

    useEffect(() => {
      if (timeSelect.length > 0) {
        form.setFieldValue("schedules", timeSelect)
        form
          ?.validateFields()
          .then((values) => {
            console.log("values ne cac ban", values)

            const processedValuesForm = {
              ...values,
              expiration_time: values.expiration_time
                ? values.expiration_time.valueOf() // Chuyển đổi date thành timestamp
                : null,
              vehicles: values.vehicles
                ? [values.vehicles]
                : viahiclesStore?.viahiclesStore.map((item: ViahicleType) =>
                    viahiclesStore?.type ? item?.imei : item.license_plate,
                  ),
              is_notified: values.is_notified ? 0 : 1,
            }

            const formData = new FormData()
            // Thêm dữ liệu vào formData
            imageFiles.forEach((file) => {
              formData.append('images', file.originFileObj) // Đảm bảo là tệp ảnh gốc
            })

        
       
              
            console.log("formData >>>", formData);
            


            


            onSubmit(processedValuesForm, fetchCategory,formData) // Gửi dữ liệu đã xử lý
          })
          .catch(() => {
            console.log("Lỗi xác thực:")
          })
      }
    }, [timeSelect.length, randomKey])

    useEffect(() => {
      if (vhiahicleTire) {
        fetchTire()
      }
    }, [vhiahicleTire?.license_plate])

    const handleSelectViahicle = (value: string) => {
      const viahicle: any = viahicleSelected?.find((item: ViahicleType) =>
        viahiclesStore?.type == 0 ? item?.license_plate : item?.imei == value,
      )
      setViahicleTire(viahicle)
    }

    const handleSelectTypeRemind = (value: any) => {
      if (value === "khác") {
        setIsName(true)
      } else {
        setIsName(false)
      }

      if (value === 8) {
        setIsTireSelect(true)
        fetchTire()
      } else {
        setIsTireSelect(false)
      }
    }

    // Hàm xử lý khi ảnh được chọn
    const handleImageUpload = (file: any) => {
      const formData = new FormData()
      formData.append("image", file)
      setImageFiles((prev) => [...prev, formData])

      return false // Prevent automatic upload
    }

    console.log("imageFiles >>", imageFiles)

    const handleGetDataForm = () => {
      buttonDateRef.current?.click()
      setRandomKey(Math.random())
    }

    return (
      <div>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          disabled={false}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="remind_category_id"
            style={{ gap: 10 }}
            label="Loại nhắc nhở"
            rules={[{ required: true, message: "Vui lòng chọn loại nhắc nhở" }]}
          >
            <Select
              className="select-type-remind"
              onChange={handleSelectTypeRemind}
            >
              {categories.map((item: CategoryType) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}

              <Select.Option value="khác" key={100}>
                Khác
              </Select.Option>
            </Select>
          </Form.Item>

          {/* chọn phương tiện */}
          {(isTireSelect || initialValues?.remind_category_id == 8) && (
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
                      value={
                        viahiclesStore?.type == 0
                          ? item.license_plate
                          : item.imei
                      }
                    >
                      {item?.license_plate}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="relative">
                <Form.Item
                  className="flex-1"
                  name="tire_seri"
                  rules={[{ required: true, message: "Vui lòng chọn lốp" }]}
                  style={{ gap: 10 }}
                  label="Chọn Lốp"
                >
                  <Select className="select-viahicle">
                    {tires.map((item: TireProps) => (
                      <Select.Option key={item.id} value={item.seri}>
                        {item?.seri}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <ModalCreateTire
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
              name="cat_name"
              rules={[
                { required: true, message: "Vui lòng nhập tên loại nhắc nhở" },
              ]}
              style={{ gap: 10 }}
              label="Tên loại nhắc nhở"
            >
              <Input onChange={() => form.validateFields(["name"])} />
            </Form.Item>
          )}

          {viahiclesStore.type ? (
            <>
              <Form.Item
               
                name="km_before"
                label="Cảnh báo sau"
                rules={[
                  { required: true, message: "Vui lòng nhập KM cảnh báo" },
                ]}
              >
                <InputNumber
                  onChange={(value) => {
                    form.setFieldsValue({ km_before: value })
                  }}
                />
                <span style={{ marginLeft: 10, display: "inline-block" }}>
                  (KM)
                </span>
              </Form.Item>
            </>
          ) : (
            <></>
          )}

          <Form.Item
            name="expiration_time"
            label="Hạn nhắc nhở"
            rules={[{ required: true, message: "Vui lòng chọn ngày nhắc nhở" }]}
          >
            <DatePicker
              disabledDate={(current) => {
                return current && current < moment().endOf("day")
              }}
              onChange={() => form.validateFields(["remindDate"])}
            />
          </Form.Item>

          <Form.Item
            name="cycle"
            label="Chu kì"
            rules={[{ required: true, message: "Vui lòng nhập chu kì" }]}
          >
            <InputNumber
              value={form.getFieldValue("cycle")}
              onChange={(value) => {
                form.setFieldsValue({ cycle: value })
              }}
            />
            <span style={{ marginLeft: "10px", display: "inline-block" }}>
              Tháng
            </span>
          </Form.Item>
          <Form.Item
            name={"schedules"}
            label="Thời gian"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian nhắc nhở" },
            ]}
          >
            <MultiDateTimePicker
              ref={buttonDateRef}
              setValueTime={(value: any) => {
                setTimeSelect(value)
              }}
            />
            <Input
              className="!mt-[-30px]"
              value={timeSelect.length > 0 ? "ok" : ""}
              type="hidden"
            />
          </Form.Item>
          {/* đoạn này nè */}

          {/* Upload ảnh */}
          <Form.Item label="Tải lên hình ảnh" style={{ gap: 10 }}>
            <Upload
             multiple={true}
              accept=".png, .jpg, .jpeg"
              listType="picture-card"
              customRequest={({ file }) => handleImageUpload(file)} // Xử lý khi tải ảnh
              fileList={imageFiles} // Danh sách các ảnh đã tải lên
              onPreview={(file) => {
                // Hiển thị xem trước ảnh từ URL hoặc Blob
                const previewUrl =
                  file.url ||
                  file.thumbUrl ||
                  (file.originFileObj &&
                    URL.createObjectURL(file.originFileObj))
                const imgWindow = window.open(previewUrl)
                imgWindow?.document.write('<img src="' + previewUrl + '" />')
              }}
              onChange={({ fileList }) => setImageFiles(fileList)} // Cập nhật danh sách ảnh
              onRemove={(file) => {
                // Xóa ảnh
                setImageFiles((prev) => prev.filter((f) => f.uid !== file.uid))
              }}
              beforeUpload={(file) => {
                // Tạo URL xem trước ảnh
                (file as any).thumbUrl = URL.createObjectURL(file)
                return false // Ngăn chặn tự động upload
              }}
            >
              {imageFiles.length >= 5 ? null : ( // Giới hạn số lượng ảnh được tải lên
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="note_repair" label="Nội dung">
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
