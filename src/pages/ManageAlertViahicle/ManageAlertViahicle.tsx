import { FC, useState } from "react"
import { Button, Upload, Modal, message, Table } from "antd"
import { DownloadOutlined, CloudUploadOutlined } from "@ant-design/icons"
import * as XLSX from "xlsx"
import { TableC } from "../../conponents/TableC"
import "./style.css"
import FilterViahicle from "./components/Filter"
import { FormC } from "../../conponents/FormC"
// Định nghĩa interface cho dữ liệu từ file Excel
interface ExcelData {
  "Biển số": string
  "Giấy phép lái xe": string
  // Thêm các trường khác nếu cần
}

interface ManageAlertViahicleProps {}

const ManageAlertViahicle: FC<ManageAlertViahicleProps> = () => {
  const [fileList, setFileList] = useState<any[]>([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [excelData, setExcelData] = useState<ExcelData[]>([])

  // Định nghĩa các cột bắt buộc
  const requiredColumns = ["Biển số", "Giấy phép lái xe"]

  const handleUpload = (file: any) => {
    const isExcel =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    if (!isExcel) {
      message.error("Bạn chỉ có thể tải lên file Excel (.xlsx)")
      return false // Ngăn không cho tải lên
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: "array" })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json<ExcelData>(worksheet) // Ép kiểu cho dữ liệu JSON

      // Kiểm tra cấu trúc dữ liệu (kiểm tra các cột bắt buộc)
      const keys = Object.keys(jsonData[0] || {}) // Thêm || {} để tránh lỗi nếu jsonData rỗng

      const isValid = requiredColumns.every((col) => keys.includes(col))

      if (!isValid) {
        message.error(
          "File không đúng định dạng! Vui lòng kiểm tra lại, các trường bắt buộc: " +
            requiredColumns.join(", "),
        )
        return
      }

      setExcelData(jsonData)
      setPreviewVisible(true)
    }
    reader.readAsArrayBuffer(file)
    setFileList([...fileList, file])
    return false // Prevent automatic upload
  }

  const handleConfirm = () => {
    console.log("Dữ liệu từ file Excel:", excelData)
    setPreviewVisible(false)
    setFileList([])
    setExcelData([])
  }

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "Biển số",
      dataIndex: "Biển số",
      key: "Biển số",
    },
    {
      title: "Giấy phép lái xe",
      dataIndex: "Giấy phép lái xe",
      key: "Giấy phép lái xe",
    },
    // Thêm các cột khác nếu cần
  ]

  return (
    <div className="wp_manager_alert_page">
      <div className="header mb-4">
        {/* useKey?: string
  name: string
  type: string
  label: string
  placeholder?: string
  options?: {
    title: string
    value: string
  }[]
  style?: React.CSSProperties
  rules?: Rule[]
  onChange?: (e: any, name: string) => {}
  autoFill?: string */}
        <FormC
          
          onFinish={(data) => console.log(data)}
          fields={[
            {
              name: "alert_type",
              type: "input",
              label: "Loại cảnh báo",
              placeholder: "Nhập loại cảnh báo",
              rules: [{ required: true, message: "Vui lòng nhập loại cảnh báo" }],

               

             
            },
            
          ]}
        />
        <Button
          className="mr-4"
          type="primary"
          icon={<DownloadOutlined />}
          size={"middle"}
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="/assets/files/template.xlsx"
          >
            Tải file mẫu
          </a>
        </Button>
        <Upload beforeUpload={handleUpload} showUploadList={false}>
          <Button icon={<CloudUploadOutlined />} size={"middle"}>
            Upload file
          </Button>
        </Upload>
      </div>
      <div className="content">
        <FilterViahicle onFilter={(data) => console.log(data)} />
        <TableC
          props={{
            dataSource: excelData, // Sử dụng dữ liệu từ file Excel
            columns: columns, // Định nghĩa cột ở đây
            pagination: {},
            loading: false,
          }}
        />
      </div>

      <Modal
        className="pb-4"
        width={900}
        title="Xem trước file Excel"
        visible={previewVisible}
        onOk={handleConfirm}
        onCancel={() => setPreviewVisible(false)}
      >
        <div className="p-4">
          <h3>Dữ liệu đã tải lên:</h3>
          <Table
            bordered // Thêm viền cho bảng
            size="middle" // K
            dataSource={excelData} // Sử dụng dữ liệu từ file Excel
            columns={columns} // Định nghĩa cột ở đây
            pagination={{}}
            rowKey="Biển số" // Thay đổi nếu cần
          ></Table>
        </div>
      </Modal>
    </div>
  )
}

export default ManageAlertViahicle
