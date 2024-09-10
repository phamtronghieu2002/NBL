import { FC, useEffect } from "react"
import { Tabs } from "antd"
import getTabItem from "../items/TabItem"
import { useState } from "react"
import { ViahicleType } from "../../../interface/interface"
import { Button } from "antd"
import { PlusCircleOutlined } from "@ant-design/icons"
import ViahicleProvider from "./providers/ViahicleProvider"
import { useContext } from "react"
import {
  viahiclesContext,
  ViahicleProviderContextProps,
} from "./providers/ViahicleProvider"
import ModalCreateRemind from "../../../conponents/modals/ModalCreateRemind"
import { getViahicle } from "../../../apis/viahicleAPI"
import axios from "axios"
import { getData } from "../../../utils/handleDataViahicle"
import { getRemindVehicleGPS } from "../../../apis/remindAPI"

interface RemindProps {}

const Remind: FC<RemindProps> = () => {
  const [viahicles, setViahicles] = useState<ViahicleType[]>([])
  const [viahiclesNoGPS, setViahiclesNoGPS] = useState<ViahicleType[]>([])

  const [tab, setTab] = useState<string>("1")

  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  const fetchViahicle = async (keyword: string = "") => {
    // alert('co fe')
    setViahicles([])
    dispatch?.setLoading?.(true)
    if (tab === "1") {
      try {
        const res = await axios.get(
          `https://sys01.midvietnam.net/api/v1/device/rows?keyword=${keyword}&offset=0&limit=50&type=1`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY0NSwicGFyZW50SWQiOjc4MywiY2xpZW50SWQiOiIxNDI5MTAxYi0xNWQ4LTQzYzktYmM5Ni1mMWQ4ZjVkN2RkYzYiLCJyb2xlIjo1MCwibGV2ZWwiOjAsImN1c3RvbWVySWQiOjQzMSwiaWF0IjoxNzI1ODY3MTk5LCJleHAiOjE3Mjg0NTkxOTl9.uWLymilDQvzr4T23Hjs6sfoz9o32xaLPurVp6InG-4Y`,
            },
          },
        )
   
        const viahicleGPS = res?.data?.data?.map((item: any) => {
          return {
            key: item.id,
            id: item.id,
            license: item.imei,
            license_plate: item.dev_id,
            user_name: item.customer_name,
          }
        })

        for (let i = 0; i < viahicleGPS.length; i++) {
          const reminds: any = await getRemindVehicleGPS(
            viahicleGPS[i].license_plate,
          )
          const icons: any = []
          reminds?.data?.forEach((item: any) => {
            item?.icon && icons.push(item.icon)
          })
          viahicleGPS[i]["icons"] = icons
        }

        dispatch?.setLoading?.(false)
        setViahicles(viahicleGPS)
      } catch (error) {
        console.log("error  >>", error)
      }
    } else {
      try {
        const res = await getViahicle(keyword)
        const data = getData(res?.data)
        setViahiclesNoGPS(data)
        dispatch?.setLoading?.(false)
      } catch (error) {
        console.log("error", error)
      }
    }
  }
  useEffect(() => {
    const keyword = viahiclesStore.keyword
    fetchViahicle(keyword)
  }, [tab, viahiclesStore.freshKey, viahiclesStore.keyword])

  useEffect(() => {
    dispatch?.setViahicle([])
  }, [tab])

  const onChangeTab = (key: string) => {
    setTab(key)
    dispatch?.setTypeViahicle(key === "1" ? 1 : 0)
  }

  return (
    <div className="relative">
      <div className="mb-10 font-bold text-lg">Quản lí phương tiện</div>
      <div className="action_create_remind flex justify-end absolute left-[450px] top-[80px] z-50 ">
        <ModalCreateRemind
          // remindData={[
          //   {
          //     current_kilometers: 10,
          //     remind_category_id: 1,
          //     cumulative_kilometers: 20,
          //   },
          // ]}
          button={
            <Button type="primary" icon={<PlusCircleOutlined />}>
              Thêm
            </Button>
          }
        />
      </div>
      <Tabs
        defaultActiveKey="1"
        items={getTabItem(viahicles, viahiclesNoGPS)}
        onChange={onChangeTab}
      />
    </div>
  )
}
const RemindMeMo: FC = () => (
  <ViahicleProvider>
    <Remind />
  </ViahicleProvider>
)
export default RemindMeMo
