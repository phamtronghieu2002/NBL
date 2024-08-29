import { useContext } from "react"
import { ServerPageContext } from ".."
import { ColumnsType } from "antd/es/table"
import { ComponentTitle } from "../../../../../conponents/TitleC/ComponentTitle"
import { TableC } from "../../../../../conponents/TableC"
import { Button } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { LevelModal } from "../../../../../conponents/modals/LevelModal"
import { ICmcServer, IModelTypeType } from "../../../../../_types/devServerType"
import { CmcServerModal } from "../../../../../conponents/modals/CmcServerModal"

interface IColumns {
  key: number
  stt: number
  hostname: string
  ip: string
  port: number
  publish: string
  data: ICmcServer
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
    title: "Hostname",
    dataIndex: "hostname",
    key: "hostname",
    width: 250,
  },
  {
    title: "IP",
    dataIndex: "ip",
    key: "ip",
    width: 150,
  },
  {
    title: "Port",
    dataIndex: "port",
    key: "port",
    width: 150,
  },
  {
    title: "Trạng thái",
    dataIndex: "publish",
    key: "publish",
    width: 150,
  },

  {
    title: "Thao tác",
    dataIndex: "actions",
    key: "actions",
    width: 200,
    render(value, record, index) {
      return (
        <div className="flex items-center">
          <CmcServerModal
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
          <CmcServerModal
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

export const CMCServerList = () => {
  const { data, isLoading, reload } = useContext(ServerPageContext)

  const dataSource: IColumns[] =
    data?.cmcList?.map?.((lv, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        hostname: lv?.host,
        ip: lv?.ip,
        port: lv?.port,
        publish: lv?.publish ? "publish" : "hidden",
        data: lv,
        updateAction: () => {
          // reload?.()
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
            <CmcServerModal
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
