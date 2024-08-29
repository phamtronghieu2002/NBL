import { ColumnsType } from "antd/es/table"
import { ReactNode } from "react"
import { TextEllipsis } from "../../../../../conponents/TextC"
import { CoorGooleMap } from "../../../../../conponents/CoorGoogleMap"

export interface IColumns {
  key: number
  time: string
  coor: ReactNode
  address: string | ReactNode
  note: string
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
    title: "Toạ độ",
    key: "coor",
    dataIndex: "coor",
    width: 200,
    render(value, record, index) {
      return <CoorGooleMap coor={value} />
    },
  },
  {
    title: "Địa điểm",
    key: "address",
    dataIndex: "address",
    width: 400,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },

  {
    title: "Ghi chú",
    key: "note",
    dataIndex: "note",
    width: 140,
  },
]
