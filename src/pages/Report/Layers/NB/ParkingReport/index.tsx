import { useCallback, useState } from "react"
import { _const } from "../../../../../_constant"
import { TableC } from "../../../../../conponents/TableC"
import { IReportSearch, ReportSeachBar } from "../../../ReportSearchBar"
import { COLUMNS, IColumns } from "./COLUMNS"
import { getParkingRpService } from "../../../../../services/reportServices"
import { store } from "../../../../../app/store"
import { api } from "../../../../../_helper"
import { getString } from "../../../../../utils/getString"
import { IParking } from "../../../../../_types/reportType"
import getTime from "../../../../../utils/getTime"
import { Checkbox } from "antd"
import { AddressCallback } from "../../../../../conponents/Address"
import { useAppSelector } from "../../../../../app/hooks"

export const ParkingReport: React.FC = () => {
  const [dataSource, setDataSource] = useState<IColumns[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchVals, setSeachVals] = useState<IReportSearch>()
  const [isBold15m, setIsBold15m] = useState<boolean>(true)
  const driverOject = useAppSelector((state) => state?.user?.driver?.objectLic)

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
    {
      title: _const.string?.searchReportTitle?.minuteParking,
      key: "minutes",
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
      const parkingPromise = getParkingRpService?.({
        endTime: searchVals?.endTime,
        startTime: searchVals?.startTime,
        imei: searchVals?.devices?.join?.(","),
        minutes: searchVals?.minutes || 0.001,
        userId: store?.getState()?.user?.access?.userInfo?.id,
      })

      Promise.all([parkingPromise])
        .then(([parkingFb]: any) => {
          if (parkingFb?.result) {
            const data: IParking[] = parkingFb?.data

            let totalTime = 0

            const dataS: IColumns[] = data?.map?.((parking, index) => {
              totalTime = totalTime + parking?.duration_seconds
              return {
                key: index + 1,
                stt: `${index + 1}`,
                address: parking?.address || (
                  <AddressCallback
                    address={parking?.address}
                    lat={parking?.latitude}
                    lng={parking?.longitude}
                  />
                ),
                coor: `${parking?.latitude},${parking?.longitude}`,
                driverName:
                  driverOject?.[parking?.license_number]?.name ||
                  _const.string?.s?.unknow_,
                licensePlates: parking?.vehicle_name,
                parkingTotalTime: getTime?.caculateTimeFMS?.(
                  parking?.duration_seconds,
                ),
                totalTime: parking?.duration_seconds,
                time: getTime?.Unix2StringFormat(parking?.start_time),
                startTime: getTime?.Unix2StringFormat(parking?.start_time),
                endTime: getTime?.Unix2StringFormat(parking?.end_time),
                vType: parking?.vehicle_type_name,
              }
            })

            const total = {
              key: 0,
              stt: "Tổng",
              address: "-",
              coor: `-`,
              driverName: "",
              licensePlates: "-",
              parkingTotalTime: getTime?.caculateTimeFMS?.(totalTime),
              totalTime: totalTime,
              time: "-",
              startTime: "-",
              endTime: "-",
              vType: "-",
            }

            const dataSet = (!dataS?.length ? dataS : [total, ...dataS]) || []

            setDataSource(dataSet)

            setSeachVals(searchVals)
          } else {
            api.message?.error(getString.errorAxios(parkingFb))
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
    `BÁO CÁO DỪNG ĐỖ`,
    `Thời gian: Từ ${getTime.Unix2StringFormat(
      searchVals?.startTime || 0,
    )} đến ${getTime.Unix2StringFormat(searchVals?.endTime || 0)}`,
    `Phương tiện: ${searchVals?.devices?.join(", ")}`,
    `Dừng đỗ nhỏ nhất: ${searchVals?.minutes} phút`,
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
                In đậm đoạn dừng đỗ trên 15 phút
              </Checkbox>
            </div>
          }
          onReload={() => searchVals && onSubmit(searchVals)}
          exportExcel={{
            fileName: "BAO_CAO_DUNG_DO",
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
