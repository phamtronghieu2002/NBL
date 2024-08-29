import { useCallback, useState } from "react"
import { _const } from "../../../../../_constant"
import { TableC } from "../../../../../conponents/TableC"
import { IReportSearch, ReportSeachBar } from "../../../ReportSearchBar"
import { COLUMNS, IColumns } from "./COLUMNS"
import { getRouteIndayReport } from "../../../../../services/reportServices"
import { store } from "../../../../../app/store"
import { api } from "../../../../../_helper"
import { getString } from "../../../../../utils/getString"
import {
  IParking,
  IRouteDayReport,
  ISumaryDayReport,
} from "../../../../../_types/reportType"
import getTime from "../../../../../utils/getTime"
import { Checkbox } from "antd"
import { AddressCallback } from "../../../../../conponents/Address"
import { _array } from "../../../../../utils/_array"

export const SumaryDayReport: React.FC = () => {
  const [dataSource, setDataSource] = useState<IColumns[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchVals, setSeachVals] = useState<IReportSearch>()
  const [isBold15m, setIsBold15m] = useState<boolean>(true)

  const seachParts = [
    {
      title: _const.string?.searchReportTitle?.rangeTime,
      key: "rangeDate",
      required: true,
    },
    {
      title: _const.string?.searchReportTitle?.team,
      key: "team",
      required: true,
    },
    {
      title: _const.string?.searchReportTitle?.vehicles,
      key: "multiVehicle",
      required: true,
    },
  ]

  const getData = useCallback((searchVals: IReportSearch) => {
    if (
      searchVals?.endTime &&
      searchVals?.startTime &&
      searchVals?.devices?.length
    ) {
      setIsLoading(true)
      const reportPromise = getRouteIndayReport?.({
        endTime: searchVals?.endTime,
        startTime: searchVals?.startTime,
        imei: searchVals?.devices?.join?.(","),
        userId: store?.getState()?.user?.access?.userInfo?.id,
        type: 2,
      })

      Promise.all([reportPromise])
        .then(([reportFb]: any) => {
          if (reportFb?.result) {
            const data: ISumaryDayReport[] = Object?.values?.(reportFb?.data)

            let totalParkingTime = 0
            let totalParkingCount = 0
            let totalOverSpeedCount = 0
            let totalRunTime = 0
            let totalKm = 0
            let totalMaxSpeed = 0

            const dataS: IColumns[] = data?.map?.((record, index) => {
              totalKm += record?.total_distance || 0
              totalParkingTime += record?.stop_time || 0
              totalParkingCount += record?.number_stop || 0
              totalOverSpeedCount += record?.number_over_speed || 0
              totalRunTime += record?.run_time
              record?.max_speed > totalMaxSpeed
                ? (totalMaxSpeed = record?.max_speed)
                : null

              return {
                key: index + 1,
                stt: `${index + 1}`,
                endAddress: record?.finish?.address || (
                  <AddressCallback
                    address={record?.finish?.address}
                    lat={record?.finish?.latitude}
                    lng={record?.finish?.longitude}
                  />
                ),
                data: record,
                endCoor: `${record?.finish?.latitude},${record?.finish?.longitude}`,
                endTime: getTime?.Unix2StringFormatT(record?.finish?.time),
                km: record?.total_distance?.toFixed?.(2) || 0,
                licensePlates: record?.vehicle_name,
                parkingCount: record?.number_stop,
                parkingTotalTime: getTime?.caculateTimeFMS(record?.stop_time),
                route: "-",
                startAddress: record?.start?.address || (
                  <AddressCallback
                    address={record?.start?.address}
                    lat={record?.start?.latitude}
                    lng={record?.start?.longitude}
                  />
                ),
                max_speed: (record?.max_speed || 0)?.toFixed?.(2),
                avg_speed: (record?.avg_speed || 0)?.toFixed?.(2),
                number_over_speed: record?.number_over_speed,
                startCoor: `${record?.start?.latitude},${record?.start?.longitude}`,
                startTime: getTime?.Unix2StringFormatT(record?.start?.time),
                time: getTime?.Unix2StringFormatC(record?.time, "DD/MM/YYYY"),
                vType: record?.vehicle_type_name,
                runningTotalTime: getTime?.caculateTimeFMS(record?.run_time),
              }
            })

            const total = {
              key: 0,
              stt: `Tổng`,
              endAddress: "-",
              data: undefined,
              endCoor: "-",
              endTime: "-",
              km: Number(totalKm?.toFixed?.(2) || 0),
              licensePlates: "-",
              parkingCount: totalParkingCount,
              parkingTotalTime: getTime?.caculateTimeFMS(totalParkingTime),
              route: "-",
              startAddress: "-",
              max_speed: totalMaxSpeed?.toFixed?.(2),
              avg_speed: 0,
              number_over_speed: totalOverSpeedCount,
              startCoor: `-`,
              startTime: "-",
              time: "-",
              vType: "-",
              runningTotalTime: getTime?.caculateTimeFMS(totalRunTime),
            }

            const dataSet = (!dataS?.length ? dataS : [total, ...dataS]) || []

            setDataSource(dataSet)

            setSeachVals(searchVals)
          } else {
            api.message?.error(getString.errorAxios(reportFb))
            setDataSource([])
          }
        })
        .catch((error) => {
          setDataSource([])
          api.message?.error(getString.errorAxiosParams(error))
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [])

  const onSubmit = (searchVals: IReportSearch) => {
    getData(searchVals)
  }

  const excelReportTitle: string[] = [
    `BÁO CÁO TỔNG HỢP THEO NGÀY`,
    `Thời gian: Từ ${getTime.Unix2StringFormat(
      searchVals?.startTime || 0,
    )} đến ${getTime.Unix2StringFormat(searchVals?.endTime || 0)}`,
    `Phương tiện: ${_array
      ?.deviceList2VehicleList?.(searchVals?.devices)
      ?.join(", ")}`,
  ]

  return (
    <div className="h-full  flex flex-col gap-2">
      <div className="px-2 py-2 bg-white shadow-sm">
        <ReportSeachBar
          isLoading={isLoading}
          onSubmitSearch={onSubmit}
          parts={seachParts}
        />
      </div>
      <div className="flex-1 main-rp-table shadow pb-2">
        <TableC
          title={
            <div>
              {/* <Checkbox
                checked={isBold15m}
                onChange={(e) => setIsBold15m(e?.target?.checked)}
              >
                In đậm đoạn dừng đỗ trên 15 phút
              </Checkbox> */}
            </div>
          }
          onReload={() => searchVals && onSubmit(searchVals)}
          exportExcel={{
            fileName: "BAO_TONG_HOP_THEO_NGAY",
            title: excelReportTitle,
          }}
          scroll={{
            useScroll: true,
            minusBon: -2,
          }}
          props={{
            loading: isLoading,
            columns: COLUMNS,
            dataSource: dataSource,
            size: "small",
            rowClassName(record) {
              if (record?.key == 0) {
                return "bg-warning_03 font-semibold"
              }

              if (!isBold15m) return ""

              return record?.totalTime >= 15 * 60
                ? "bg-warning_03 font-semibold"
                : ""
            },
          }}
          showTotal
        />
      </div>
    </div>
  )
}
