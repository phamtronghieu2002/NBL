import { ColumnsType } from "antd/es/table"
import { ReactNode } from "react"
import { TextEllipsis } from "../../../../../conponents/TextC"
import { CoorGooleMap } from "../../../../../conponents/CoorGoogleMap"
import { handleData } from "../../../../../utils/handleData"

export interface IColumns {
  key: number
  stt: string
  date: string
  endTime: string
  kmGpsBonus: number
  kmGpsEnd: number
  kmGpsStart: number
  licensePlates: string
  runningTime: string
  startAddress: string | ReactNode
  endAddress: string | ReactNode
  startTime: string
  vType: string
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
    width: 120,
    sorter: (a, b) => (a.licensePlates < b.licensePlates ? -1 : 1),
    fixed: "left",
  },
  {
    title: "Ngày tháng",
    key: "date",
    dataIndex: "date",
    width: 160,
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
    title: "Giờ đi",
    key: "startTime",
    dataIndex: "startTime",
    width: 90,
  },
  {
    title: "Giờ đến",
    key: "endTime",
    dataIndex: "endTime",
    width: 90,
  },
  {
    title: "Thời gian lăn bánh",
    key: "runningTime",
    dataIndex: "runningTime",
    width: 140,
  },
  {
    title: "KmGPS đầu kỳ",
    key: "kmGpsStart",
    dataIndex: "kmGpsStart",
    width: 140,
  },
  {
    title: "KmGPS phát sinh",
    key: "kmGpsBonus",
    dataIndex: "kmGpsBonus",
    width: 140,
    render(value, record, index) {
      return <span className="italic text-theme">{value}</span>
    },
  },
  {
    title: "KmGPS cuối kỳ",
    key: "kmGpsEnd",
    dataIndex: "kmGpsEnd",
    width: 160,
  },
  {
    title: "Địa điểm bắt đầu",
    key: "startAddress",
    dataIndex: "startAddress",
    width: 300,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
  {
    title: "Địa điểm kết thúc",
    key: "endAddress",
    dataIndex: "endAddress",
    width: 300,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
]

// console.table(
//   handleData.getDistance([10.811051, 106.703659], [10.811129, 106.704376]),
// )
