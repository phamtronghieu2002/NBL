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
  km: number
  licensePlates: string
  note: string

  tdu5: number | string
  td5to10: number | string
  td10to20: number | string
  td20to35: number | string
  tdover35: number | string

  pu5: number | string
  p5to10: number | string
  p10to20: number | string
  p20to35: number | string
  pover35: number | string

  totalParkingCount: number
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
    title: "Biển số phương tiện",
    key: "licensePlates",
    dataIndex: "licensePlates",
    width: 170,
    fixed: "left",
    sorter: (a, b) => (a.licensePlates < b.licensePlates ? -1 : 1),
  },
  {
    title: "Tổng số km",
    key: "km",
    dataIndex: "km",
    width: 120,
  },
  {
    title: "Tỉ lệ km quá tốc độ giới hạn / Tổng km (%)",
    key: "1",
    dataIndex: "1",
    children: [
      {
        title: "Dưới 5km/h",
        key: "pu5",
        dataIndex: "pu5",
        width: 120,
      },
      {
        title: "Từ 5 km/h đến dưới 10 km/h",
        key: "p5to10",
        dataIndex: "p5to10",
        width: 120,
      },
      {
        title: "Từ 10 km/h đến dưới 20 km/h",
        key: "p10to20",
        dataIndex: "p10to20",
        width: 120,
      },
      {
        title: "Từ 20 km/h đến dưới 35 km/h",
        key: "p20to35",
        dataIndex: "p20to35",
        width: 120,
      },
      {
        title: "Trên 35 km/h",
        key: "pover35",
        dataIndex: "pover35",
        width: 120,
      },
    ],
  },

  {
    title: "Tổng số lần quá tốc độ giới hạn",
    key: "2",
    dataIndex: "2",
    children: [
      {
        title: "Từ 5 km/h đến dưới 10 km/h",
        key: "td5to10",
        dataIndex: "td5to10",
        width: 120,
      },
      {
        title: "Từ 10 km/h đến dưới 20 km/h",
        key: "td10to20",
        dataIndex: "td10to20",
        width: 120,
      },
      {
        title: "Từ 20 km/h đến dưới 35 km/h",
        key: "td20to35",
        dataIndex: "td20to35",
        width: 120,
      },
      {
        title: "Trên 35 km/h",
        key: "tdover35",
        dataIndex: "tdover35",
        width: 120,
      },
    ],
  },
  {
    title: "Tổng số lần dừng đỗ",
    key: "totalParkingCount",
    dataIndex: "totalParkingCount",
    width: 120,
  },
  {
    title: "Ghi chú",
    key: "note",
    dataIndex: "note",
    width: 120,
  },
]
