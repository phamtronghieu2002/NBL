import { ColumnsType } from "antd/es/table"
import { ReactNode } from "react"
import { TextEllipsis } from "../../../../../conponents/TextC"
import { CoorGooleMap } from "../../../../../conponents/CoorGoogleMap"

export interface IColumns {
  key: number
  time: string
  licensePlates: string
  speed: string
}

export const COLUMNS: ColumnsType<IColumns> = [
  {
    title: "#",
    key: "key",
    dataIndex: "key",
    width: 70,
    fixed: "left",
  },
  {
    title: "Thời điểm",
    key: "time",
    dataIndex: "time",
    width: 200,
    fixed: "left",
    sorter: (a, b) => (a.time < b.time ? -1 : 1),
  },
  {
    title: "Biển số phương tiện",
    key: "licensePlates",
    dataIndex: "licensePlates",
    width: 200,
  },
  {
    title: "Tốc độ (km/h) - Mỗi 10 giây",
    key: "speed",
    dataIndex: "speed",
    width: 200,
  },
]
