import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  Modal,
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
import { getTimeRemind } from "../../../../../apis/remindAPI"
import { MaskLoader } from "../../../../../conponents/Loader"

import { FilePond, registerPlugin } from "react-filepond"
import "filepond/dist/filepond.min.css"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"

// Đăng ký plugin
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType)

interface FormAddRemindProps {
  viahicleSelected?: ViahicleType[]
  initialValues?: any
  onSubmit: (formData: any, callback: any, images: any) => void
}

const FormAddRemind = forwardRef<HTMLButtonElement, FormAddRemindProps>(
  ({ onSubmit, initialValues, viahicleSelected }, ref) => {
    const [isName, setIsName] = useState<boolean>(false)
    const [isTireSelect, setIsTireSelect] = useState<boolean>(false)
    const [tires, setTires] = useState<any[]>([])

    const [isReloadTableTire, setIsReloadTableTire] = useState<number>(
      Math.random(),
    )
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined) // State để lưu URL của ảnh preview

    const [categories, setCategories] = useState<CategoryType[]>([])

    const { viahiclesStore } = useContext(
      viahiclesContext,
    ) as ViahicleProviderContextProps

    const [vhiahicleTire, setViahicleTire] = useState<ViahicleType | null>(null)

    const [timeSelect, setTimeSelect] = useState<any[]>([])

    const buttonDateRef = useRef<HTMLButtonElement>(null)

    const [randomKey, setRandomKey] = useState<number>(Math.random())
    const [imageFiles, setImageFiles] = useState<any[]>([])
    const [schedules, setSchedules] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [previewVisible, setPreviewVisible] = useState<boolean>(false)

  
    useEffect(() => {
      const fetchTime = async (id: number) => {
        try {
          const res = await getTimeRemind(id)
          setSchedules(res?.data)
        } catch (error) {
          console.log("error time >>>", error)
        }
      }

      if (initialValues?.id) {
        fetchTime(initialValues?.id)
      }
    }, [])
    const fetchTire = async () => {
      try {
   
        const license_plate = vhiahicleTire?.license_plate || ""
        console.log('====================================');
        console.log("license_plate >>",license_plate);
        console.log('====================================');
        const res = await getTire(license_plate || "", "")
        console.log('====================================');
        console.log("du lieu lop cua xe",res?.data);
        console.log('====================================');
        setTires(res?.data)
      } catch (error) {
        api.message?.error("Lỗi khi lấy dữ liệu lốp")
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

      console.log("initialValues >>>", initialValues)

      if (Object.keys(initialValues).length === 0) {
        form.setFieldsValue({
          is_notified: true,
          note_repair: "Tới hạn thay dầu rồi,đi thay dầu thôi !!",
        })
      } else {
        // cộng thêm n tháng
        setLoading(true)
        initialValues.expiration_time = moment(
          initialValues?.expiration_timeStamp,
        ).add(initialValues?.cycle, "months")

        const tire = initialValues?.tire
        if (tire) {
          handleSelectViahicle(viahiclesStore?.viahiclesStore[0]?.license_plate)
        }
        form.setFieldsValue({
          ...initialValues,
          vehicles: viahiclesStore?.viahiclesStore[0]?.license_plate,
          tire: initialValues?.tire,
          is_notified: initialValues?.is_notified == 0 ? true : false,
        })
      }
      fetchCategory()
      setLoading(false)
    }, [])
    //  handle getDataForm

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
              formData.append("images", file.originFileObj) // Đảm bảo là tệp ảnh gốc
            })

            onSubmit(processedValuesForm, fetchCategory, formData) // Gửi dữ liệu đã xử lý
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
    console.log("====================================")
    console.log("selected viahicle", viahicleSelected)
    console.log("====================================")

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
    const handleImageUpload = (file: any, action: string) => {
      const formData = new FormData()
      if (action === "add") {
        console.log("====================================")
        console.log("filehihhihihihi", file)
        console.log("====================================")
        formData.append("image", file) // Thêm ảnh mới vào FormData
        setImageFiles((prev) => [...prev, formData])
      } else if (action === "remove") {
        setImageFiles((prev) => prev.filter((item) => item.name !== file.name)) // Xóa ảnh
      }

      return false // Ngăn việc upload tự động
    }

    console.log("====================================")
    console.log("imageFiles", imageFiles)
    console.log("====================================")

    const handleGetDataForm = () => {
      buttonDateRef.current?.click()
      setRandomKey(Math.random())
    }

    const handleImagePreview = (file: any) => {
      alert("preview")
      setPreviewImage(file.thumbUrl || file.url)
      setPreviewVisible(true)
    }

    const handleCancelPreview = () => {
      setPreviewImage(null)
      setPreviewVisible(false)
    }

    return (
      <div>
        {loading && <MaskLoader />}
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

              {/* <Select.Option value="khác" key={100}>
                Khác
              </Select.Option> */}
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
                      disabled={vhiahicleTire ? false : true}
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
                label="Cảnh báo trước"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập KM cảnh báo trước",
                  },
                ]}
              >
                <InputNumber
                  value={form.getFieldValue("km_before")}
                  onChange={(value) => {
                    form.setFieldsValue({ km_before: value })
                  }}
                />
                <span style={{ marginLeft: 10, display: "inline-block" }}>
                  (KM)
                </span>
              </Form.Item>

              <Form.Item
                name="cumulative_kilometers"
                label="KM cảnh báo"
                rules={[
                  { required: true, message: "Vui lòng nhập KM cảnh báo" },
                ]}
              >
                <InputNumber
                  value={form.getFieldValue("cumulative_kilometers")}
                  onChange={(value) => {
                    form.setFieldsValue({ cumulative_kilometers: value })
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
              initialValues={schedules}
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
            <FilePond
              files={imageFiles}
              allowMultiple={true}
              maxFiles={5}
              onupdatefiles={(fileItems) => {
                const newFiles = fileItems.map((fileItem) => fileItem.file)
                setImageFiles(newFiles) // Update imageFiles state
              }}
              acceptedFileTypes={["image/*"]}
              name="images"
              labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
              onaddfile={(error, fileItem) => {
                if (!error) {
                  handleImageUpload(fileItem.file, "add") // Handle add action
                }
              }}
              onremovefile={(error, fileItem) => {
                if (!error) {
                  handleImageUpload(fileItem.file, "remove") // Handle remove action
                }
              }}
            />
            {/* <Upload
              multiple={true}
              accept=".png, .jpg, .jpeg"
              listType="picture-card"
              customRequest={({ file }) => handleImageUpload(file)} // Xử lý khi tải ảnh
              fileList={imageFiles} // Danh sách các ảnh đã tải lên
              onPreview={handleImagePreview}
              onChange={({ fileList }) => setImageFiles(fileList)} // Cập nhật danh sách ảnh
              onRemove={(file) => {
                // Xóa ảnh
                setImageFiles((prev) => prev.filter((f) => f.uid !== file.uid));
              }}
              beforeUpload={(file) => {
                // Tạo URL xem trước ảnh
                ;(file as any).thumbUrl = URL.createObjectURL(file);
                return false; // Ngăn chặn tự động upload
              }}
            >
              {imageFiles.length >= 5 ? null : ( // Giới hạn số lượng ảnh được tải lên
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={handleCancelPreview}
            >
              <img
                alt="preview"
                style={{ width: "100%" }}
                src={previewImage ?? ""}
              />
            </Modal> */}
          </Form.Item>

          <Form.Item name="note_repair" label="Nội dung">
            <TextArea />
          </Form.Item>

          <Form.Item
            name="is_notified"
            label="Bật thông báo"
            valuePropName="checked"
          >
            <Switch checked />
          </Form.Item>

          {/*  */}
        </Form>

        <button onClick={handleGetDataForm} ref={ref}></button>
      </div>
    )
  },
)

export default FormAddRemind
