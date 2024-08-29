import { ColumnsType } from "antd/es/table"
import { IDriver } from "../../../../_types/driverType"
import { ReactNode } from "react"
import { Coppy } from "../../../../conponents/Coppy"
import { Tag } from "antd"
import { PopoverLink } from "../../../../conponents/PopoverC"
import { Action } from "../../../../conponents/Actions"
import {
  PiPencilSimpleLineDuotone,
  PiShieldDuotone,
  PiShieldSlashDuotone,
  PiSubtitlesDuotone,
  PiSubtitlesSlashDuotone,
  PiTrashDuotone,
} from "react-icons/pi"
import { EditDriverBox } from "../../../../conponents/ManageBox/EditDriverBox"
import { DriverEditModal } from "../../../../conponents/modals/DriverEditModal"
import { _app } from "../../../../utils/_app"

export interface IColumns {
  key: number
  actions: ReactNode
  activation_date: string
  citizen_identity_card: string
  created_at: string
  creator: string
  driver_status_check_name: string
  driver_status_name: string
  expired_on: string
  gender: string
  license_number: string
  license_type_name: string
  name: string
  phone: string
  stt: number
  data: IDriver
  updateAction: () => void
}

export const columns: ColumnsType<IColumns> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    width: 70,
    className: "text-center",
    fixed: "left",
  },
  {
    title: "Họ tên",
    dataIndex: "name",
    key: "name",
    width: 150,
    render(value, record, index) {
      return (
        <div className="text-theme italic">
          <Coppy>{value}</Coppy>
        </div>
      )
    },
    fixed: "left",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    width: 150,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },
  {
    title: "Số bằng lái",
    dataIndex: "license_number",
    key: "license_number",
    width: 150,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },
  {
    title: "Loại bằng lái",
    dataIndex: "license_type_name",
    key: "license_type_name",
    width: 100,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },
  {
    title: "CMND/CCCD",
    dataIndex: "citizen_identity_card",
    key: "citizen_identity_card",
    width: 200,
    render(value, record, index) {
      return <Coppy>{value}</Coppy>
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "driver_status_name",
    key: "driver_status_name",
    width: 100,
    render(value, record, index) {
      const color = record?.data?.is_actived == 0 ? "red" : ""
      return <Tag color={color}>{value}</Tag>
    },
  },

  {
    title: "Trạng thái xác thực",
    dataIndex: "driver_status_check_name",
    key: "driver_status_check_name",
    width: 150,
    render(value, record, index) {
      const color = record?.data?.is_check == 0 ? "red" : ""
      return <Tag color={color}>{value}</Tag>
    },
  },

  {
    title: "Ngày cấp bằng lái",
    dataIndex: "activation_date",
    key: "activation_date",
    width: 150,
  },
  {
    title: "Ngày hết hạn bằng lái",
    dataIndex: "expired_on",
    key: "expired_on",
    width: 180,
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    key: "gender",
    width: 150,
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    key: "created_at",
    width: 150,
  },
  {
    title: "Người tạo",
    dataIndex: "creator",
    key: "creator",
    width: 400,
  },
  {
    title: "Thao tác",
    dataIndex: "actions",
    key: "actions",
    width: 120,
    fixed: "right",
    render(value, record, index) {
      const reload = record?.updateAction
      const isActived = record?.data?.is_actived
      const isCheck = record?.data?.is_check
      const driverId = record?.data?.id

      return (
        <div className="flex items-center gap-2 text-[12px]">
          {/* <div className="px-1">Chi tiết</div> */}
          <PopoverLink
            buttonTitle="Chọn"
            content={
              <Action
                actions={[
                  {
                    title: "Chỉnh sửa thông tin",
                    icon: PiPencilSimpleLineDuotone,
                    modal: {
                      modal: DriverEditModal,
                      modalProps: {
                        driverId: record?.data?.id,
                        onSccess: reload,
                        title: "Chỉnh sửa thông tin tài xế",
                      },
                    },
                  },
                  { title: "divider", type: "divider" },
                  !(isActived == 0)
                    ? {
                        title: "Vô hiệu hoá",
                        icon: PiShieldSlashDuotone,
                        onClick() {
                          _app?.driver?.disabled?.(
                            driverId,
                            record?.data?.name,
                            () => {
                              setTimeout(() => {
                                reload?.()
                              }, 200)
                            },
                          )
                        },
                      }
                    : {
                        title: "Bỏ vô hiệu hoá",
                        icon: PiShieldDuotone,
                        onClick() {
                          _app?.driver?.actived?.(
                            driverId,
                            record?.data?.name,
                            () => {
                              setTimeout(() => {
                                reload?.()
                              }, 200)
                            },
                          )
                        },
                      },

                  isCheck == 0
                    ? {
                        title: "Xác thực tài xế",
                        icon: PiSubtitlesDuotone,
                        onClick() {
                          _app?.driver?.check?.(
                            driverId,
                            record?.data?.name,
                            1,
                            () => {
                              setTimeout(() => {
                                reload?.()
                              }, 200)
                            },
                          )
                        },
                      }
                    : {
                        title: "Bỏ xác thực tài xế",
                        icon: PiSubtitlesSlashDuotone,
                        onClick() {
                          _app?.driver?.check?.(
                            driverId,
                            record?.data?.name,
                            0,
                            () => {
                              setTimeout(() => {
                                reload?.()
                              }, 200)
                            },
                          )
                        },
                      },

                  {
                    title: "Xoá",
                    icon: PiTrashDuotone,
                    onClick() {
                      _app?.driver?.delete?.(
                        driverId,
                        record?.data?.name,
                        () => {
                          setTimeout(() => {
                            reload?.()
                          }, 200)
                        },
                      )
                    },
                  },
                ]}
              />
            }
          />
        </div>
      )
    },
  },
]

// const key = {}
// columns?.forEach?.((k) => {
//   key[k?.key] = ""
// })

// console.log(key)
