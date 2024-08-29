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
  km: number
  licensePlates: string
  parkingCount: number
  parkingTotalTime: string
  route: ReactNode
  startAddress: string | ReactNode
  startCoor: ReactNode
  startTime: string
  time: string
  vType: string
  runningTotalTime: string
  data: IRouteDayReport
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
    width: 180,
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
    width: 180,
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
    title: "Quãng đường di chuyển (km)",
    key: "km",
    dataIndex: "km",
    width: 230,
    sorter: (a, b) => a.km - b.km,
  },
  {
    title: "Tổng thời gian di chuyển",
    key: "runningTotalTime",
    dataIndex: "runningTotalTime",
    width: 200,
    sorter: (a, b) => (a.runningTotalTime < b.runningTotalTime ? -1 : 1),
  },
  {
    title: "Số lần dừng đỗ",
    key: "parkingCount",
    dataIndex: "parkingCount",
    width: 130,
    sorter: (a, b) => a.parkingCount - b.parkingCount,
  },
  {
    title: "Tổng thời gian dừng đỗ",
    key: "parkingTotalTime",
    dataIndex: "parkingTotalTime",
    width: 200,
    sorter: (a, b) => (a.parkingTotalTime < b.parkingTotalTime ? -1 : 1),
  },
  {
    title: "Lộ trình",
    key: "route",
    dataIndex: "route",
    width: 120,
    render(value, record, index) {
      const data = record?.data
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
