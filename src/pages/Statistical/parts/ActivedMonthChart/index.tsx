import { memo, useEffect, useState } from "react"
import {
  getActivedRangeTimeService,
  getIntegratedStatisticsService,
} from "../../../../services/manage_statisticsServices"
import { IIntegratedStatistics } from "../../../../_types/userType"
import ReactApexChart from "react-apexcharts"
import getTime from "../../../../utils/getTime"
import { CircleButton } from "../../../../conponents/ButtonC"
import { AiOutlineSync } from "react-icons/ai"
import { MaskLoader } from "../../../../conponents/Loader"
import { min } from "moment"

const _24hUnix = 24 * 60 * 60

interface IProps {
  userId: number
}

interface IDataChartReport {
  date: string
  total: number
}

export const ActivedMonthChart: React.FC<IProps> = memo(({ userId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<IDataChartReport[]>()

  const getData = () => {
    setIsLoading(true)
    setData([])
    const getActivedRangeTimePromise = getActivedRangeTimeService({
      userId,
      startTime: (getTime?.currUnix() - 366 * 24 * 60 * 60) * 1000,
      endTime: getTime?.currUnix() * 1000,
    })

    Promise.all([getActivedRangeTimePromise])
      .then(([activedRangeTimeFb]) => {
        const data = activedRangeTimeFb?.data

        if (!data?.length) setData([])

        const dataObj: { [key: string]: IDataChartReport } = {}

        data?.forEach?.((d: IDataChartReport) => {
          dataObj[d?.date] = d
        })

        const dataSetMonthObj: { [key: string]: IDataChartReport } = {}

        data?.forEach?.((d: IDataChartReport) => {
          const month = getTime?.StringFormatMY(d?.date)

          dataSetMonthObj[month] = dataSetMonthObj?.[month] || {
            date: month,
            total: 0,
          }

          dataSetMonthObj[month].total += d?.total
        })

        const dataSetMonth = Object.values(dataSetMonthObj)

        setData(dataSetMonth)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    getData()
  }, [userId])

  const chartData = data?.map?.((d) => d?.total)
  const chartCategory = data?.map?.((d) => d?.date)

  const state: any = {
    series: [
      {
        name: "Thiết bị",
        data: chartData,
      },
    ],
    options: {
      chart: {
        type: "line",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      title: {
        text: "",
        align: "left",
      },
      grid: {
        row: {
          colors: ["transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },

      xaxis: {
        categories: chartCategory,
        tickAmount: 5,
        labels: {
          rotate: 0,
          style: {
            colors: [],
            fontSize: "11px",
            fontWeight: 300,
          },
        },
      },
      yaxis: {
        min: 0,
        tickAmount: 5,
      },
    },
  }

  return (
    <div className="bg-white py-4 relative">
      <div id="chart">
        <div className="px-4">THIẾT BỊ KÍCH HOẠT THEO THÁNG</div>

        <ReactApexChart
          options={state.options}
          series={state.series}
          type="line"
          height={300}
        />
      </div>
      <div id="html-dist"></div>
      <div className="absolute top-0 right-0">
        <CircleButton
          onClick={getData}
          size={30}
          icon={<AiOutlineSync />}
        ></CircleButton>
      </div>
      {isLoading ? <MaskLoader /> : null}
    </div>
  )
})
