import { useContext } from "react"
import { ServerPageContext } from ".."
import { ColumnsType } from "antd/es/table"
import { ComponentTitle } from "../../../../../conponents/TitleC/ComponentTitle"
import { TableC } from "../../../../../conponents/TableC"
import { Button } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { LevelModal } from "../../../../../conponents/modals/LevelModal"
import { ModelTypeModal } from "../../../../../conponents/modals/ModelTypeModal"
import { IPermission } from "../../../../../_types/devServerType"
import { PermissionModal } from "../../../../../conponents/modals/PermissionModal"

interface IColumns {
  key: number
  stt: number
  name: string
  publish: string
  data: IPermission
  method: string
  router: string
  group_: string
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
    title: "Tên quyền",
    dataIndex: "name",
    key: "name",
    width: 150,
  },
  {
    title: "Nhóm",
    dataIndex: "group_",
    key: "group_",
    width: 150,
  },
  {
    title: "Trạng thái",
    dataIndex: "publish",
    key: "publish",
    width: 150,
  },

  {
    title: "Phương thức",
    dataIndex: "method",
    key: "method",
    width: 150,
  },
  {
    title: "Router",
    dataIndex: "router",
    key: "router",
    width: 150,
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
          <PermissionModal
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
          <PermissionModal
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

export const PermissionList = () => {
  const { data, isLoading, reload } = useContext(ServerPageContext)

  const dataSource: IColumns[] =
    data?.oderStatus?.map?.((lv, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        name: lv?.name,
        method: lv?.method,
        router: lv?.router,
        publish: lv?.publish ? "publish" : "hidden",
        data: lv,
        group_: lv?.group_,
        updateAction: () => {
          reload?.()
        },
      }
    }) || []

  return (
    <div className="h-full">
      <div className="h-full">
        <TableC
          scroll={{
            useScroll: true,
          }}
          search={{
            width: 200,
            key: ["name", "method", "router", "group_"],
          }}
          title="Danh sách quyền"
          onReload={reload}
          right={
            <PermissionModal
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
