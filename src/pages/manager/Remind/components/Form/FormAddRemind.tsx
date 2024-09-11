import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC, useContext, useEffect, useState, forwardRef, useRef } from "react";
import moment from "moment";
import {
  CategoryType,
  TireProps,
  ViahicleType,
} from "../../../../../interface/interface";
import {
  ViahicleProviderContextProps,
  viahiclesContext,
} from "../../providers/ViahicleProvider";
import ModalCreateTire from "../../../../../conponents/modals/ModalCreateTire";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getCategory } from "../../../../../apis/categoryAPI";
import { api } from "../../../../../_helper";
import { getTire } from "../../../../../apis/tireAPI";
import { t } from "i18next";
import MultiDateTimePicker from "./MultiRangeDateWithTimePickerProps";

interface FormAddRemindProps {
  viahicleSelected?: ViahicleType[];
  initialValues?: any;
  onSubmit: (formData: any, callback: any) => void;
}

const FormAddRemind = forwardRef<HTMLButtonElement, FormAddRemindProps>(
  ({ onSubmit, initialValues, viahicleSelected }, ref) => {
    const [isName, setIsName] = useState<boolean>(false);
    const [isTireSelect, setIsTireSelect] = useState<boolean>(false);
    const [tires, setTires] = useState<any[]>([]);
    const [imageFiles, setImageFiles] = useState<any[]>([]); // State để lưu trữ hình ảnh đã tải lên
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const { viahiclesStore } = useContext(viahiclesContext) as ViahicleProviderContextProps;
    const [vhiahicleTire, setViahicleTire] = useState<ViahicleType | null>(null);
    const [timeSelect, setTimeSelect] = useState<any[]>([]);
    const buttonDateRef = useRef<HTMLButtonElement>(null);
    const [form] = Form.useForm();

    const fetchTire = async () => {
      try {
        const res = await getTire(vhiahicleTire?.license_plate || "", "");
        setTires(res?.data);
      } catch (error) {
        // Handle error here
      }
    };

    const fetchCategory = async () => {
      const res = await getCategory();
      setCategories(res?.data);
    };

    useEffect(() => {
      if (Object.keys(initialValues).length === 0) {
        form.setFieldsValue({
          is_notified: true,
          note_repair: "Tới hạn thay dầu rồi, đi thay dầu thôi !!",
        });
      } else {
        initialValues.expiration_time = moment(initialValues?.expiration_timeStamp);
        const tire = initialValues?.tire;
        if (tire) {
          handleSelectViahicle(viahiclesStore?.viahiclesStore[0]?.license_plate);
        }
        form.setFieldsValue({
          ...initialValues,
          vehicles: viahiclesStore?.viahiclesStore[0]?.license_plate,
          tire: initialValues?.tire,
        });
        form.setFieldValue("cycle", initialValues?.cycle);
      }
      fetchCategory();
    }, []);

    useEffect(() => {
      if (timeSelect.length > 0) {
        form.setFieldValue("schedules", timeSelect);
        form.validateFields().then((values) => {
          const processedValuesForm = {
            ...values,
            expiration_time: values.expiration_time ? values.expiration_time.valueOf() : null,
            vehicles: values.vehicles ? [values.vehicles] : viahiclesStore?.viahiclesStore.map((item: ViahicleType) => (viahiclesStore?.type ? item?.imei : item.license_plate)),
            is_notified: values.is_notified ? 1 : 0,
          };
          onSubmit(processedValuesForm, fetchCategory);
        }).catch(() => {
          console.log("Lỗi xác thực:");
        });
      }
    }, [timeSelect.length]);

    useEffect(() => {
      if (vhiahicleTire) {
        fetchTire();
      }
    }, [vhiahicleTire?.license_plate]);

    const handleSelectViahicle = (value: string) => {
      const viahicle: any = viahicleSelected?.find((item: ViahicleType) =>
        viahiclesStore?.type === 0 ? item?.license_plate : item?.imei === value
      );
      setViahicleTire(viahicle);
    };

    const handleSelectTypeRemind = (value: any) => {
      if (value === "Khác") {
        setIsName(true);
      } else {
        setIsName(false);
      }
      if (value === 8) {
        setIsTireSelect(true);
        fetchTire();
      } else {
        setIsTireSelect(false);
      }
    };

    const handleImageUpload = (file: any) => {
      const formData = new FormData();
      formData.append("image", file);
      setImageFiles((prev) => [...prev, formData]);
      return false; // Prevent automatic upload
    };

    const handleGetDataForm = () => {
      buttonDateRef.current?.click();
    };

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

          {(isTireSelect || initialValues?.remind_category_id === 8) && (
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
                    handleSelectViahicle(value);
                    form.validateFields(["vehicles"]);
                  }}
                >
                  {viahicleSelected?.map((item: ViahicleType) => (
                    <Select.Option
                      key={item.license_plate}
                      value={viahiclesStore?.type === 0 ? item.license_plate : item.imei}
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
                  isReload={Math.random()}
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

          {isName && (
            <Form.Item
              name="cat_name"
              rules={[{ required: true, message: "Vui lòng nhập tên loại nhắc nhở" }]}
              style={{ gap: 10 }}
              label="Tên loại nhắc nhở"
            >
              <Input onChange={() => form.validateFields(["name"])} />
            </Form.Item>
          )}

          {viahiclesStore.type ? (
            <Form.Item
              name="km_before"
              label="Cảnh báo sau"
              rules={[{ required: true, message: "Vui lòng nhập KM cảnh báo" }]}
            >
              <InputNumber
                onChange={(value) => {
                  form.validateFields(["km_before"]);
                }}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="expiration_time"
              label="Thời gian nhắc nhở"
              rules={[{ required: true, message: "Vui lòng chọn thời gian nhắc nhở" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                showTime
                format="DD/MM/YYYY HH:mm"
                disabledDate={(current) => current && current < moment().endOf("day")}
              />
            </Form.Item>
          )}

          <Form.Item
            name="is_notified"
            label="Thông báo"
            valuePropName="checked"
            style={{ gap: 10 }}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="note_repair"
            label="Ghi chú"
            rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Tải lên hình ảnh" style={{ gap: 10 }}>
            <Upload
              accept=".png, .jpg, .jpeg"
              listType="picture-card"
              customRequest={({ file }) => handleImageUpload(file)}
              onChange={({ fileList }) => setImageFiles(fileList)}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Button
            ref={ref}
            onClick={handleGetDataForm}
            type="primary"
            htmlType="submit"
          >
            Tạo nhắc nhở
          </Button>
        </Form>
      </div>
    );
  }
);

export default FormAddRemind;
