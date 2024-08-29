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
  km: number
  licensePlates: string
  note: string
  over4HourDrive: number | string

  tdu5: number
  td5to10: number | string
  td10to20: number
  td20to35: number | string
  tdover35: number | string

  pu5: number
  p5to10: number | string
  p10to20: number
  p20to35: number | string
  pover35: number | string

  driverName: string
  drivingPlate: string
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
    title: "Tên lái xe",
    key: "driverName",
    dataIndex: "driverName",
    width: 170,
    fixed: "left",
    sorter: (a, b) => (a.licensePlates < b.licensePlates ? -1 : 1),
  },
  {
    title: "Giấy phép lái xe",
    key: "drivingPlate",
    dataIndex: "drivingPlate",
    width: 120,
  },
  {
    title: "Tỉ lệ km quá tốc độ giới hạn / Tổng km (%)	",
    key: "1",
    dataIndex: "1",
    children: [
      {
        title: "Dưới 5km/h",
        key: "tdu5",
        dataIndex: "tdu5",
        width: 120,
      },
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
    title: "Tổng số lần quá tốc độ giới hạn",
    key: "2",
    dataIndex: "2",
    children: [
      {
        title: "Dưới 5km/h",
        key: "td5to10",
        dataIndex: "td5to10",
        width: 120,
      },
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
    title: "Tổng số lần lái xe liên tục quá 04 giờ",
    key: "over4HourDrive",
    dataIndex: "over4HourDrive",
    width: 120,
  },
  {
    title: "Ghi chú",
    key: "note",
    dataIndex: "note",
    width: 120,
  },
]
