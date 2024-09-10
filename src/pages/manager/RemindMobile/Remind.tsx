import { FC, useEffect } from "react"
import { Tabs } from "antd"
import getTabItem from "../items/TabItemMobile"
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
import ModalCreateRemindMobile from "../../../conponents/modals/ModalCreateRemindMobile"
import { getViahicle } from "../../../apis/viahicleAPI"

import { getData } from "../../../utils/handleDataViahicle"
import "./customeTab.scss"
import axios from "axios"
import { getRemindVehicleGPS } from "../../../apis/remindAPI"
interface RemindProps {}

const Remind: FC<RemindProps> = () => {
  const [viahicles, setViahicles] = useState<ViahicleType[]>([])
  const [tab, setTab] = useState<string>("1")
  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  console.log("viahicle mới nhât >>", viahiclesStore)

  const fetchViahicle = async () => {
    // alert('co fe')
    if (tab === "1") {
      dispatch?.setLoading?.(true)
      try {
        const res = await axios.get(
          `https://sys01.midvietnam.net/api/v1/device/rows?keyword=${viahiclesStore.keyword}&offset=0&limit=50&type=1`,
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
          }
        })

        for (let i = 0; i < viahicleGPS.length; i++) {
          const res = await getRemindVehicleGPS(viahicleGPS[i].license_plate)
        }
        setViahicles(viahicleGPS)
        dispatch?.setLoading?.(false)
      } catch (error) {}
    } else {
      // dispatch.setKeyword("123")
      try {
        const res = await getViahicle(viahiclesStore?.keyword || "")
        const data = getData(res?.data)
        setViahicles(data)
        dispatch?.setLoading?.(false)
      } catch (error) {
        console.log("====================================")
        console.log("error", error)
        console.log("====================================")
      }
    }
  }
  useEffect(() => {
    fetchViahicle()
  }, [tab, viahiclesStore.freshKey, viahiclesStore.keyword])

  const onChangeTab = (key: string) => {
    setTab(key)
    dispatch.setTypeViahicle(key === "1" ? 1 : 0)
  }

  return (
    <div className="relative remind_mobile">
      <div className="action_create_remind "></div>
      <Tabs
        type="card"
        defaultActiveKey="1"
        items={getTabItem(viahicles)}
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
