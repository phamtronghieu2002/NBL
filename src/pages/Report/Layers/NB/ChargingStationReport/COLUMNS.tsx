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
  time: string
  stt: string
  name: string
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
    width: 160,
    fixed: "left",
    sorter: (a, b) => (a.licensePlates < b.licensePlates ? -1 : 1),
  },

  {
    title: "Tên lái xe",
    key: "driverName",
    dataIndex: "driverName",
    width: 160,
  },

  {
    title: "Thời điểm",
    key: "time",
    dataIndex: "time",
    width: 160,
  },
  {
    title: "Tên điểm",
    key: "name",
    dataIndex: "name",
    width: 350,
  },
  {
    title: "Toạ độ",
    key: "coor",
    dataIndex: "coor",
    width: 180,
  },
  {
    title: "Địa chỉ",
    key: "address",
    dataIndex: "address",
    width: 400,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
]
