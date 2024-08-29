import { useContext } from "react"
import { ServerPageContext } from ".."
import { ColumnsType } from "antd/es/table"
import { ComponentTitle } from "../../../../../conponents/TitleC/ComponentTitle"
import { TableC } from "../../../../../conponents/TableC"
import { Button } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { IVehicleIconType } from "../../../../../_types/devServerType"
import { VehicleIconModal } from "../../../../../conponents/modals/VehicleIconModal"

interface IColumns {
  key: number
  stt: number
  name: string
  note: string
  publish: string
  data: IVehicleIconType
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
    title: "Mã icon",
    dataIndex: "name",
    key: "name",
    width: 150,
  },

  {
    title: "Trạng thái",
    dataIndex: "publish",
    key: "publish",
    width: 150,
  },

  {
    title: "Mô tả",
    dataIndex: "note",
    key: "note",
  },

  {
    title: "Thao tác",
    dataIndex: "actions",
    key: "actions",
    width: 200,
    render(value, record, index) {
      return (
        <div className="flex items-center">
          <VehicleIconModal
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
          <VehicleIconModal
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

export const VehicleIconList: React.FC = () => {
  const { data, isLoading, reload } = useContext(ServerPageContext)

  const dataSource: IColumns[] =
    data?.vehicleIcon?.map?.((lv, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        name: lv?.name,
        note: lv?.note,
        publish: lv?.publish ? "publish" : "hidden",
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
          right={
            <VehicleIconModal
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
