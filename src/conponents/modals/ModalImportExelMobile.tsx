import { FC, useContext, useState } from "react"
import { ModalCView } from "../ModalC/ModalC"
import { Button } from "antd"
import UploadExel from "../../pages/manager/RemindMobile/components/Upload/UploadFile"
import { FileExcelOutlined } from "@ant-design/icons"
import { ViahicleProviderContextProps, viahiclesContext } from "../../pages/manager/RemindMobile/providers/ViahicleProvider"
interface ModalImportExelProps {
  button: React.ReactNode
}

const ImportExel: FC<{
  action: any
}> = ({ action }) => {
  const [isUpload, setIsUpload] = useState<Boolean>(false)

  return (
    <div>
      <p className="flex items-center">
        Nếu chưa có file exel mẫu,tải mẫu tại đây{" "}
        <Button icon={<FileExcelOutlined />} type="link" href="/assets/files/template.xlsx">
          File{" "}
        </Button>
      </p>

      <div className="flex justify-center mt-5 mb-10">
        <UploadExel setIsUpload={setIsUpload} />
      </div>
      <div className="actions flex justify-end">
        <Button
          className="mr-3"
          onClick={() => {
            action?.closeModal?.()
          }}
        >
          Hủy
          
        </Button>
        <Button disabled={!isUpload} type="primary">
          {" "}
          import{" "}
        </Button>
      </div>
    </div>
  )
}

const ModalImportExel: FC<ModalImportExelProps> = ({ button }) => {
  
  return (
    <ModalCView
      modalProps={{ width: 500 }}
      button={button}
      title="Nhập file exel"
      children={(action) => <ImportExel action={action} />}
    />
  )
}

export default ModalImportExel
