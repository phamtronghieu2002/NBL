import { useCallback, useState } from "react"
import { _const } from "../../../../../_constant"
import { TableC } from "../../../../../conponents/TableC"
import { IReportSearch, ReportSeachBar } from "../../../ReportSearchBar"
import { COLUMNS, IColumns } from "./COLUMNS"
import {
  TT73SynByVehicleReportService,
  getRouteIndayReport,
  overSpeedReportReport,
} from "../../../../../services/reportServices"
import { store } from "../../../../../app/store"
import { api } from "../../../../../_helper"
import { getString } from "../../../../../utils/getString"
import {
  IParking,
  IRouteDayReport,
  ISynByVehicleReport,
} from "../../../../../_types/reportType"
import getTime from "../../../../../utils/getTime"
import { Checkbox } from "antd"
import { AddressCallback } from "../../../../../conponents/Address"

export const TT73SynByVehicle: React.FC = () => {
  const [dataSource, setDataSource] = useState<IColumns[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchVals, setSeachVals] = useState<IReportSearch>()
  const [isBold15m, setIsBold15m] = useState<boolean>(true)

  const seachParts = [
    {
      title: _const.string?.searchReportTitle?.rangeTime,
      key: "rangeTime",
      required: true,
    },
    {
      title: _const.string?.searchReportTitle?.team,
      key: "team",
      required: true,
    },
    // {
    //   title: _const.string?.searchReportTitle?.vehicles,
    //   key: "singleVehicle",
    //   required: true,
    // },
    {
      title: _const.string?.searchReportTitle?.vehicles,
      key: "multiVehicle",
      required: true,
    },
    // {
    //   title: _const.string?.searchReportTitle?.minuteParking,
    //   key: "minutes",
    //   required: true,
    // },
  ]

  const getData = useCallback((searchVals: IReportSearch) => {
    if (
      searchVals?.endTime &&
      searchVals?.startTime &&
      searchVals?.devices?.length
    ) {
      setIsLoading(true)
      const reportPromise = TT73SynByVehicleReportService?.({
        endTime: searchVals?.endTime,
        startTime: searchVals?.startTime,
        imei: searchVals?.devices?.join?.(","),
        userId: store?.getState()?.user?.access?.userInfo?.id,
      })

      Promise.all([reportPromise])
        .then(([reportFb]: any) => {
          if (reportFb?.result) {
            const data: ISynByVehicleReport[] = Object?.values?.(reportFb?.data)

            let totalTime = 0
            const getOverSpeedPersent = (km: number, totalKm: number) => {
              if (!totalKm) return 0
              return Number(((km / totalKm) * 100)?.toFixed(2)) || 0
            }

            const dataS: IColumns[] = data?.map?.((record, index) => {
              const km = record?.km
              return {
                key: index + 1,
                stt: `${index + 1}`,
                km: Number(record?.total_distance?.toFixed(2)),
                licensePlates: record?.vehicle_name,
                note: "-",

                tdu5: record?.count?._5 || 0,
                td5to10: record?.count?._5_10 || 0,
                td10to20: record?.count?._10_20 || 0,
                td20to35: record?.count?._20_35 || 0,
                tdover35: record?.count?._35 || 0,

                pu5: getOverSpeedPersent(km?._5, record?.total_distance),
                p5to10: getOverSpeedPersent(km?._5_10, record?.total_distance),
                p10to20: getOverSpeedPersent(
                  km?._10_20,
                  record?.total_distance,
                ),
                p20to35: getOverSpeedPersent(
                  km?._20_35,
                  record?.total_distance,
                ),
                pover35: getOverSpeedPersent(km?._35, record?.total_distance),

                totalParkingCount: record?.total_number_stop || 0,
              }
            })

            const total = {
              key: 0,
              stt: "Tổng",
              address: "-",
              coor: `-`,
              driverName: "",
              licensePlates: "-",
              parkingTotalTime: getTime?.caculateTime?.(totalTime),
              totalTime: totalTime,
              time: "-",
              startTime: "-",
              endTime: "-",
              vType: "-",
            }

            // const dataSet = (!dataS?.length ? dataS : [total, ...dataS]) || []

            setDataSource(dataS)

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
    `BÁO CÁO TỔNG HỢP THEO XE`,
    `Thời gian: Từ ${getTime.Unix2StringFormat(
      searchVals?.startTime || 0,
    )} đến ${getTime.Unix2StringFormat(searchVals?.endTime || 0)}`,
    `Phương tiện: ${searchVals?.devices?.join(", ")}`,
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
            fileName: "TT73_BAO_CAO_TONG_HOP_THEO_XE",
            title: excelReportTitle,
          }}
          scroll={{
            useScroll: true,
            minusBon: 45,
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
