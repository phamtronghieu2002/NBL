import { useContext } from "react"
import { ServerPageContext } from ".."
import { ColumnsType } from "antd/es/table"
import { Button } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { ComponentTitle } from "../../../../conponents/TitleC/ComponentTitle"
import { TableC } from "../../../../conponents/TableC"
import { IModel, IModelTypeType } from "../../../../_types/devServerType"
import { _const } from "../../../../_constant"
import { ModelModal } from "../../../../conponents/modals/ModelModal"

interface IColumns {
  key: number
  stt: number
  name: string
  disk_name: string
  model_type_name: string
  connection_type_name: string
  note: string
  publish: string
  data: IModel
  made_in: string
  quantity_channel: number
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
    title: "Loại model",
    dataIndex: "model_type_name",
    key: "model_type_name",
    width: 150,
  },
  {
    title: "Loại ổ đĩa",
    dataIndex: "disk_name",
    key: "disk_name",
    width: 150,
  },
  {
    title: "Made in",
    dataIndex: "made_in",
    key: "made_in",
    width: 150,
  },
  {
    title: "Loại connection",
    dataIndex: "connection_type_name",
    key: "connection_type_name",
    width: 150,
  },
  {
    title: "Số kênh",
    dataIndex: "quantity_channel",
    key: "quantity_channel",
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
    width: 250,
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
          <ModelModal
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
          <ModelModal
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

export const ModelList = () => {
  const { data, isLoading, reload } = useContext(ServerPageContext)

  const dataSource: IColumns[] =
    data?.modelList?.map?.((lv, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        name: lv?.name,
        disk_name: lv?.disk_name,
        made_in: lv?.made_in,
        model_type_name: lv?.model_type_name,
        connection_type_name: lv?.connection_type_name,
        note: lv?.note,
        quantity_channel: lv?.quantity_channel,
        publish: lv?.publish
          ? _const?.string?.s?.pushlish
          : _const?.string?.s?.hidden,
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
            <ModelModal
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
