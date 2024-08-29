import { useCallback, useState } from "react"
import { _const } from "../../../../../_constant"
import { TableC } from "../../../../../conponents/TableC"
import { IReportSearch, ReportSeachBar } from "../../../ReportSearchBar"
import { COLUMNS, IColumns } from "./COLUMNS"
import {
  detailedActivityReportService,
  getDriveContinusRpService,
  getParkingRpService,
} from "../../../../../services/reportServices"
import { store } from "../../../../../app/store"
import { api } from "../../../../../_helper"
import { getString } from "../../../../../utils/getString"
import {
  IDetailActivityReport,
  IDriverContinus,
  IParking,
} from "../../../../../_types/reportType"
import getTime from "../../../../../utils/getTime"
import { Checkbox } from "antd"
import { AddressCallback } from "../../../../../conponents/Address"
import { CoorGooleMap } from "../../../../../conponents/CoorGoogleMap"

export const DetailedActivityReport: React.FC = () => {
  const [dataSource, setDataSource] = useState<IColumns[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchVals, setSeachVals] = useState<IReportSearch>()

  const seachParts = [
    {
      title: _const.string?.searchReportTitle?.rangeTime,
      key: "rangeTime",
      required: true,
    },
    // {
    //   title: _const.string?.searchReportTitle?.vehicles,
    //   key: "singleVehicle",
    //   required: true,
    // },
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
      searchVals?.devices?.[0]
    ) {
      setIsLoading(true)
      const driverContinusPromise = detailedActivityReportService?.({
        endTime: searchVals?.endTime,
        startTime: searchVals?.startTime,
        imei: searchVals?.devices?.join(","),
        userId: store?.getState()?.user?.access?.userInfo?.id,
      })

      Promise.all([driverContinusPromise])
        .then(([dFb]: any) => {
          if (dFb?.result) {
            const data: IDetailActivityReport[] = Object.values(dFb?.data)
            let totalTime = 0
            let totalKm = 0

            const dataS: IColumns[] = data?.map?.((record, index) => {
              const start = record?.start
              const finish = record?.finish
              const rangeTime = finish?.time - start?.time

              totalKm += record?.distance || 0
              totalTime += rangeTime || 0

              return {
                key: index + 1,
                stt: `${index + 1}`,

                endAddress: (
                  <AddressCallback
                    address={""}
                    lat={Number(finish?.latitude)}
                    lng={Number(finish?.longitude)}
                  />
                ),
                endTime: getTime?.Unix2StringFormatT(finish?.time),
                kmGps: Number(record?.distance?.toFixed?.(2)) || 0,
                licensePlates: record?.vehicle_name,
                rangeTime: getTime.caculateTimeFMS(rangeTime),
                startAddress: (
                  <AddressCallback
                    address={""}
                    lat={Number(start?.latitude)}
                    lng={Number(start?.longitude)}
                  />
                ),
                startTime: getTime?.Unix2StringFormatT(start?.time),
                date: getTime?.Unix2StringFormatD(start?.time),
                vType: record?.vehicle_type_name,
                rangeTimeUnix: rangeTime,
              }
            })

            const total = {
              key: 0,
              stt: `Tổng`,

              endAddress: "-",
              endTime: getTime.Unix2StringFormatT(
                data?.[data?.length - 1]?.finish?.time,
              ),
              kmGps: Number(totalKm?.toFixed?.(2)),
              licensePlates: "-",
              rangeTime: getTime.caculateTimeFMS(totalTime),
              startAddress: "-",
              startTime: getTime.Unix2StringFormatT(data?.[0]?.start?.time),
              date: getTime?.Unix2StringFormatD(data?.[0]?.start?.time),
              vType: "-",
              rangeTimeUnix: 0,
            }

            const dataSet = (!dataS?.length ? dataS : [total, ...dataS]) || []

            setDataSource(dataSet)

            setSeachVals(searchVals)
          } else {
            api.message?.error(getString.errorAxios(dFb))
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
    `BÁO CÁO CHI TIẾT HOẠT ĐỘNG`,
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
          title={" "}
          onReload={() => searchVals && onSubmit(searchVals)}
          exportExcel={{
            fileName: "BAO_CAO_CHI_TIET_HOAT_DONG",
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
              } else {
                return ""
              }
            },
          }}
          showTotal
        />
      </div>
    </div>
  )
}
