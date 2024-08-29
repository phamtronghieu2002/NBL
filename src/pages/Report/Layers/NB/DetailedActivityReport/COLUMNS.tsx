import { ColumnsType } from "antd/es/table"
import { ReactNode } from "react"
import { TextEllipsis } from "../../../../../conponents/TextC"
import { CoorGooleMap } from "../../../../../conponents/CoorGoogleMap"

export interface IColumns {
  key: number | string
  stt: string
  endAddress: string | ReactNode
  endTime: string
  kmGps: number
  licensePlates: string
  rangeTime: string
  startAddress: string | ReactNode
  startTime: string
  date: string
  vType: string
  rangeTimeUnix: number
}

export const COLUMNS: ColumnsType<IColumns> = [
  {
    title: "#",
    key: "stt",
    dataIndex: "stt",
    width: 60,
    fixed: "left",
    className: "text-center",
  },
  {
    title: "Biển số",
    key: "licensePlates",
    dataIndex: "licensePlates",
    width: 150,
    sorter: (a, b) => (a.licensePlates < b.licensePlates ? -1 : 1),
    fixed: "left",
  },
  {
    title: "Ngày tháng",
    key: "date",
    dataIndex: "date",
    width: 120,
    fixed: "left",
  },

  {
    title: "Loại phương tiện",
    key: "vType",
    dataIndex: "vType",
    width: 160,
    sorter: (a, b) => (a.vType < b.vType ? -1 : 1),
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },

  {
    title: "Từ giờ",
    key: "startTime",
    dataIndex: "startTime",
    width: 100,
  },

  {
    title: "Đến giờ",
    key: "endTime",
    dataIndex: "endTime",
    width: 100,
  },

  {
    title: "Khoảng thời gian HĐ",
    key: "rangeTime",
    dataIndex: "rangeTime",
    width: 190,

    sorter: (a, b) => (a.rangeTimeUnix < b.rangeTimeUnix ? -1 : 1),
  },

  {
    title: "Km GPS",
    key: "kmGps",
    dataIndex: "kmGps",
    width: 90,
    render(value, record, index) {
      return <span className="italic text-theme">{value}</span>
    },
  },

  {
    title: "Địa chỉ đi",
    key: "startAddress",
    dataIndex: "startAddress",
    width: 350,

    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },

  {
    title: "Địa chỉ đến",
    key: "endAddress",
    dataIndex: "endAddress",
    width: 350,

    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
]
