import { useCallback, useState } from "react"
import { _const } from "../../../../../_constant"
import { TableC } from "../../../../../conponents/TableC"
import { IReportSearch, ReportSeachBar } from "../../../ReportSearchBar"
import { COLUMNS, IColumns } from "./COLUMNS"
import {
  TT09THVPDVVTService,
  TT09VPTTDVVTService,
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
  ITT09THVPDVVTReport,
  ITT09VPTTDVVTReport,
} from "../../../../../_types/reportType"
import getTime from "../../../../../utils/getTime"
import { Checkbox } from "antd"
import { AddressCallback } from "../../../../../conponents/Address"

export const TT09VPTDL: React.FC = () => {
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
      return
      setIsLoading(true)
      const reportPromise = TT09VPTTDVVTService?.({
        endTime: searchVals?.endTime,
        startTime: searchVals?.startTime,
        imei: searchVals?.devices?.join?.(","),
        userId: store?.getState()?.user?.access?.userInfo?.id,
      })

      Promise.all([reportPromise])
        .then(([reportFb]: any) => {
          if (reportFb?.result) {
            // const data: ITT09VPTTDVVTReport[] = Object?.values?.(reportFb?.data)

            // const dataS: IColumns[] = data?.map?.((record, index) => {
            //   const { _5, _5_10, _10_20, _20_35, _35 } = record?.count
            //   const tdTotal = _5 + _5_10 + _10_20 + _20_35 + _35

            //   const routePercent =
            //     (
            //       (record?.distance_over_speed / record?.total_distance) *
            //         100 || 0
            //     )?.toFixed?.(2) || 0

            //   const timePercent =
            //     (
            //       (record?.total_time_over_speed / record?.total_time) * 100 ||
            //       0
            //     )?.toFixed?.(2) || 0

            //   return {
            //     key: index + 1,
            //     stt: `${index + 1}`,

            //     km: record?.total_distance?.toFixed?.(2),
            //     kmOver: record?.distance_over_speed?.toFixed?.(2),
            //     licensePlates: record?.vehicle_name,
            //     note: "-",
            //     overTime: getTime?.caculateTime(record?.total_time_over_speed),
            //     driveTotalTime: getTime?.caculateTime(record?.total_time),
            //     routePercent: routePercent,

            //     under5: _5,
            //     td5to10: _5_10,
            //     td10to20: _10_20,
            //     td20to35: _20_35,
            //     tdover35: _35,
            //     tdTotal: tdTotal,
            //     timePercent: timePercent,
            //     vType: record?.vehicle_type_name,
            //   }
            // })

            // setDataSource(dataS)

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
    `CHI TIẾT VI PHẠM TRUYỀN DỮ LIỆU THEO ĐƠN VỊ VẬN TẢI`,
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
            fileName: "TT73_CHI_TIET_VI_PHAM_TRUYEN_DU_LIEU",
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
