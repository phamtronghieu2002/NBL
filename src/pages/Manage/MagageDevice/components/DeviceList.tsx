import { ReactNode, useContext, useEffect, useState } from "react"
import { ServerPageContext } from ".."
import { ColumnsType } from "antd/es/table"
import { Button, Popover, Tag } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { ComponentTitle } from "../../../../conponents/TitleC/ComponentTitle"
import { TableC } from "../../../../conponents/TableC"
import { _const } from "../../../../_constant"
import { IDeviceInfo } from "../../../../_types/deviceType"
import getTime from "../../../../utils/getTime"
import { devicePageAction } from "../_actions"
import { IoCaretDownSharp } from "react-icons/io5"
import { PopoverLink } from "../../../../conponents/PopoverC"
import { Action } from "../../../../conponents/Actions"
import {
  PiArrowsCounterClockwiseLight,
  PiCirclesThreePlusLight,
  PiInfoLight,
  PiPencilSimpleLineLight,
  PiPlugsConnectedLight,
  PiTrashLight,
} from "react-icons/pi"
import { DeviceModal } from "../../../../conponents/modals/DeviceModal"
import { store } from "../../../../app/store"
import { Coppy } from "../../../../conponents/Coppy"
import { DeviceActiveModal } from "../../../../conponents/modals/DeviceActiveModal"
import { TextEllipsis } from "../../../../conponents/TextC"
import { _array } from "../../../../utils/_array"

interface IColumns {
  key: number
  dev_id: string
  imei: string
  model_name: string
  orders_code: string
  time_update_version: string
  version_hardware: string
  version_software: string
  actions: ReactNode
  data: IDeviceInfo
  activation_date: string
  warranty_expired_on: string
  expired_on: string
  device_status_name: string
  serial: string
  customer_name: string
  cmcServer: string
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
    title: "Mã đầu ghi",
    dataIndex: "dev_id",
    key: "dev_id",
    width: 150,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },
  {
    title: "IMEI",
    dataIndex: "imei",
    key: "imei",
    width: 150,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },

  {
    title: "Trạng thái",
    dataIndex: "device_status_name",
    key: "device_status_name",
    width: 150,
    render(value, record, index) {
      if (value == "Chưa kích hoạt") {
        return <Tag color="blue">{value}</Tag>
      }
      if (value == "Đã kích hoạt") {
        return <Tag color="success">{value}</Tag>
      }

      return <Tag>{value}</Tag>
    },
  },
  {
    title: "CMCServer",
    dataIndex: "cmcServer",
    key: "cmcServer",
    width: 250,
  },
  {
    title: "Model",
    dataIndex: "model_name",
    key: "model_name",
    width: 150,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },
  {
    title: "Sở hữu",
    dataIndex: "customer_name",
    key: "customer_name",
    width: 200,
    render(value, record, index) {
      return <TextEllipsis tooltip text={value}></TextEllipsis>
    },
  },
  {
    title: "Serial",
    dataIndex: "serial",
    key: "serial",
    width: 150,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },
  {
    title: "Mã đơn hàng",
    dataIndex: "orders_code",
    key: "orders_code",
    width: 200,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },
  {
    title: "Cập nhật phiên bản lúc",
    dataIndex: "time_update_version",
    key: "time_update_version",
    width: 170,
  },
  {
    title: "Phiên bản phần cứng",
    dataIndex: "version_hardware",
    key: "version_hardware",
    width: 180,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },
  {
    title: "Phiên bản phần mềm",
    dataIndex: "version_software",
    key: "version_software",
    width: 180,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },
  {
    title: "Ngày kích hoạt",
    dataIndex: "activation_date",
    key: "activation_date",
    width: 150,
  },
  {
    title: "Hết hạn bảo hành",
    dataIndex: "warranty_expired_on",
    key: "warranty_expired_on",
    width: 170,
  },
  {
    title: "Ngày hết hạn",
    dataIndex: "expired_on",
    key: "expired_on",
    width: 150,
  },

  {
    title: "Thao tác",
    dataIndex: "actions",
    key: "actions",
    width: 120,
    fixed: "right",
  },
]

export const DeviceList = () => {
  const { state, dispatch } = useContext(ServerPageContext)

  const reload = () => dispatch?.(devicePageAction?.reloadDeviceData())
  const params = state?.device?.param

  const [dataSource, setDataSource] = useState<IColumns[]>()

  useEffect(() => {
    const dataSource_: IColumns[] =
      state?.device?.list?.map?.((lv, index) => ({
        key: index + 1,
        stt: index + 1 + params?.limit * params?.offset,
        dev_id: lv?.dev_id,
        serial: lv?.serial,
        imei: lv?.imei,
        model_name: lv?.model_name,
        orders_code: lv?.orders_code || "-",
        time_update_version: lv?.time_update_version
          ? getTime?.Unix2StringFormat(lv?.time_update_version / 1000)
          : "-",
        version_hardware: lv?.version_hardware || "-",
        version_software: lv?.version_software || "-",
        data: lv,
        customer_name: lv?.customer_name,
        device_status_name: lv?.device_status_name,
        cmcServer: lv?.host || _const?.string?.s?.unknow_,
        activation_date: lv?.activation_date
          ? getTime?.Unix2StringFormat(lv?.activation_date / 1000)
          : "-",
        warranty_expired_on: lv?.warranty_expired_on
          ? getTime?.Unix2StringFormat(lv?.warranty_expired_on / 1000)
          : "-",
        expired_on: lv?.expired_on
          ? getTime?.Unix2StringFormat(lv?.expired_on / 1000)
          : "-",
        updateAction: () => {
          reload?.()
        },
        actions: (
          <div>
            <PopoverLink
              buttonTitle="Chọn"
              content={
                <Action
                  actions={[
                    {
                      title: "Chỉnh sửa thiết bị",
                      icon: PiPencilSimpleLineLight,
                      modal: {
                        modal: DeviceModal,
                        modalProps: {
                          type: "update",
                          data: lv,
                          onSccess: reload,
                        },
                      },
                    },

                    {
                      title: "Kích hoạt thiết bị",
                      icon: PiPlugsConnectedLight,
                      modal: {
                        modal: DeviceActiveModal,
                        modalProps: {
                          type: "update",
                          data: lv,
                          onSccess: reload,
                        },
                      },
                    },
                    {
                      title: "Kích hoạt thiết bị vào phương tiện",
                      icon: PiCirclesThreePlusLight,
                      modal: {
                        modal: DeviceActiveModal,
                        modalProps: {
                          type: "update",
                          data: lv,
                          onSccess: reload,
                          isToVehicle: true,
                        },
                      },
                    },
                    {
                      title: "Xoá thiết bị",
                      icon: PiTrashLight,
                      modal: {
                        modal: DeviceModal,
                        modalProps: {
                          type: "delete",
                          data: lv,
                          onSccess: reload,
                        },
                      },
                    },
                  ]}
                />
              }
            />
          </div>
        ),
      })) || []

    setDataSource(dataSource_)
  }, [state?.device?.list])

  if (!dataSource) return null

  const user = store?.getState()?.user?.child?.object?.[state?.userId]

  return (
    <div className="h-full">
      <div className="h-full">
        <TableC
          title={`Danh sách thiết bị ${user?.customer_name}`}
          onReload={reload}
          scroll={{
            useScroll: true,
          }}
          exportExcel={{
            fileName: "DANH_SACH_THIET_BI",
            title: ["DANH_SACH_THIET_BI"],
          }}
          search={{
            width: 200,
            onSearch(q) {
              dispatch?.(devicePageAction?.setDeviceQSearch?.(q))
            },
            limitSearchLegth: 3,
          }}
          right={
            <DeviceModal
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
            loading: state?.device?.isLoading,
            columns: columns,
            dataSource: dataSource,
            size: "middle",
            pagination: {
              pageSize: state?.device?.param?.limit,
              total: state?.device?.totalPage * state?.device?.param?.limit,
              current: state?.device?.param?.offset + 1,
              onChange(page, pageSize) {
                dispatch?.(devicePageAction?.setDeviceOffset(page - 1))
                dispatch?.(devicePageAction?.setDeviceLimit(pageSize))
              },
              pageSizeOptions: [10, 50, 100, 500],
            },
          }}
        />
      </div>
    </div>
  )
}
