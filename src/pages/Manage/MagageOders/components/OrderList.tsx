import { ReactNode, useContext, useEffect, useState } from "react"
import { ServerPageContext } from ".."
import { ColumnsType } from "antd/es/table"
import { Button, Popover } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { ComponentTitle } from "../../../../conponents/TitleC/ComponentTitle"
import { TableC } from "../../../../conponents/TableC"
import { _const } from "../../../../_constant"
import { IDeviceInfo } from "../../../../_types/deviceType"
import getTime from "../../../../utils/getTime"
import { orderPageAction } from "../_actions"
import { store } from "../../../../app/store"
import { CreateOrdersModal } from "../../../../conponents/modals/OrdersModal"
import { OrdersInvoiceModal } from "../../../../conponents/modals/OrdersInvoiceModal"
import { IOrderInfo } from "../../../../_types/ordersType"
import { Coppy } from "../../../../conponents/Coppy"
import { GiCheckboxTree } from "react-icons/gi"
import { PiTreeStructure } from "react-icons/pi"
import { CreateOrdersTreeModal } from "../../../../conponents/modals/OrdersCreateTreeModal"
import { TextEllipsis } from "../../../../conponents/TextC"

interface IColumns {
  key: number
  stt: number
  code: string
  creator_customer: string
  ceator_user: string
  reciver: string
  quantity: number
  note: string
  created_at: string
  data: IOrderInfo
  updateAction: () => void
}

const columns: ColumnsType<IColumns> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    width: 70,
    className: "text-center",
    fixed: "left",
  },
  {
    title: "Mã đơn hàng",
    dataIndex: "code",
    key: "code",
    width: 200,
    render(value, record, index) {
      return (
        <div className="text-theme italic">
          <Coppy>{value}</Coppy>
        </div>
      )
    },
  },
  {
    title: "Khách hàng tạo",
    dataIndex: "creator_customer",
    key: "creator_customer",
    width: 200,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
  {
    title: "Tài khoản tạo",
    dataIndex: "ceator_user",
    key: "ceator_user",
    width: 150,
  },

  {
    title: "Khách hàng nhận",
    dataIndex: "reciver",
    key: "reciver",
    width: 200,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
  {
    title: "Số lượng thiết bị",
    dataIndex: "quantity",
    key: "quantity",
    width: 150,
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    key: "created_at",
    width: 150,
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    key: "note",
    width: 250,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },

  {
    title: "Thao tác",
    dataIndex: "actions",
    key: "actions",
    width: 120,
    fixed: "right",
    render(value, record, index) {
      return (
        <div className="flex items-center">
          <OrdersInvoiceModal
            onSccess={() => {
              record?.updateAction?.()
            }}
            button={
              <Button size="small" type="link">
                Chi tiết
              </Button>
            }
            orderId={record?.data?.id}
          />
        </div>
      )
    },
  },
]

export const OrderList = () => {
  const { state, dispatch } = useContext(ServerPageContext)

  const reload = () => dispatch?.(orderPageAction?.reloadOrderData())
  const params = state?.orders?.param

  const [dataSource, setDataSource] = useState<IColumns[]>()

  useEffect(() => {
    const dataSource_: IColumns[] =
      state?.orders?.list?.map?.((lv, index) => ({
        key: index + 1,
        stt: index + 1 + params?.limit * params?.offset,
        code: lv?.code,
        creator_customer: lv?.creator_customer,
        ceator_user: lv?.creator_user,
        reciver: lv?.reciver,
        quantity: lv?.quantity,
        note: lv?.note,
        created_at: getTime?.Unix2StringFormat(lv?.created_at / 1000),
        updateAction: () => {
          reload?.()
        },
        data: lv,
        actions: "-",
      })) || []

    setDataSource(dataSource_)
  }, [state?.orders?.list])

  if (!dataSource) return null

  const user = store?.getState()?.user?.child?.object?.[state?.userId]

  return (
    <div className="h-full">
      <div className="h-full">
        <TableC
          title={`Danh sách đơn hàng ${user?.customer_name}`}
          onReload={reload}
          scroll={{
            useScroll: true,
          }}
          search={{
            width: 200,
            onSearch(q) {
              dispatch?.(orderPageAction?.setOrderQSearch?.(q))
            },
            limitSearchLegth: 2,
          }}
          right={
            <>
              <CreateOrdersModal
                onSccess={() => {
                  reload?.()
                }}
                button={
                  <Button type="default" size="small" icon={<PlusOutlined />}>
                    Tạo mới
                  </Button>
                }
              />
              <CreateOrdersTreeModal
                onSccess={() => {
                  reload?.()
                }}
                button={
                  <Button
                    type="default"
                    size="small"
                    icon={<PiTreeStructure size={15} />}
                  >
                    Tạo cây
                  </Button>
                }
              />
            </>
          }
          props={{
            loading: state?.orders?.isLoading,
            columns: columns,
            dataSource: dataSource,
            size: "middle",
            pagination: {
              pageSize: state?.orders?.param?.limit,
              total: state?.orders?.totalPage * state?.orders?.param?.limit,
              current: state?.orders?.param?.offset + 1,
              onChange(page, pageSize) {
                dispatch?.(orderPageAction?.setOrderOffset(page - 1))
                dispatch?.(orderPageAction?.setOrderLimit(pageSize))
              },
            },
          }}
        />
      </div>
    </div>
  )
}
