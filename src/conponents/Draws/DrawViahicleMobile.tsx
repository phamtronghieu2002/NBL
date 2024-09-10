import { FC, memo, useEffect, useState } from "react"
import React from "react"
import {
  Button,
  Form,
  Switch,
  Select,
  Checkbox,
  Popconfirm,
  message,
} from "antd"
import DrawC from "../DrawC/DrawC"
import { Tabs } from "antd"
import type { TabsProps } from "antd"
import { TableCM } from "../TableCM/TableCM"
import { TableColumnsType } from "antd"
import ModalCreateRemind from "../modals/ModalCreateRemindMobile"
import { PopconfirmProps } from "antd/lib"
import ModalCreateTire from "../modals/ModalCreateTire"
import { use } from "i18next"
import { TireProps, ViahicleType } from "../../interface/interface"
import { getTire } from "../../apis/tireAPI"
import { api } from "../../_helper"
import {
  getRemindAll,
  getRemindByLisencePlate,
  getRemindSearch,
  TurnOffRemind,
  TurnOnRemind,
} from "../../apis/remindAPI"
import { getViahicle } from "../../apis/viahicleAPI"

export interface RemindProps {
  id?: number
  vehicle_id?: number
  license_plate?: string
  user_id?: number
  license?: string
  vehicle_create_time?: number
  vehicle_update_time?: number | null
  remind_id?: number
  remind_img_url?: string | null
  note_repair?: string
  history_repair?: string | null
  current_kilometers?: number
  cumulative_kilometers?: number
  expiration_time?: number
  time_before?: number
  is_notified: number
  is_received: number
  remind_create_time?: number
  remind_update_time?: number | null
  category_id?: number
  category_name: string
  category_desc?: string | null
  category_icon?: string | null
  category_create_time?: number
  category_update_time?: number
  category_is_deleted?: number
}

interface filterProps {
  select: string
  keyword: string
}
interface DrawViahicleProps {
  button: React.ReactNode
  title: string
  data: any
}

interface DetailViahicleComponentsProps {
  closeModal: any
  data: any
}



const TabTableRemind = memo(({ data, isReload }: any) => {
  const viahicleInfor = data

  const [reminds, setReminds] = useState<RemindProps[]>([])
  const [remindsFilter, setRemindsFilter] = useState<RemindProps[]>([])
  const [filter, setFilter] = useState<filterProps>({
    select: "all",
    keyword: "",
  })

  const [loadingButton, setLoadingButton] = useState<number>(0)
  const [isShowModal, setIsShowModal] = useState(false)

  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    setIsShowModal(true)
  }

  const handleCancel = (e: any, remind: any) => {
    // call api cancel next
    alert("call api kì tiếp")
    fetchRemind()
    cancel?.(e)
  }

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    setIsShowModal(false)
  }
  const onSearch = (q: string) => {
    setFilter({ ...filter, keyword: q })
  }

  const fetchRemind = async (keyword: string = "") => {
    // alert("re render remind")
    // call api get remind by viahicle id or license plate
    try {
      let res: any = []
      if (keyword) {
        res = await getViahicle(keyword)
      } else {
        res = await getRemindSearch(keyword, data?.license_plate)
      }

      setReminds(res?.data)
      setRemindsFilter(res?.data)
    } catch (error) {
      api.message?.error("Lỗi khi lấy dữ liệu nhắc nhở !!")
    }
  }

  useEffect(() => {
    const selectType = filter.select
    const keyword = filter.keyword
    fetchRemind(keyword)
    // switch (selectType) {
    //   case "all":
    //     if (filter.keyword) {
    //       //
    //       setRemindsFilter(
    //         reminds.filter((item) => item.name.includes(filter.keyword)),
    //       )
    //       return
    //     }
    //     break
    //   case "finish":
    //     if (filter.keyword) {
    //       setRemindsFilter(
    //         reminds
    //           .filter((item) => item.name.includes(filter.keyword))
    //           .filter((item) => item.isFinish),
    //       )
    //       return
    //     }
    //     setRemindsFilter(reminds.filter((item) => item.isFinish))
    //     break
    //   case "noFinish":
    //     if (filter.keyword) {
    //       setRemindsFilter(
    //         reminds
    //           .filter((item) => item.name.includes(filter.keyword))
    //           .filter((item) => !item.isFinish),
    //       )
    //       return
    //     }
    //     setRemindsFilter(reminds.filter((item) => !item.isFinish))
    //     break
    //   default:
    //     break
    // }
  }, [filter.keyword, filter.select, isReload])
  //   column

  const handleOnOf = async (checked: boolean, data: RemindProps) => {
    //  call api bật tắt thông báo
    const remindId = data?.remind_id
    const notifyTilte = checked
      ? "bật thông báo thành công"
      : "tắt thông báo thành công"
    try {
      setLoadingButton(remindId || 0)
      if (checked) {
        await TurnOnRemind(remindId || 0)
      } else {
        await TurnOffRemind(remindId || 0)
      }
      api.message?.success(notifyTilte)
      setLoadingButton(0)
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <>
      <p className="absolute top-[-120px]">
        {" "}
        Phương tiện : <b className="text-xl"> {data?.license_plate}</b>
      </p>

      <TableCM
        title="Danh sách nhắc nhở"
        hiddenTitle
        onReload={() => {
          fetchRemind()
        }}
        search={{
          width: 200,
          onSearch(q) {
            onSearch(q)
          },
          limitSearchLegth: 3,
        }}
        right={
          <div className="ml-5 flex items-center">
            <Select
              className="h-[25px]"
              defaultValue="all"
              style={{ width: 120 }}
              onChange={(value) => {
                setFilter({ ...filter, select: value })
              }}
              options={[
                { value: "all", label: "Tất cả" },
                { value: "off", label: "Bật" },
                { value: "on", label: "Tắt" },
              ]}
            />
          </div>
        }
        props={{
         
        }}
      />
    </>
  )
})

export const TabTableTire: FC<{
  isAddTireButton?: boolean
  data: ViahicleType | TireProps
  isReload?: number
  onReFresh?: () => void
}> = ({ data, isReload, isAddTireButton }) => {

  const [tires, setTires] = useState<TireProps[]>([])
  const [keyword, setKeyword] = useState<string>("")
  console.log("keyword", keyword)

  const fetchTire = async (keyword: string = "") => {
    try {
      const res = await getTire(data?.license_plate || "", keyword)
      setTires(res?.data)
    } catch (error) {}
  }
  useEffect(() => {
    fetchTire(keyword)
  }, [isReload, keyword])

  return (
    <div>
      <TableCM
        hiddenTitle
        title="123"
        search={{
          width: 200,
          onSearch(q) {
            setKeyword(q)
          },
          limitSearchLegth: 3,
        }}
        onReload={() => {
          fetchTire()
        }}
        right={
          <div className="ml-5 flex items-center">
            {isAddTireButton && (
              <ModalCreateTire
                onRefresh={() => {
                  fetchTire()
                }}
                button={<Button type="primary">Thêm lốp</Button>}
                type="add"
              />
            )}
          </div>
        }
        props={{
         
        }}
      />
    </div>
  )
}
const DetailViahicleComponents: FC<DetailViahicleComponentsProps> = ({
  closeModal,
  data,
}: any) => {
  useEffect(() => {
    // alert('xin chao')
  }, [])
  const viahicleInfor = data

  const [isReload, setIsReload] = useState<number>(0)

  const onReload = () => {
    setIsReload(Math.random())
  }
  const items = (reload: () => void): TabsProps["items"] => [

    {
      key: "2",
      label: "Nhắc nhở của xe",
      children: <TabTableRemind isReload={isReload} data={viahicleInfor} />,
    },
    {
      key: "3",
      label: "Lốp của xe",
      children: <TabTableTire data={viahicleInfor} />,
    },
  ]

  return (
    <div className="relative">
      <div className="absolute z-50 left-[350px] top-[11px]">
        <ModalCreateRemind
          onReload={onReload}
          button={<Button type="primary">Thêm</Button>}
        />
      </div>
      <div className="mt-10">
        <Tabs items={items(onReload)} />
        {/* <Button onClick={closeModal}>Đóng</Button> */}
      </div>
    </div>
  )
}

const DrawViahicle: FC<DrawViahicleProps> = ({ button, title, data }) => {
  return (
    <DrawC
    width={"100%"}
      title={title}
      button={button}
      data={data}
      children={(action) => <DetailViahicleComponents {...action} />}
    />
  )
}

export default DrawViahicle
