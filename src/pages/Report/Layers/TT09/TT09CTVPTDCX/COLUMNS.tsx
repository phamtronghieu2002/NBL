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
  stt: string

  avgSpeedOver: number
  endAddressOver: string | ReactNode
  endCoorOver: ReactNode
  endOver: string
  kmOver: number
  licensePlates: string
  note: string
  startAddressOver: string | ReactNode
  startCoorOver: ReactNode
  startOver: string
  time: string
  totalTimeOver: string
}

export const COLUMNS: ColumnsType<IColumns> = [
  {
    title: "#",
    key: "stt",
    dataIndex: "stt",
    width: 70,
    fixed: "left",
  },
  {
    title: "Biển số phương tiện",
    key: "licensePlates",
    dataIndex: "licensePlates",
    width: 170,
    fixed: "left",
    sorter: (a, b) => (a.licensePlates < b.licensePlates ? -1 : 1),
  },
  {
    title: "Ngày vi phạm",
    key: "time",
    dataIndex: "time",
    width: 150,
    sorter: (a, b) => (a.licensePlates < b.licensePlates ? -1 : 1),
  },

  {
    title: "Thời gian vi phạm",
    key: "1",
    dataIndex: "1",
    children: [
      {
        title: "Bắt đầu",
        key: "startOver",
        dataIndex: "startOver",
        width: 130,
      },
      {
        title: "Kết thúc",
        key: "endOver",
        dataIndex: "endOver",
        width: 130,
      },
      {
        title: "Thời gian",
        key: "totalTimeOver",
        dataIndex: "totalTimeOver",
        width: 180,
      },
    ],
  },
  {
    title: "Toạ độ vi phạm",
    key: "2",
    dataIndex: "2",
    children: [
      {
        title: "Bắt đầu",
        key: "startCoorOver",
        dataIndex: "startCoorOver",
        width: 180,
        render(value, record, index) {
          return <CoorGooleMap coor={value} />
        },
      },
      {
        title: "Kết thúc",
        key: "endCoorOver",
        dataIndex: "endCoorOver",
        width: 180,
        render(value, record, index) {
          return <CoorGooleMap coor={value} />
        },
      },
    ],
  },
  {
    title: "Địa điểm vi phạm",
    key: "3",
    dataIndex: "3",
    children: [
      {
        title: "Bắt đầu",
        key: "startAddressOver",
        dataIndex: "startAddressOver",
        width: 300,
        render(value, record, index) {
          return <TextEllipsis tooltip text={value}></TextEllipsis>
        },
      },
      {
        title: "Kết thúc",
        key: "endAddressOver",
        dataIndex: "endAddressOver",
        width: 300,
        render(value, record, index) {
          return <TextEllipsis tooltip text={value}></TextEllipsis>
        },
      },
    ],
  },
  {
    title: "Tốc độ vi phạm (tốc độ trung bình khi quá tốc độ giới hạn)",
    key: "avgSpeedOver",
    dataIndex: "avgSpeedOver",
    width: 300,
  },
  {
    title: "Quãng đường vi phạm (km)",
    key: "kmOver",
    dataIndex: "kmOver",
    width: 120,
  },
  {
    title: "Ghi chú",
    key: "note",
    dataIndex: "note",
    width: 120,
  },
]
