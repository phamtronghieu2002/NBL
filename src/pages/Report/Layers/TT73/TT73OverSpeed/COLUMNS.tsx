import { ColumnsType } from "antd/es/table"
import { ReactNode } from "react"
import { TextEllipsis } from "../../../../../conponents/TextC"
import { CoorGooleMap } from "../../../../../conponents/CoorGoogleMap"
import { Button } from "antd"
import { IRouteDayReport } from "../../../../../_types/reportType"
import { _app } from "../../../../../utils/_app"
import { store } from "../../../../../app/store"
import { api } from "../../../../../_helper"
import { _const } from "../../../../../_constant"
import getTime from "../../../../../utils/getTime"

export interface IColumns {
  key: number
  address: string | ReactNode
  avgSpeed: number
  coor: ReactNode
  licensePlates: string
  note: string
  speedLimit: number
  time: string
  vType: string
  driverName: string
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
    title: "Thời gian",
    key: "time",
    dataIndex: "time",
    width: 150,
    fixed: "left",
    sorter: (a, b) => (a.time < b.time ? -1 : 1),
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
    width: 150,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
  {
    title: "Tốc độ trung bình khi quá tốc độ giới hạn (km/h)",
    key: "avgSpeed",
    dataIndex: "avgSpeed",
    width: 200,
    sorter: (a, b) => (a.avgSpeed < b.avgSpeed ? -1 : 1),
  },
  {
    title: "Tốc độ giới hạn (km/h)",
    key: "speedLimit",
    dataIndex: "speedLimit",
    width: 120,
  },
  {
    title: "Toạ độ quá tốc độ",
    key: "coor",
    dataIndex: "coor",
    width: 180,
    render(value, record, index) {
      return <CoorGooleMap coor={value} />
    },
  },
  {
    title: "Địa điểm quá tốc độ",
    key: "address",
    dataIndex: "address",
    width: 500,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
  {
    title: "Ghi chú",
    key: "note",
    dataIndex: "note",
    width: 120,
  },
]
