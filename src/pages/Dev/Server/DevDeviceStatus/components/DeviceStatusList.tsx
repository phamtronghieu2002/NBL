import { useContext } from "react"
import { ServerPageContext } from ".."
import { ColumnsType } from "antd/es/table"
import { ComponentTitle } from "../../../../../conponents/TitleC/ComponentTitle"
import { TableC } from "../../../../../conponents/TableC"
import {
  IConnectionType,
  IDeviceStatusType,
} from "../../../../../_types/devServerType"
import { ConnectionTypeModal } from "../../../../../conponents/modals/ConnectionTypeModal"
import { Button } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { DeviceStatusModal } from "../../../../../conponents/modals/DeviceStatusModal"

interface IColumns {
  key: number
  stt: number
  title: string
  publish: string
  des: string
  data: IDeviceStatusType
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
    title: "Tên trạng thái",
    dataIndex: "title",
    key: "title",
    width: 150,
  },
  {
    title: "Trạng thái",
    dataIndex: "publish",
    key: "publish",
    width: 150,
  },
  {
    title: "Ghi chú",
    dataIndex: "des",
    key: "des",
  },
  {
    title: "Thao tác",
    dataIndex: "actions",
    key: "actions",
    width: 200,
    render(value, record, index) {
      return (
        <div className="flex items-center">
          <DeviceStatusModal
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
          <DeviceStatusModal
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

export const DeviceStatusList = () => {
  const { data, isLoading, reload } = useContext(ServerPageContext)

  const dataSource: IColumns[] =
    data?.deviceStatus?.map?.((connection, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        title: connection?.title,
        publish: connection?.publish ? "publish" : "hidden",
        data: connection,
        des: connection?.des,
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
          right={
            <DeviceStatusModal
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
