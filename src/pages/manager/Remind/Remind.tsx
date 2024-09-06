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
import { api } from "../../../_helper"
import axios from "axios"

interface RemindProps {}

const Remind: FC<RemindProps> = () => {
  const [viahicles, setViahicles] = useState<ViahicleType[]>([])
  const [tab, setTab] = useState<string>("1")
  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  const fetchViahicle = async () => {
    // alert('co fe')
    if (tab === "1") {
      // dispatch.setViahicle([])
      dispatch.setTypeViahicle(true)
      try {
        setViahicles([
          {
            id: 1,
            license_plate: "A123",
            license: "90283928932",
            is_deleted: false,
            user_id: 1,
            reminds: ["icon1", "icon2", "icon3"],
          },
          {
            id: 2,

            license_plate: "A928",
            license: "2323I2",
            is_deleted: false,
            user_id: 1,
            reminds: ["icon"],
          },
        ])
      } catch (error) {
        console.log("====================================")
        console.log("error  >>", error)
        console.log("====================================")
      }
    }
    if (tab === "0") {
      // dispatch.setViahicle([])

      try {
        dispatch.setTypeViahicle(false)
        const res = await getViahicle()

        setViahicles(
          res?.data.map((item: ViahicleType) => ({
            ...item,
            key: item.id,
          })),
        )
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
  }

  return (
    <div className="relative">
      <div className="mb-10 font-bold text-lg">Quản lí phương tiện</div>
      <div className="action_create_remind flex justify-end absolute left-[450px] top-[80px] z-50 ">
        <ModalCreateRemind
          button={
            <Button type="primary" icon={<PlusCircleOutlined />}>
              Thêm
            </Button>
          }
        />
      </div>
      <Tabs
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
