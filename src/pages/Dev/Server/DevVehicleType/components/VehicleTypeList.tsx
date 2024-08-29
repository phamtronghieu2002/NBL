import { useContext } from "react"
import { ServerPageContext } from ".."
import { ColumnsType } from "antd/es/table"
import { ComponentTitle } from "../../../../../conponents/TitleC/ComponentTitle"
import { TableC } from "../../../../../conponents/TableC"
import { Button } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import {
  IVehicleIconType,
  IVehicleTypeType,
} from "../../../../../_types/devServerType"
import { VehicleIconModal } from "../../../../../conponents/modals/VehicleIconModal"
import { VehicleTypeModal } from "../../../../../conponents/modals/VehicleTypeModal"

interface IColumns {
  key: number
  stt: number
  name: string
  publish: string
  vehicle_icon_name: string
  max_speed: number
  rule: string
  data: IVehicleTypeType
  rowData: IVehicleIconType[]
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
    title: "Tên phương tiện",
    dataIndex: "name",
    key: "name",
    width: 150,
  },
  {
    title: "Mã icon",
    dataIndex: "vehicle_icon_name",
    key: "vehicle_icon_name",
    width: 150,
  },
  {
    title: "Tốc độ tối đa (km/h)",
    dataIndex: "max_speed",
    key: "max_speed",
    width: 150,
  },
  {
    title: "Nghị định",
    dataIndex: "rule",
    key: "rule",
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
          <VehicleTypeModal
            onSccess={() => {
              record?.updateAction?.()
            }}
            button={
              <Button size="small" type="link">
                Sửa
              </Button>
            }
            data={{
              vehilceType: record?.data,
              vehicleIconList: record?.rowData,
            }}
          />
          <VehicleTypeModal
            onSccess={() => {
              record?.updateAction?.()
            }}
            type="delete"
            button={
              <Button size="small" type="link">
                Xoá
              </Button>
            }
            data={{
              vehilceType: record?.data,
              vehicleIconList: record?.rowData,
            }}
          />
        </div>
      )
    },
  },
]

export const VehicleTypeList: React.FC = () => {
  const { data, isLoading, reload } = useContext(ServerPageContext)

  const dataSource: IColumns[] =
    data?.vehicleType?.map?.((lv, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        name: lv?.name,
        max_speed: lv?.max_speed,
        vehicle_icon_name: lv?.vehicle_icon_name,
        rule: lv?.rule ? "Nghị định" : "Không",
        publish: lv?.publish ? "publish" : "hidden",
        data: lv,
        rowData: data?.vehicleIcon || [],
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
            <VehicleTypeModal
              onSccess={() => {
                reload?.()
              }}
              data={{
                vehilceType: undefined,
                vehicleIconList: data?.vehicleIcon,
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
