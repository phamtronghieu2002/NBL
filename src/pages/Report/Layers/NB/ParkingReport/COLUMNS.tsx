import { ColumnsType } from "antd/es/table"
import { ReactNode } from "react"
import { TextEllipsis } from "../../../../../conponents/TextC"
import { CoorGooleMap } from "../../../../../conponents/CoorGoogleMap"

export interface IColumns {
  address: string | ReactNode
  coor: ReactNode
  driverName: string
  key: number
  licensePlates: string
  parkingTotalTime: string
  time: string
  vType: string
  startTime: string
  endTime: string
  stt: string
}

export const COLUMNS: ColumnsType<IColumns> = [
  {
    title: "#",
    key: "stt",
    dataIndex: "stt",
    width: 70,
    fixed: "left",
    className: "text-center",
  },
  {
    title: "Biển số",
    key: "licensePlates",
    dataIndex: "licensePlates",
    width: 120,
    fixed: "left",
    sorter: (a, b) => (a.licensePlates < b.licensePlates ? -1 : 1),
  },

  {
    title: "Tên lái xe",
    key: "driverName",
    dataIndex: "driverName",
    width: 200,
  },
  {
    title: "Loại phương tiện",
    key: "vType",
    dataIndex: "vType",
    width: 180,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },

  {
    title: "Bắt đầu",
    key: "startTime",
    dataIndex: "startTime",
    sorter: (a, b) => (a.startTime < b.startTime ? -1 : 1),
    width: 150,
  },
  {
    title: "Kết thúc",
    key: "endTime",
    dataIndex: "endTime",
    sorter: (a, b) => (a.endTime < b.endTime ? -1 : 1),
    width: 150,
  },

  {
    title: "Thời gian dừng",
    key: "parkingTotalTime",
    dataIndex: "parkingTotalTime",
    width: 130,
    sorter: (a, b) => (a.parkingTotalTime < b.parkingTotalTime ? -1 : 1),
    className: "text-center",
  },
  {
    title: "Toạ độ",
    key: "coor",
    dataIndex: "coor",
    width: 180,
    render(value, record, index) {
      return <CoorGooleMap coor={value} />
    },
  },
  {
    title: "Địa chỉ",
    key: "address",
    dataIndex: "address",
    width: 500,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
]
