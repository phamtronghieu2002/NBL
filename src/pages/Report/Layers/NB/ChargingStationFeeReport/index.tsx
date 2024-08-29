import { useCallback, useState } from "react"
import { _const } from "../../../../../_constant"
import { TableC } from "../../../../../conponents/TableC"
import { IReportSearch, ReportSeachBar } from "../../../ReportSearchBar"
import { COLUMNS, IColumns } from "./COLUMNS"
import {
  chargingStationFeeReportService,
  chargingStationReportService,
  getParkingRpService,
} from "../../../../../services/reportServices"
import { store } from "../../../../../app/store"
import { api } from "../../../../../_helper"
import { getString } from "../../../../../utils/getString"
import {
  IChargingStationFeeReport,
  IChargingStationReport,
  IParking,
} from "../../../../../_types/reportType"
import getTime from "../../../../../utils/getTime"
import { Checkbox } from "antd"
import { AddressCallback } from "../../../../../conponents/Address"
import { useAppSelector } from "../../../../../app/hooks"
import { CoorGooleMap } from "../../../../../conponents/CoorGoogleMap"
import { _array } from "../../../../../utils/_array"

export const ChargingStationFeeReport: React.FC = () => {
  const [dataSource, setDataSource] = useState<IColumns[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchVals, setSeachVals] = useState<IReportSearch>()
  const driverOject = useAppSelector((state) => state?.user?.driver?.objectLic)

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
      // true
    ) {
      setIsLoading(true)
      const reportPromise = chargingStationFeeReportService?.({
        endTime: searchVals?.endTime,
        startTime: searchVals?.startTime,
        imei: searchVals?.devices?.join?.(","),
        userId: store?.getState()?.user?.access?.userInfo?.id,
      })

      Promise.all([reportPromise])
        .then(([reportFb]: any) => {
          if (reportFb?.result) {
            const data: IChargingStationFeeReport[] = reportFb?.data

            const dataS: IColumns[] = data?.map?.((record, index) => {
              return {
                key: index + 1,
                stt: `${index + 1}`,
                address: record?.address || (
                  <AddressCallback
                    address={record?.address}
                    lat={record?.lat}
                    lng={record?.lng}
                  />
                ),
                fee: record?.fee,
                coor: <CoorGooleMap coor={`${record?.lat},${record?.lng}`} />,
                driverName: _array?.getDriverNameFromLic(record?.dri),
                licensePlates: _array.getVehicleNameFromImei(record?.imei),
                time: getTime.Unix2StringFormat(record?.start_time),
                name: record?.name,
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
            " "
            // <div>
            //   <Checkbox
            //     checked={isBold15m}
            //     onChange={(e) => setIsBold15m(e?.target?.checked)}
            //   >
            //     In đậm đoạn dừng đỗ trên 15 phút
            //   </Checkbox>
            // </div>
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
          }}
          showTotal
        />
      </div>
    </div>
  )
}
