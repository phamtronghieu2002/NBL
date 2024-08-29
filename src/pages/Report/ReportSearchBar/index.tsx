import { ReactNode, useCallback, useState } from "react"
import { TimeRangePicker } from "../../../conponents/picker/RangeTimePicker"
import {
  VehiclePicker,
  VehicleTreeSelect,
} from "../../../conponents/picker/VehiclePicker"
import { Button, Input, InputNumber } from "antd"
import dayjs from "dayjs"
import getTime from "../../../utils/getTime"
import { api } from "../../../_helper"
import { TeamTreeSelect } from "../../../conponents/picker/TeamPicker"
import { CustomerTreeSelect } from "../../../conponents/tree/CustomerTree"
import { _array } from "../../../utils/_array"
import { DriverTreeSelect } from "../../../conponents/picker/DriverPicker"

const mainSearchHeight = 28

export interface IReportSearch {
  startTime?: number
  endTime?: number
  devices?: string[]
  customerId?: string[]
  limit?: number
  minutes?: number
  team?: string[]
  drivers?: string[]
}

interface ISeachComItem {
  title: string
  key: string
  component: (defaultVals?: IReportSearch) => ReactNode
}
interface IPart {
  required: boolean
  key: string
  title: string
  addonAfter?: string
}

interface IProps {
  parts: IPart[]
  defaultVals?: IReportSearch
  isLoading?: boolean
  onSubmitSearch?: (val: IReportSearch) => void
}

export const ReportSeachBar: React.FC<IProps> = ({
  parts,
  defaultVals = {},
  onSubmitSearch,
  isLoading,
}) => {
  const [searchValues, setSearchValues] = useState<IReportSearch>({
    minutes: 0,
    startTime: getTime.startDateUnix(),
    endTime: getTime.endDateUnix(),
    ...defaultVals,
  })

  const partsString = parts?.map?.((p) => {
    const key = p?.key
    return key
  })

  const setSearchState = (key: string, val: any) => {
    setSearchValues((preState) => {
      return {
        ...preState,
        [key]: val,
      }
    })
  }

  const onSubmit = () => {
    parts?.map?.((part, index) => {
      const key = part?.key

      if (!part?.required) return

      if (key == "rangeTime") {
        if (!searchValues?.startTime || !searchValues?.endTime) {
          return api.message?.warning(`Chưa chọn ${part?.title}`)
        }
      }

      if ((key == "singleVehicle" || key == "multiVehicle") && part?.required) {
        if (!searchValues?.devices?.length) {
          return api.message?.warning(`Chưa chọn ${part?.title}`)
        }
      }

      if (key == "minutes") {
        if (!searchValues?.minutes && searchValues?.minutes != 0) {
          return api.message?.warning(`Chưa nhập ${part?.title}`)
        }
      }

      if (key == "multiDriver") {
        if (!searchValues?.drivers?.length) {
          return api.message?.warning(`Chưa chọn ${part?.title}`)
        }
      }
    })

    onSubmitSearch?.(searchValues)
  }

  const handleRangeTimeChane = useCallback((dates: any) => {
    if (!dates) return
    const start = getTime?.String2Unit(dayjs(dates[0])?.toISOString())
    const end = getTime?.String2Unit(dayjs(dates[1])?.toISOString())

    setSearchState("startTime", start)
    setSearchState("endTime", end)
  }, [])

  const handleRangeDateChane = useCallback((dates: any) => {
    if (!dates) return
    const start = getTime?.String2Unit(dayjs(dates[0])?.toISOString())
    const end = getTime?.String2Unit(dayjs(dates[1])?.toISOString())

    const formatDayString = "YYYY-MM-DD"

    const startDayString = getTime?.Unix2StringFormatC(start, formatDayString)
    const endDayString = getTime?.Unix2StringFormatC(end, formatDayString)

    const startUnix = getTime?.String2Unit(`${startDayString} 00:00:00`)
    const endUnix = getTime?.String2Unit(`${endDayString} 23:59:59`)

    setSearchState("startTime", startUnix)
    setSearchState("endTime", endUnix)
  }, [])

  const searchParts = (init: IPart): ISeachComItem[] => [
    {
      key: "rangeTime",
      title: init?.title,
      component(defaultVals) {
        return (
          <TimeRangePicker
            props={{
              style: { height: mainSearchHeight, width: 340 },
              onChange: handleRangeTimeChane,
              defaultValue: [
                dayjs(getTime?.Unix2String(searchValues?.startTime || 0)),
                dayjs(getTime?.Unix2String(searchValues?.endTime || 0)),
              ],
            }}
          />
        )
      },
    },
    {
      key: "rangeDate",
      title: init?.title,
      component(defaultVals) {
        return (
          <TimeRangePicker
            props={{
              showTime: false,
              format: "YYYY/MM/DD",
              style: { height: mainSearchHeight, width: 210 },
              onChange: handleRangeDateChane,
              defaultValue: [
                dayjs(getTime?.Unix2String(searchValues?.startTime || 0)),
                dayjs(getTime?.Unix2String(searchValues?.endTime || 0)),
              ],
            }}
          />
        )
      },
    },
    {
      key: "team",
      title: init?.title,
      component(defaultVals) {
        return (
          <CustomerTreeSelect
            props={{
              style: {
                height: mainSearchHeight,
                width: 300,
              },
              showSearch: true,
            }}
            onChangeKey={(selectedKeys) => {
              const keys = _array?.getCustomerListFromIdList(selectedKeys)
              setSearchState("team", keys)
            }}
          />
        )
      },
    },
    {
      key: "singleVehicle",
      title: init?.title,
      component(defaultVals) {
        return (
          <VehiclePicker
            filter={(vehicle) => {
              const teamList = searchValues?.team

              return searchValues?.team?.length
                ? !!teamList?.includes?.(`${vehicle?.customer_id}`)
                : true
            }}
            props={{
              style: {
                height: mainSearchHeight,
                width: 200,
              },
              showSearch: true,
              onChange(value, option) {
                setSearchState("devices", [value])
              },
            }}
          />
        )
      },
    },
    {
      key: "multiVehicle",
      title: init?.title,
      component(defaultVals) {
        return (
          <VehicleTreeSelect
            filter={(vehicle) => {
              const teamList = searchValues?.team

              return teamList?.length
                ? !!teamList?.includes?.(`${vehicle?.customer_id}`)
                : true
            }}
            props={{
              style: {
                width: 300,
                height: mainSearchHeight,
              },
              listHeight: 400,
            }}
            onChangeKey={(keys) => {
              setSearchState("devices", keys)
            }}
          />
        )
      },
    },
    {
      key: "multiDriver",
      title: init?.title,
      component(defaultVals) {
        return (
          <DriverTreeSelect
            // filter={(vehicle) => {
            //   const teamList = searchValues?.team

            //   return teamList?.length
            //     ? !!teamList?.includes?.(`${vehicle?.customer_id}`)
            //     : true
            // }}
            props={{
              style: {
                width: 330,
                height: mainSearchHeight,
              },
              listHeight: 400,
            }}
            onChangeKey={(keys) => {
              setSearchState("drivers", keys)
            }}
          />
        )
      },
    },
    {
      key: "minutes",
      title: init?.title,
      component(defaultVals) {
        return (
          <InputNumber
            type="number"
            value={searchValues?.minutes}
            addonAfter={init?.addonAfter || "Phút"}
            onChange={(val) => {
              setSearchState("minutes", val)
            }}
            className="h-[28px] main-input__root_28"
            style={{
              width: 150,
              height: mainSearchHeight,
            }}
          />
        )
      },
    },
  ]

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {parts?.map?.((part, index) => {
        const partItem = searchParts(part)?.find?.((p) => p?.key == part?.key)
        const isShow = part && partsString?.includes?.(part?.key)

        if (!isShow) return null

        return (
          <div key={index} className="flex items-center gap-2">
            <div>{part?.title}</div>
            <div>{partItem?.component?.(defaultVals)}</div>
          </div>
        )
      })}

      <div>
        <Button
          disabled={isLoading}
          onClick={onSubmit}
          className="h-7"
          type="primary"
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  )
}
