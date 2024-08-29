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
  endAddress: string | ReactNode
  endCoor: string
  endTime: string
  licensePlates: string
  rangeTime: string
  startAddress: string | ReactNode
  startCoor: string
  startTime: string
  distance: number
}

export const COLUMNS: ColumnsType<IColumns> = [
  {
    title: "#",
    key: "key",
    dataIndex: "key",
    width: 60,
    fixed: "left",
  },

  {
    title: "Phương tiện",
    key: "licensePlates",
    dataIndex: "licensePlates",
    width: 120,
    sorter: (a, b) => (a.licensePlates < b.licensePlates ? -1 : 1),
    fixed: "left",
  },

  {
    title: "Bắt đầu",
    key: "start",
    dataIndex: "start",
    width: 220,
    children: [
      {
        title: "Thời gian",
        key: "startTime",
        dataIndex: "startTime",
        width: 180,
        sorter: (a, b) => (a.startTime < b.startTime ? -1 : 1),
      },
      {
        title: "Toạ độ",
        key: "startCoor",
        dataIndex: "startCoor",
        width: 180,
        render(value, record, index) {
          return <CoorGooleMap coor={value} />
        },
      },
      {
        title: "Địa chỉ",
        key: "startAddress",
        dataIndex: "startAddress",
        width: 300,
        render(value, record, index) {
          return <TextEllipsis tooltip text={value}></TextEllipsis>
        },
      },
    ],
  },

  {
    title: "Kết thúc",
    key: "end",
    dataIndex: "end",
    width: 220,
    children: [
      {
        title: "Thời gian",
        key: "endTime",
        dataIndex: "endTime",
        width: 180,
        sorter: (a, b) => (a.startTime < b.startTime ? -1 : 1),
      },
      {
        title: "Toạ độ",
        key: "endCoor",
        dataIndex: "endCoor",
        width: 180,
        render(value, record, index) {
          return <CoorGooleMap coor={value} />
        },
      },
      {
        title: "Địa chỉ",
        key: "endAddress",
        dataIndex: "endAddress",
        width: 300,
        render(value, record, index) {
          return <TextEllipsis tooltip text={value}></TextEllipsis>
        },
      },
    ],
  },

  {
    title: "Khoảng thời gian",
    key: "rangeTime",
    dataIndex: "rangeTime",
    sorter: (a, b) => (a.rangeTime < b.rangeTime ? -1 : 1),
    width: 150,
    className: "text-center",
  },
  {
    title: "Khoảng cách (km)",
    key: "distance",
    dataIndex: "distance",
    sorter: (a, b) => (a.distance < b.distance ? -1 : 1),
    width: 220,
  },
]
