import { useCallback, useState } from "react"
import { _const } from "../../../../../_constant"
import { TableC } from "../../../../../conponents/TableC"
import { IReportSearch, ReportSeachBar } from "../../../ReportSearchBar"
import { COLUMNS, IColumns } from "./COLUMNS"
import {
  TT09CTVPTDCXService,
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
  ITT09CTVPTDCXReport,
  ITT09THVPDVVTReport,
  ITT09VPTTDVVTReport,
} from "../../../../../_types/reportType"
import getTime from "../../../../../utils/getTime"
import { Checkbox } from "antd"
import { AddressCallback } from "../../../../../conponents/Address"

export const TT09CTVPTDCX: React.FC = () => {
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
      const reportPromise = TT09CTVPTDCXService?.({
        endTime: searchVals?.endTime,
        startTime: searchVals?.startTime,
        imei: searchVals?.devices?.join?.(","),
        userId: store?.getState()?.user?.access?.userInfo?.id,
        minutes: 0.3334,
      })

      Promise.all([reportPromise])
        .then(([reportFb]: any) => {
          if (reportFb?.result) {
            const data: ITT09CTVPTDCXReport[] = Object?.values?.(reportFb?.data)

            const dataS: IColumns[] = data?.map?.((record, index) => {
              const start = record?.start
              const finish = record?.finish
              return {
                key: index + 1,
                stt: `${index + 1}`,

                avgSpeedOver: Number(record?.avg_speed?.toFixed?.(2) || 0),
                endAddressOver: (
                  <AddressCallback
                    address=""
                    lat={finish?.latitude}
                    lng={finish?.longitude}
                  />
                ),
                endCoorOver: `${finish?.latitude},${finish?.longitude}`,
                endOver: getTime?.Unix2StringFormatT(finish?.time),
                kmOver: Number(record?.distance_over_speed?.toFixed?.(2) || 0),
                licensePlates: record?.vehicle_name,
                note: "-",
                startAddressOver: (
                  <AddressCallback
                    address=""
                    lat={start?.latitude}
                    lng={start?.longitude}
                  />
                ),
                startCoorOver: `${start?.latitude},${start?.longitude}`,
                startOver: getTime?.Unix2StringFormatT(start?.time),
                time: getTime?.Unix2StringFormatD(start?.time),
                totalTimeOver: getTime?.caculateTime(
                  finish?.time - start?.time,
                ),
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
    `CHI TIẾT VI PHẠM TỐC ĐỘ CHẠY XE`,
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
            fileName: "TT73_CHI_TIET_VI_PHAM_TOC_DO_CHAY_XE",
            title: excelReportTitle,
          }}
          scroll={{
            useScroll: true,
            minusBon: 25,
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
