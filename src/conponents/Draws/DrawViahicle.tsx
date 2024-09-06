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
import DrawC from "../DrawC/Draw"
import { Tabs } from "antd"
import type { TabsProps } from "antd"
import { TableC } from "../TableC"
import { TableColumnsType } from "antd"
import ModalCreateRemind from "../modals/ModalCreateRemind"
import { PopconfirmProps } from "antd/lib"
import ModalCreateTire from "../modals/ModalCreateTire"
import { use } from "i18next"
import { TireProps, ViahicleType } from "../../interface/interface"
import { getTire } from "../../apis/tireAPI"
import { api } from "../../_helper"
import { getRemindByLisencePlate } from "../../apis/remindAPI"

export interface RemindProps {
  id: number
  name: string
  licenseNumber: string
  typeRemindL: string
  KM?: number | string
  date?: number | string
  statusRemind: string
  dayFinish?: string
  isOn: boolean
  isFinish: boolean
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

const TabInforMation = memo(({ data }: any) => {
  return (
    <div className="mb-56">
      <p>
        Biển số xe : <span className="text-lg"> {data?.license_plate}</span>
      </p>
      {/* <p className="absolute top-[-115px]">
        Nhắc nhở của phương tiện :{" "}
        <b className="text-xl">{data?.licenseNumber}</b>
      </p> */}
      <p>
        giấy phép xe : <span className="text-lg"> {data?.license}</span>
      </p>
    </div>
  )
})

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

  const fetchRemind = async () => {
    // alert("re render remind")
    // call api get remind by viahicle id or license plate
    try {
      const res = await getRemindByLisencePlate(data?.license_plate || "")
      console.log("====================================")
      console.log("du lieu  nhac nho ", res)
      console.log("====================================")
      setReminds([
        {
          id: 1,
          name: "Nhớ đăng kiểm",
          licenseNumber: "123",
          typeRemindL: "Đăng kiếm",
          date: 1725345486,
          KM: "---",
          statusRemind: "Đã nhắc nhở",
          dayFinish: "2021-10-10",
          isOn: true,
          isFinish: true,
        },
        {
          id: 2,
          name: "Nhớ thay nhớt",
          licenseNumber: "123",
          typeRemindL: "Nhớt",
          KM: 1000,
          date: "---",
          statusRemind: "Chưa nhắc nhở",
          dayFinish: "2021-10-10",
          isOn: false,
          isFinish: false,
        },
      ])
      setRemindsFilter([
        {
          id: 1,
          name: "Nhớ đăng kiểm",
          licenseNumber: "123",
          typeRemindL: "Đăng kiếm",
          date: 1725345486,
          KM: "---",
          statusRemind: "Đã nhắc nhở",
          dayFinish: "2021-10-10",

          isOn: true,
          isFinish: true,
        },
        {
          id: 2,
          name: "Nhớ thay nhớt",
          licenseNumber: "123",
          typeRemindL: "Nhớt",
          KM: 1000,
          date: "---",
          statusRemind: "Chưa nhắc nhở",
          dayFinish: "2021-10-10",
          isOn: false,
          isFinish: false,
        },
      ])
    } catch (error) {
      api.message?.error("Lỗi khi lấy dữ liệu nhắc nhở !!")
    }
  }

  useEffect(() => {
    fetchRemind()
    const selectType = filter.select

    switch (selectType) {
      case "all":
        if (filter.keyword) {
          //
          setRemindsFilter(
            reminds.filter((item) => item.name.includes(filter.keyword)),
          )
          return
        }
        break
      case "finish":
        if (filter.keyword) {
          setRemindsFilter(
            reminds
              .filter((item) => item.name.includes(filter.keyword))
              .filter((item) => item.isFinish),
          )
          return
        }
        setRemindsFilter(reminds.filter((item) => item.isFinish))
        break
      case "noFinish":
        if (filter.keyword) {
          setRemindsFilter(
            reminds
              .filter((item) => item.name.includes(filter.keyword))
              .filter((item) => !item.isFinish),
          )
          return
        }
        setRemindsFilter(reminds.filter((item) => !item.isFinish))
        break
      default:
        break
    }
  }, [filter.keyword, filter.select, isReload])
  //   column

  const handleOnOf = async (checked: boolean, data: RemindProps) => {
    //  call api bật tắt thông báo
    setLoadingButton(data?.id)
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 2000)
    })
    setLoadingButton(0)
  }

  const columns: TableColumnsType<RemindProps> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên nhắc nhở",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Dịch vụ",
      dataIndex: "typeRemindL",
      key: "typeRemindL",
      sorter: (a, b) => a.typeRemindL.length - b.typeRemindL.length,
    },
    {
      title: "Km",
      dataIndex: "KM",
      key: "KM",
    },
    {
      title: "Thời hạn",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusRemind",
      key: "statusRemind",
    },

    {
      title: "Bật/tắt",
      dataIndex: "isOn",
      key: "isOn",
      render: (text, record, index) => (
        <Switch
          loading={record?.id === loadingButton}
          defaultChecked={record.isOn}
          onChange={(e) => {
            handleOnOf(e, record)
          }}
        />
      ),
    },
    {
      title: "Ngày hoàn thành",
      dataIndex: "dayFinish",
      key: "dayFinish",
    },
    {
      title: "Hoàn thành",
      dataIndex: "isFinish",
      key: "isFinish",
      render: (text, record, index) => (
        <Popconfirm
          title="Xác nhận hoàn thành nhắc nhở"
          description="Bạn có muốn cập nhật thông tin cho chu kì tiếp theo không?"
          onConfirm={confirm}
          onCancel={(e) => handleCancel(e, record)}
          okText={
            <ModalCreateRemind
              type="update"
              onReload={fetchRemind}
              remindData={record}
              button={<span>OK</span>}
            />
          }
          cancelText="No"
        >
          <Button>Hoàn thành</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <>
      <p className="absolute top-[-120px]">
        {" "}
        Phương tiện : <b className="text-xl"> {data?.license_plate}</b>
      </p>

      <TableC
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
                { value: "finish", label: "Đã thực hiện" },
                { value: "noFinish", label: "Chưa thực hiện" },
              ]}
            />
          </div>
        }
        props={{
          columns: columns,
          dataSource: remindsFilter,
          size: "middle",
          pagination: {},
        }}
      />
    </>
  )
})

export const TabTableTire: FC<{
  data: ViahicleType | TireProps
  isReload?: number
}> = ({ data, isReload }) => {
  const columns: TableColumnsType<TireProps> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Số seri",
      dataIndex: "seri",
      key: "seri",
    },
    {
      title: "Nhãn hiệu",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
    },

    {
      title: "Thao tác",
      dataIndex: "isOn",
      key: "isOn",
      render: (text, record, index) => (
        <div className="flex justify-start">
          <ModalCreateTire
            onRefresh={() => {
              fetchTire()
            }}
            button={<Button type="link">Cập nhật</Button>}
            type="update"
            data={record}
          />
          <ModalCreateTire
            onRefresh={() => {
              fetchTire()
            }}
            button={<Button type="link">Xóa</Button>}
            type="delete"
            data={record}
          />
        </div>
      ),
    },
  ]
  const [tires, setTires] = useState<TireProps[]>([])

  const fetchTire = async () => {
    try {
      const res = await getTire(data?.license_plate || "")
      setTires(res?.data)
    } catch (error) {}
  }
  useEffect(() => {
    fetchTire()
  }, [isReload])

  return (
    <div>
      <TableC
        hiddenTitle
        title="123"
        search={{
          width: 200,
          onSearch(q) {
            console.log(q)
          },
          limitSearchLegth: 3,
        }}
        onReload={() => {
          fetchTire()
        }}
        right={
          <div className="ml-5 flex items-center">
            <ModalCreateTire
              onRefresh={() => {
                fetchTire()
              }}
              button={<Button type="primary">Thêm lốp</Button>}
              type="add"
            />
          </div>
        }
        props={{
          columns: columns,
          dataSource: tires,
          size: "middle",
          pagination: {},
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
    // {
    //   key: "1",
    //   label: "Thông tin xe",
    //   children: <TabInforMation data={viahicleInfor} />,
    // },
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
      title={title}
      button={button}
      data={data}
      children={(action) => <DetailViahicleComponents {...action} />}
    />
  )
}

export default DrawViahicle
