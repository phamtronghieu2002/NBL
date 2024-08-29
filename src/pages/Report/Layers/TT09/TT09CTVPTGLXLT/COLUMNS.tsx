import { ColumnsType } from "antd/es/table"
import { ReactNode } from "react"
import { TextEllipsis } from "../../../../../conponents/TextC"
import { CoorGooleMap } from "../../../../../conponents/CoorGoogleMap"

export interface IColumns {
  driverName: string
  key: number
  licensePlates: string
  vType: string
  stt: string
  total_time: string
  start_time: string
  end_time: string
  start_coor: string
  end_coor: string
  start_address: string | ReactNode
  end_address: string | ReactNode
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
    title: "Thời lái xe liên tục",
    key: "total_time",
    dataIndex: "total_time",
    width: 220,
    sorter: (a, b) => (a.total_time < b.total_time ? -1 : 1),
  },

  {
    title: "Thời gian bắt đầu",
    key: "start_time",
    dataIndex: "start_time",
    sorter: (a, b) => (a.start_time < b.start_time ? -1 : 1),
    width: 180,
  },
  {
    title: "Thời gian kết thúc",
    key: "end_time",
    dataIndex: "end_time",
    sorter: (a, b) => (a.end_time < b.end_time ? -1 : 1),
    width: 180,
  },

  {
    title: "Toạ độ bắt đầu",
    key: "start_coor",
    dataIndex: "start_coor",
    width: 180,
    render(value, record, index) {
      return <CoorGooleMap coor={value} />
    },
  },
  {
    title: "Toạ độ kết thúc",
    key: "end_coor",
    dataIndex: "end_coor",
    width: 180,
    render(value, record, index) {
      return <CoorGooleMap coor={value} />
    },
  },
  {
    title: "Địa chỉ bắt đầu",
    key: "start_address",
    dataIndex: "start_address",
    width: 500,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
  {
    title: "Địa chỉ kết thúc",
    key: "end_address",
    dataIndex: "end_address",
    width: 500,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
]
