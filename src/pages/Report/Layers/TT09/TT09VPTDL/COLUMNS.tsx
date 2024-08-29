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
  stt: number
  key: number
  licensePlates: string
  type: string
  transTimesKdbts: string
  notTransTimes: string
  missTransTimes: string
  missTimeTotal: string
  dvccDv: string
  note: string
}

export const COLUMNS: ColumnsType<IColumns> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    width: 80,
    fixed: "left",
  },
  {
    title: "Biển số",
    dataIndex: "licensePlates",
    key: "licensePlates",
    width: 140,
    fixed: "left",
  },

  {
    title: "Loại hình hoạt động",
    dataIndex: "type",
    key: "type",
    width: 140,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
  {
    title:
      "Số lần truyền dữ liệu không đảm bảo tần suất theo quy định (Có thể xem từng lần)",
    dataIndex: "transTimesKdbts",
    key: "transTimesKdbts",
    sorter: (a, b) => (a.transTimesKdbts > b.transTimesKdbts ? 1 : -1),
    showSorterTooltip: { showArrow: false, title: `Sắp xếp số lần` },
    className: "align-right",
    width: 340,
  },
  {
    title: "Số lần không truyền dữ liệu",
    dataIndex: "notTransTimes",
    key: "notTransTimes",
    sorter: (a, b) => (a.notTransTimes > b.notTransTimes ? 1 : -1),
    showSorterTooltip: { showArrow: false, title: `Sắp xếp số lần` },
    className: "align-right",
    width: 120,
  },

  {
    title: "Số lần truyền dữ liệu thiếu thông tin theo quy định",
    dataIndex: "missTransTimes",
    key: "missTransTimes",
    sorter: (a, b) => (a.missTransTimes > b.missTransTimes ? 1 : -1),
    showSorterTooltip: { showArrow: false, title: `Sắp xếp số lần` },
    className: "align-right",
    width: 200,
  },

  {
    title: "Tổng thời gian không truyền dữ liệu",
    dataIndex: "missTimeTotal",
    key: "missTimeTotal",
    sorter: (a, b) => (a.missTimeTotal > b.missTimeTotal ? 1 : -1),
    showSorterTooltip: { showArrow: false, title: `Sắp xếp thời gian` },
    className: "align-right",
    width: 200,
  },
  {
    title: "Đơn vị cung cấp dịch vụ giám sát hành trình",
    dataIndex: "dvccDv",
    key: "dvccDv",
    width: 200,
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    key: "note",
    width: 200,
  },
]
