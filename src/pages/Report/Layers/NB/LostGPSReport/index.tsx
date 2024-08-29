import { useCallback, useState } from "react"
import { _const } from "../../../../../_constant"
import { TableC } from "../../../../../conponents/TableC"
import { IReportSearch, ReportSeachBar } from "../../../ReportSearchBar"
import { COLUMNS, IColumns } from "./COLUMNS"
import {
  getRouteIndayReport,
  lostGPSReportService,
  offlineReportService,
} from "../../../../../services/reportServices"
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
import {
  ILostGPSRecord,
  IOfflineRecord,
} from "../../../../../_types/deviceType"

export const LostGPSReport: React.FC = () => {
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
      const reportPromise = lostGPSReportService?.({
        endTime: searchVals?.endTime,
        startTime: searchVals?.startTime,
        imei: searchVals?.devices?.join?.(","),
        userId: store?.getState()?.user?.access?.userInfo?.id,
      })

      Promise.all([reportPromise])
        .then(([reportFb]: any) => {
          if (reportFb?.result) {
            const data: ILostGPSRecord[] = reportFb?.data

            const dataS: IColumns[] = data?.map?.((record, index) => {
              return {
                key: index + 1,
                endAddress: record?.end_address || (
                  <AddressCallback
                    address={record?.end_address}
                    lat={record?.end_latitude}
                    lng={record?.end_longitude}
                  />
                ),
                endCoor: `${record?.end_latitude},${record?.end_longitude}`,
                endTime: getTime?.Unix2StringFormat(record?.end_time),
                licensePlates: record?.vehicle_name,
                rangeTime: getTime.caculateTimeFMS(
                  record?.end_time - record?.start_time,
                ),
                startAddress: record?.start_address || (
                  <AddressCallback
                    address={record?.start_address}
                    lat={record?.start_latitude}
                    lng={record?.start_longitude}
                  />
                ),
                startCoor: `${record?.start_latitude},${record?.start_longitude}`,
                startTime: getTime?.Unix2StringFormat(record?.start_time),
                distance: 0,
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
    `BÁO CÁO CHI TIẾT MẤT GPS`,
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
            fileName: "TT73_BAO_CAO_LO_TRINH_TRONG_NGAY",
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
