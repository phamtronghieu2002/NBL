import { ReactNode, useContext } from "react"
import { ServerPageContext } from ".."
import { ColumnsType } from "antd/es/table"
import { Button } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { ComponentTitle } from "../../../../conponents/TitleC/ComponentTitle"
import { TableC } from "../../../../conponents/TableC"
import { _const } from "../../../../_constant"
import { ModelModal } from "../../../../conponents/modals/ModelModal"
import { IPackage } from "../../../../_types/devServerType"
import { getString } from "../../../../utils/getString"
import { PackageModal } from "../../../../conponents/modals/PackageModal"

interface IColumns {
  key: number
  stt: number
  name: string
  fees_to_distributor: string
  fees_to_agency: string
  fees_to_customer: string
  one_month_fee_to_distributor: string
  one_month_fee_to_agency: string
  one_month_fee_to_customer: string
  times: string
  data: IPackage
  publish: string
  note: string
  actions: ReactNode
  updateAction: () => void
}

const columns: ColumnsType<IColumns> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    width: 70,
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    width: 150,
  },
  {
    title: "Giá bán NPP",
    dataIndex: "fees_to_distributor",
    key: "fees_to_distributor",
    width: 150,
  },
  {
    title: "Giá bán đại lý",
    dataIndex: "fees_to_agency",
    key: "fees_to_agency",
    width: 150,
  },
  {
    title: "Giá bán khách hàng",
    dataIndex: "fees_to_customer",
    key: "fees_to_customer",
    width: 150,
  },
  {
    title: "Giá DV 1 tháng NPP",
    dataIndex: "one_month_fee_to_distributor",
    key: "one_month_fee_to_distributor",
    width: 150,
  },
  {
    title: "Giá DV 1 tháng đại lý",
    dataIndex: "one_month_fee_to_agency",
    key: "one_month_fee_to_agency",
    width: 180,
  },
  {
    title: "Giá DV 1 tháng khách hàng",
    dataIndex: "one_month_fee_to_customer",
    key: "one_month_fee_to_customer",
    width: 200,
  },

  {
    title: "Thời gian gói DV",
    dataIndex: "times",
    key: "times",
    width: 150,
  },
  {
    title: "Publish",
    dataIndex: "publish",
    key: "publish",
    width: 150,
  },

  {
    title: "Mô tả",
    dataIndex: "note",
    key: "note",
    width: 500,
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
          <PackageModal
            onSccess={() => {
              record?.updateAction?.()
            }}
            button={
              <Button size="small" type="link">
                Sửa
              </Button>
            }
            data={record?.data}
          />
          <PackageModal
            onSccess={() => {
              record?.updateAction?.()
            }}
            type="delete"
            button={
              <Button size="small" type="link">
                Xoá
              </Button>
            }
            data={record?.data}
          />
        </div>
      )
    },
  },
]

export const PackageList = () => {
  const { data, isLoading, reload } = useContext(ServerPageContext)

  const dataSource: IColumns[] =
    data?.packageList?.map?.((lv, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        name: lv?.name,
        fees_to_distributor: getString?.currency?.VND(lv?.fees_to_distributor),
        fees_to_agency: getString?.currency?.VND(lv?.fees_to_agency),
        fees_to_customer: getString?.currency?.VND(lv?.fees_to_customer),
        one_month_fee_to_distributor: getString?.currency?.VND(
          lv?.one_month_fee_to_distributor,
        ),
        one_month_fee_to_agency: getString?.currency?.VND(
          lv?.one_month_fee_to_agency,
        ),
        one_month_fee_to_customer: getString?.currency?.VND(
          lv?.one_month_fee_to_customer,
        ),
        times: `${lv?.times} tháng`,
        publish: lv?.publish
          ? _const?.string?.s?.pushlish
          : _const?.string?.s?.hidden,
        note: lv?.note,
        actions: "-",
        data: lv,
        updateAction: () => {
          reload?.()
        },
      }
    }) || []

  return (
    <div className="h-full">
      <div className="h-full">
        <TableC
          title="Danh sách"
          onReload={reload}
          scroll={{
            useScroll: true,
          }}
          search={{
            key: ["name"],
          }}
          right={
            <PackageModal
              onSccess={() => {
                reload?.()
              }}
              type="add"
              button={
                <Button type="default" size="small" icon={<PlusOutlined />}>
                  Thêm
                </Button>
              }
            />
          }
          props={{
            loading: isLoading,
            columns: columns,
            dataSource: dataSource,
            size: "middle",
          }}
        />
      </div>
    </div>
  )
}
