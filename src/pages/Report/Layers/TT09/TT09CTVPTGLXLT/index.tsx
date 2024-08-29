import { useCallback, useState } from "react"
import { _const } from "../../../../../_constant"
import { TableC } from "../../../../../conponents/TableC"
import { IReportSearch, ReportSeachBar } from "../../../ReportSearchBar"
import { COLUMNS, IColumns } from "./COLUMNS"
import {
  getDriveContinusRpService,
  getParkingRpService,
} from "../../../../../services/reportServices"
import { store } from "../../../../../app/store"
import { api } from "../../../../../_helper"
import { getString } from "../../../../../utils/getString"
import { IDriverContinus, IParking } from "../../../../../_types/reportType"
import getTime from "../../../../../utils/getTime"
import { Checkbox } from "antd"
import { AddressCallback } from "../../../../../conponents/Address"
import { CoorGooleMap } from "../../../../../conponents/CoorGoogleMap"

export const TT09CTVPTGLXLT: React.FC = () => {
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
      const driverContinusPromise = getDriveContinusRpService?.({
        endTime: searchVals?.endTime,
        startTime: searchVals?.startTime,
        imei: searchVals?.devices?.join(","),
        minutes: 4 * 60,
        userId: store?.getState()?.user?.access?.userInfo?.id,
      })

      Promise.all([driverContinusPromise])
        .then(([dFb]: any) => {
          if (dFb?.result) {
            const data: IDriverContinus[] = dFb?.data

            let totalTime = 0

            const dataS: IColumns[] = data?.map?.((drive, index) => {
              const total_time = drive?.end_time - drive?.start_time
              totalTime = totalTime + (total_time || 0)
              console.log(drive)
              return {
                key: index + 1,
                stt: `${index + 1}`,
                vType: drive?.vehicle_type_name,
                driverName: drive?.license_number,
                licensePlates: drive?.vehicle_name,
                total_time: getTime?.caculateTime?.(total_time),
                start_time: getTime?.Unix2StringFormat(drive?.start_time),
                end_time: getTime?.Unix2StringFormat(drive?.end_time),
                start_coor: drive?.start_location,
                end_coor: drive?.end_location,
                start_address: drive?.start_address,
                end_address: drive?.end_address,
                totalTime: total_time,
              }
            })

            // const total = {
            //   key: 0,
            //   stt: "Tổng",
            //   vType: "-",
            //   driverName: "-",
            //   licensePlates: "-",
            //   total_time: getTime?.caculateTime?.(totalTime),
            //   start_time: "-",
            //   end_time: "-",
            //   start_coor: "-",
            //   end_coor: "-",
            //   start_address: "-",
            //   end_address: "-",
            // }

            const dataSet = dataS

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
    `CHI TIẾT VI PHẠM THỜI GIAN LÁI XE LIÊN TỤC`,
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
              <Checkbox
                checked={isBold15m}
                onChange={(e) => setIsBold15m(e?.target?.checked)}
              >
                In đậm đoạn lái xe liên tục trên 4 tiếng
              </Checkbox>
            </div>
          }
          onReload={() => searchVals && onSubmit(searchVals)}
          exportExcel={{
            fileName: "CHI_TIET_VI_PHAM_THOI_GIAN_LAI_XE_LIEN_TUC",
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

              return record?.totalTime >= 4 * 60 * 60
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
