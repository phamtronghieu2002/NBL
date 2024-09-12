import { FC, useContext, useState } from "react"
import { ModalCView } from "../ModalC/ModalC"
import { Button } from "antd"
import UploadExel from "../../pages/manager/Remind/components/Upload/UploadFile"
import { FileExcelOutlined } from "@ant-design/icons"
import {
  ViahicleProviderContextProps,
  viahiclesContext,
} from "../../pages/manager/Remind/providers/ViahicleProvider"

import { ViahicleType } from "../../interface/interface"
import { api } from "../../_helper"
import { addViahicle, addViahicleExel } from "../../apis/viahicleAPI"
import { MaskLoader } from "../Loader"
import { addTire } from "../../apis/tireAPI"
interface ModalImportExelProps {
  button: React.ReactNode
}

const ImportExel: FC<{
  action: any
}> = ({ action }) => {
  const [isUpload, setIsUpload] = useState<Boolean>(false)
  const [excelData, setExcelData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps
  console.log("viahiclesStore", viahiclesStore)


  const handleImport = async () => {
    try {
      //check format date
      excelData.forEach((item, index) => {
        // Kiểm tra thuộc tính remindDate
        const remindDate = item.remindDate
        if (!Array.isArray(remindDate)) {
          console.log(
            `Item at index ${index} has invalid remindDate format: Not an array`,
          )
          return
        }

        // Kiểm tra từng phần tử trong mảng remindDate
        remindDate.forEach((date, i) => {
          if (typeof date !== "string") {
            console.log(
              `Item at index ${index} has invalid remindDate format at index ${i}: Not a string`,
            )
          }
        })
      })

      console.log(excelData)
      //data của add phương tiện mới
      const dataNewVehicles = excelData.map((item) => ({
        license_plate: String(item.license_plate),
        user_name: String(item.name),
        license: String(item.phoneNumber),
        user_address: String(item.address),
      }))
      setLoading(true)
      await addViahicleExel(dataNewVehicles)
      dispatch?.freshKey()

      // console.log("dataNewVehicles >>>", dataNewVehicles)

      //data của type dạng array, insert call api từng hàng index 1 vào từ 0
      //   {
      //     "license_plate": "1",
      //     "seri": "avc",
      //     "size": "50x50",
      //     "brand": "toyota"
      // }
      //đây là 1 ví dụ của 1 object parsedRemindTireData
      const parsedRemindTireData = excelData.flatMap((item) =>
        item.remindTire
          .filter((tire: any) => tire)
          .map((tire: any) => {
            const [seri, size, brand] = tire.split(",")
            return {
              license_plate: item.license_plate?.toString() || "Unknown",
              seri,
              size,
              brand,
            }
          }),
      )

      console.log("parsedRemindTireData >>>", parsedRemindTireData);
      
    
    for(let i = 0; i < parsedRemindTireData.length; i++) {  
        await addTire(parsedRemindTireData[i])
    }
      const convertToUnix = (dateString: string): any => {
        try {
          if (
            dateString === null ||
            dateString === undefined ||
            dateString === ""
          )
            return ""
          const [datePart, timePart] = dateString.trim().split(" ")
          const [day, month, year] = datePart.split("/")
          const [hours, minutes] = timePart.split(":")

          const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hours),
            Number(minutes),
          )
          return Math.floor(date.getTime() / 1000)
        } catch (err) {
          throw err
        }
      }

      const formattedData = excelData.map((item) => {

          console.log('====================================');
          console.log("items >>>>>>>", item);
          console.log('====================================');


        return {
          remind_category_id: item.license_plate,
          expiration_time: convertToUnix(item.exp),
          cycle: item.cycle,
          note_repair: item.indexDesc,
          schedules: item.remindDate
            .filter((dateStr: any) => dateStr) // Lọc các giá trị null hoặc undefined
            .map((dateStr: any) => {
              const [startDate, endDateTime] = dateStr.split("-")
              const startDateTime = `${startDate.trim()} ${endDateTime
                .split(" ")[1]
                .trim()}`
              const endDateTimeFull = endDateTime.trim()
              const timeOnly = endDateTime.split(" ")[1].trim()
              return {
                start: convertToUnix(startDateTime),
                end: convertToUnix(endDateTimeFull),
                time: timeOnly,
              }
            }),
          vehicles: [item.license_plate?.toString()],
        }
      })
      setLoading(false)

      console.log(formattedData)
    } catch (error) {
      console.log(error)
      api?.message?.error("Import thất bại")
    }
  }

  return (
    <div>
      {loading && <MaskLoader />}
      <p className="flex items-center">
        Nếu chưa có file exel mẫu,tải mẫu tại đây{" "}
        <Button
          icon={<FileExcelOutlined />}
          type="link"
          href="/assets/files/template.xlsx"
        >
          File{" "}
        </Button>
      </p>

      <div className="flex justify-center mt-5 mb-10">
        <UploadExel setExcelData={setExcelData} setIsUpload={setIsUpload} />
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
        <Button onClick={handleImport} disabled={!isUpload} type="primary">
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
