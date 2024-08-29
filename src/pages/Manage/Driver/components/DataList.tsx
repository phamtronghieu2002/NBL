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
import { pageAction } from "../_actions"
import { IoCaretDownSharp } from "react-icons/io5"
import { PopoverLink } from "../../../../conponents/PopoverC"
import { Action } from "../../../../conponents/Actions"
import {
  PiArrowsCounterClockwiseLight,
  PiInfoLight,
  PiPencilSimpleLineLight,
  PiPlugsConnectedLight,
  PiTrashLight,
} from "react-icons/pi"
import { DeviceModal } from "../../../../conponents/modals/DeviceModal"
import { store } from "../../../../app/store"
import { Coppy } from "../../../../conponents/Coppy"
import { DeviceActiveModal } from "../../../../conponents/modals/DeviceActiveModal"
import { IDriver } from "../../../../_types/driverType"
import { IColumns, columns } from "./COLUMS"
import { getString } from "../../../../utils/getString"
import { CustomerAddModal } from "../../../../conponents/modals/CustomerAddModal"
import { DriverAddModal } from "../../../../conponents/modals/DriverAddModal"

export const DataList = () => {
  const { state, dispatch } = useContext(ServerPageContext)

  const reload = () => dispatch?.(pageAction?.reloadData())
  const params = state?.device?.param

  const [dataSource, setDataSource] = useState<IColumns[]>()

  useEffect(() => {
    const dataSource_: IColumns[] =
      state?.device?.list?.map?.((data, index) => ({
        key: index + 1,
        stt: index + 1 + params?.limit * params?.offset,
        actions: "-",
        activation_date: data?.activation_date
          ? getTime?.Unix2StringFormat(data?.activation_date / 1000)
          : "-",
        citizen_identity_card: data?.citizen_identity_card,
        created_at: data?.created_at
          ? getTime?.Unix2StringFormat(data?.created_at / 1000)
          : "-",
        creator: data?.creator,
        driver_status_check_name:
          data?.is_check == 1 ? "Đã xác thực" : "Chưa xác thực",
        driver_status_name: data?.is_actived == 0 ? "Vô hiệu hoá" : "Hoạt động",
        expired_on: data?.expired_on
          ? getTime?.Unix2StringFormat(data?.expired_on / 1000)
          : "-",
        gender: getString.gender(data?.gender),
        license_number: data?.license_number,
        license_type_name: data?.license_type_name,
        name: data?.name,
        phone: data?.phone,
        data: data,
        updateAction: () => {
          reload?.()
        },
      })) || []

    setDataSource(dataSource_)
  }, [state?.device?.list])

  if (!dataSource) return null

  const user = store?.getState()?.user?.child?.object?.[state?.userId]

  return (
    <div className="h-full">
      <div className="h-full">
        <TableC
          title={`Danh sách tài xế ${user?.customer_name}`}
          onReload={reload}
          scroll={{
            useScroll: true,
          }}
          search={{
            width: 200,
            onSearch(q) {
              dispatch?.(pageAction?.setDataQSearch?.(q))
            },
            limitSearchLegth: 3,
          }}
          right={
            <>
              {user?.is_team ? null : (
                <DriverAddModal
                  onSccess={() => {
                    reload?.()
                  }}
                  customerId={user?.customer_id}
                  button={
                    <Button type="default" size="small" icon={<PlusOutlined />}>
                      Thêm tài xế
                    </Button>
                  }
                />
              )}
            </>
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
                dispatch?.(pageAction?.setDataOffset(page - 1))
                dispatch?.(pageAction?.setDataLimit(pageSize))
              },
            },
          }}
        />
      </div>
    </div>
  )
}
