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
  drivePercent: number | string
  key: number
  km: number
  licensePlates: string
  note: string
  over4HourDrive: number | string
  over10HourCount: number | string
  overRouteCount: number | string
  routePercent: number | string

  under5: number
  td5to10: number | string
  td10to20: number
  td20to35: number | string
  tdPrecent: number | string
  tdTotal: number | string
  tdover35: number | string
  stt: string
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
    title: "Số lần vi phạm tốc độ",
    key: "1",
    dataIndex: "1",
    children: [
      {
        title: "Dưới 5km/h",
        key: "under5",
        dataIndex: "under5",
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
      {
        title: "Tổng cộng",
        key: "tdTotal",
        dataIndex: "tdTotal",
        width: 120,
      },
      {
        title: "Tỉ lệ % vi phạm / km xe chạy",
        key: "tdPrecent",
        dataIndex: "tdPrecent",
        width: 120,
      },
    ],
  },
  {
    title: "Hành trình",
    key: "2",
    dataIndex: "2",
    children: [
      {
        title: "Tổng km xe đã chạy",
        key: "km",
        dataIndex: "km",
        width: 120,
      },
      {
        title: "Số lần vi phạm hành trình",
        key: "overRouteCount",
        dataIndex: "overRouteCount",
        width: 120,
      },
      {
        title: "Tỉ lệ % vi phạm hành trình",
        key: "routePercent",
        dataIndex: "routePercent",
        width: 120,
      },
    ],
  },
  {
    title: "Thời gian lái xe",
    key: "3",
    dataIndex: "3",
    children: [
      {
        title: "Số lần vi phạm quá 4 giờ liên tục",
        key: "over4HourDrive",
        dataIndex: "over4HourDrive",
        width: 160,
      },
      {
        title: "Số lần vi phạm quá 10 giờ/ngày",
        key: "over10HourCount",
        dataIndex: "over10HourCount",
        width: 140,
      },
      {
        title: "Tỉ lệ % vi phạm hành trình",
        key: "drivePercent",
        dataIndex: "drivePercent",
        width: 120,
      },
    ],
  },
  {
    title: "Ghi chú",
    key: "note",
    dataIndex: "note",
    width: 120,
  },
]
