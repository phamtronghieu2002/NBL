import { useCallback, useState } from "react"
import { _const } from "../../../../../_constant"
import { TableC } from "../../../../../conponents/TableC"
import { IReportSearch, ReportSeachBar } from "../../../ReportSearchBar"
import { COLUMNS, IColumns } from "./COLUMNS"
import {
  TT09THVPDVVTService,
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
} from "../../../../../_types/reportType"
import getTime from "../../../../../utils/getTime"
import { Checkbox } from "antd"
import { AddressCallback } from "../../../../../conponents/Address"

export const TT09THVPDVVT: React.FC = () => {
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
      const reportPromise = TT09THVPDVVTService?.({
        endTime: searchVals?.endTime,
        startTime: searchVals?.startTime,
        imei: searchVals?.devices?.join?.(","),
        userId: store?.getState()?.user?.access?.userInfo?.id,
      })

      Promise.all([reportPromise])
        .then(([reportFb]: any) => {
          if (reportFb?.result) {
            // return
            const data: ITT09THVPDVVTReport[] = Object?.values?.(reportFb?.data)

            const dataS: IColumns[] = data?.map?.((record, index) => {
              const { _5, _5_10, _10_20, _20_35, _35 } = record?.count
              const {
                _5: _5_km,
                _5_10: _5_10_km,
                _10_20: _10_20_km,
                _20_35: _20_35_km,
                _35: _35_km,
              } = record?.km

              const totolKmOver =
                _5_km + _5_10_km + _10_20_km + _20_35_km + _35_km

              const tdPrecent =
                Number(
                  ((totolKmOver / record?.total_distance) * 100)?.toFixed?.(
                    2,
                  ) || 0,
                ) || 0

              const overRouteCount =
                _5 +
                _5_10 +
                _10_20 +
                _20_35 +
                _35 +
                record?.continuous_4 +
                record?.continuous_10
              const tdTotal = _5 + _5_10 + _10_20 + _20_35 + _35
              const cotinusTotal = record?.continuous_4 + record?.continuous_10
              const drivePercent =
                ((cotinusTotal / overRouteCount) * 100 || 0)?.toFixed?.(2) || 0
              return {
                key: index + 1,
                stt: `${index + 1}`,
                km: Number(record?.total_distance?.toFixed?.(2) || 0),
                licensePlates: record?.vehicle_name,
                note: "-",
                drivePercent: drivePercent,
                over4HourDrive: record?.continuous_4,
                over10HourCount: record?.continuous_10,
                overRouteCount: overRouteCount,
                routePercent: tdPrecent,

                under5: _5,
                td5to10: _5_10,
                td10to20: _10_20,
                td20to35: _20_35,
                tdPrecent: tdPrecent,
                tdTotal: tdTotal,
                tdover35: _35,
              }
            })

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
    `TỔNG HỢP TÌNH HÌNH VI PHẠM THEO ĐƠN VỊ VẬN TẢI`,
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
            fileName: "TT73_TONG_HOP_TINH_HINH_VI_PHAM_THEO_DON_VI_VAN_TAI",
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
