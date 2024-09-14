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
import { createCategory, getCategory } from "../../apis/categoryAPI"
import { addRemind } from "../../apis/remindAPI"
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

      //data của add phương tiện mới
      const dataNewVehicles = excelData.map((item) => ({
        license_plate: String(item.license_plate),
        user_name: String(item.name),
        license: String(item.phoneNumber),
        user_address: String(item.address),
      }))

      const viahicleGPS = viahiclesStore?.viahicleGPS

      // check trùng biển số xe và lấy được biển số xe trùng

      const licensePlates = dataNewVehicles.map((item) => item.license_plate)
      const licensePlatesGPS = viahicleGPS?.map((item) => item.license_plate)

      const duplicateLicensePlates = licensePlates.filter((item) =>
        licensePlatesGPS?.includes(item),
      )
      console.log("duplicateLicensePlates;", duplicateLicensePlates)

      if (duplicateLicensePlates.length > 0) {
        api.message?.error(
          `Biển số xe ${duplicateLicensePlates.join(
            ", ",
          )} đã tồn tại trong danh sách phương tiện GPS`,
        )
        return
      }

      setLoading(true)

      await addViahicleExel(dataNewVehicles)
      dispatch?.freshKey()

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
      for (let i = 0; i < parsedRemindTireData.length; i++) {
        try {
          await addTire(parsedRemindTireData[i])
        } catch (error) {
          api.message?.error("Thêm lốp bị trùng series")
        }
      }
      const convertToUnix = (dateString: string): any => {
        try {
          if (
            dateString === null ||
            dateString === undefined ||
            dateString === ""
          ) {
            return ""
          }
          dateString = dateString.trim()
          if (!dateString.includes(" ")) {
            dateString += " 08:00"
          }
          const [datePart, timePart] = dateString.trim().split(" ")
          const [day, month, year] = datePart.split("/")
          const [hours, minutes] = timePart.split(":")

          const date = new Date(
            Number(year),
            Number(month) - 1, // JavaScript tháng bắt đầu từ 0
            Number(day),
            Number(hours),
            Number(minutes),
          )

          // Convert to Unix timestamp (in milliseconds)
          return Math.floor(date.getTime())
        } catch (err) {
          throw err
        }
      }
      const res = await getCategory()
      const type = res?.data
      const formattedData = excelData.map(function (item) {
        return {
          type: item.type,
          remind_category_id: "",
          expiration_time: convertToUnix(item.exp),
          cycle: item.cycle,
          note_repair: item.indexDesc,
          schedules: item.remindDate
            .filter((dateStr: any) => dateStr)
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
          is_notified: 0,
          vehicles: [item.license_plate?.toString()],
        }
      })
      console.log("====================================")
      console.log("formattedData truoc>>>>>>>>>>>>>", formattedData)
      console.log("====================================")
      for (let i = 0; i < formattedData.length; i++) {
        let cate_id = ""
        let typeFind = type.find(
          (itemType: any) => itemType.name === formattedData[i].type,
        )

        if (typeFind?.id) {
          cate_id = typeFind?.id
        } else {
          const res = await createCategory(formattedData[i]?.type, "", "")
          console.log("====================================")
          console.log()
          console.log("====================================")
          cate_id = res?.data
        }
        formattedData[i].remind_category_id = cate_id
      }
      console.log('chay duoc den day');
      for (let i = 0; i < formattedData.length; i++) {
        await addRemind(formattedData[i])
      }
      setLoading(false)
    } catch (error) {
      console.log("error >>", error)
      api?.message?.error(
        "Import thất bại seri lốp bị trùng hoặc biển số xe bị trùng",
      )
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
