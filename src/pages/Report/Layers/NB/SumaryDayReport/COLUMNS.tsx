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
  endAddress: string | ReactNode
  endCoor: ReactNode
  endTime: string
  key: number
  km: number | string
  licensePlates: string
  parkingCount: number
  parkingTotalTime: string
  route: ReactNode
  startAddress: string | ReactNode
  startCoor: ReactNode
  startTime: string
  time: string
  vType: string
  max_speed: number | string
  avg_speed: number | string
  number_over_speed: number
  runningTotalTime: string
  data?: IRouteDayReport
}

export const COLUMNS: ColumnsType<IColumns> = [
  {
    title: "#",
    key: "stt",
    dataIndex: "stt",
    width: 60,
    fixed: "left",
  },
  {
    title: "Ngày tháng",
    key: "time",
    dataIndex: "time",
    width: 120,
    fixed: "left",
    sorter: (a, b) => (a.time < b.time ? -1 : 1),
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
    title: "Loại phương tiện",
    key: "vType",
    dataIndex: "vType",
    width: 160,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },

  {
    title: "Bắt đầu di chuyển",
    key: "startTime",
    dataIndex: "startTime",
    width: 145,
    className: "text-center",
  },
  {
    title: "Toạ độ bắt đầu",
    key: "startCoor",
    dataIndex: "startCoor",
    width: 170,
    render(value, record, index) {
      return <CoorGooleMap coor={value} />
    },
  },
  {
    title: "Vị trí bắt đầu",
    key: "startAddress",
    dataIndex: "startAddress",
    width: 300,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
  {
    title: "Kết thúc di chuyển",
    key: "endTime",
    dataIndex: "endTime",
    width: 150,
    className: "text-center",
  },
  {
    title: "Toạ độ kết thúc",
    key: "endCoor",
    dataIndex: "endCoor",
    width: 170,
    render(value, record, index) {
      return <CoorGooleMap coor={value} />
    },
  },
  {
    title: "Vị trí kết thúc",
    key: "endAddress",
    dataIndex: "endAddress",
    width: 300,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
  {
    title: "KM",
    key: "km",
    dataIndex: "km",
    width: 80,
    sorter: (a, b) => Number(a.km) - Number(b.km),
    render(value, record, index) {
      return <div className="pr-2">{value}</div>
    },
    className: "text-right",
  },
  {
    title: "Tổng TG di chuyển",
    key: "runningTotalTime",
    dataIndex: "runningTotalTime",
    width: 160,
    sorter: (a, b) => (a.runningTotalTime < b.runningTotalTime ? -1 : 1),
    className: "text-center",
  },
  {
    title: "Số lần dừng đỗ",
    key: "parkingCount",
    dataIndex: "parkingCount",
    width: 130,
    sorter: (a, b) => a.parkingCount - b.parkingCount,
    className: "text-right",
  },
  {
    title: "Tổng TG dừng đỗ",
    key: "parkingTotalTime",
    dataIndex: "parkingTotalTime",
    width: 160,
    sorter: (a, b) => (a.parkingTotalTime < b.parkingTotalTime ? -1 : 1),
    className: "text-center",
  },
  {
    title: "Tốc độ TB",
    key: "avg_speed",
    dataIndex: "avg_speed",
    width: 100,
    sorter: (a, b) => (a.avg_speed < b.avg_speed ? -1 : 1),
    className: "text-right",
  },
  {
    title: "Tốc độ cực đại",
    key: "max_speed",
    dataIndex: "max_speed",
    width: 130,
    sorter: (a, b) => (a.max_speed < b.max_speed ? -1 : 1),
    className: "text-right",
  },
  {
    title: "Quá tốc độ",
    key: "number_over_speed",
    dataIndex: "number_over_speed",
    width: 120,
    sorter: (a, b) => (a.number_over_speed < b.number_over_speed ? -1 : 1),
    className: "text-right",
  },
  {
    title: "Lộ trình",
    key: "route",
    dataIndex: "route",
    width: 120,
    render(value, record, index) {
      const data = record?.data
      if (!data) return "-"
      const imei = store
        ?.getState?.()
        ?.device?.data?.online?.array?.find?.(
          (v) => v?.vehicle_name == data?.vehicle_name,
        )?.imei
      const onPress = () => {
        if (!imei) {
          return api.message?.warning?.(_const?.string?.message?.noImei)
        }
        _app.routeModal?.showModalRoute({
          startTime: getTime?.String2Unit(
            `${getTime?.Unix2StringFormatC(
              data?.start?.time,
              "YYYY-MM-DD",
            )} 00:00:00`,
          ),
          endTime: getTime?.String2Unit(
            `${getTime?.Unix2StringFormatC(
              data?.finish?.time,
              "YYYY-MM-DD",
            )} 23:59:59`,
          ),
          imei: imei,
        })
      }
      return (
        <Button onClick={onPress} size="small" type="primary">
          Xem lộ trình
        </Button>
      )
    },
  },
]
