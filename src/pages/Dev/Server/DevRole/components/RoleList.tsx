import { useContext } from "react"
import { ServerPageContext } from ".."
import { ColumnsType } from "antd/es/table"
import { ComponentTitle } from "../../../../../conponents/TitleC/ComponentTitle"
import { TableC } from "../../../../../conponents/TableC"
import { Button } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { LevelModal } from "../../../../../conponents/modals/LevelModal"
import { ModelTypeModal } from "../../../../../conponents/modals/ModelTypeModal"
import { RoleModal } from "../../../../../conponents/modals/RoleModal"
import { IRoleType } from "../../../../../_types/devServerType"
import { EditInline } from "../../../../../conponents/FormC/EditInline"
import {
  getRoleAddPermissionService,
  getRolePermissionService,
  getRoleRemovePermissionService,
  updateSortRoleService,
} from "../../../../../services/dev_roleServices"
import { api } from "../../../../../_helper"
import { _const } from "../../../../../_constant"
import { RegisterPermissionModal } from "../../../../../conponents/modals/RegisterPermissionModal"

interface IColumns {
  key: number
  stt: number
  name: string
  publish: string
  data: IRoleType
  des: string
  sort: number
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
    title: "Tên vai trò",
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
    title: "Sắp xếp",
    dataIndex: "sort",
    key: "sort",
    width: 100,
    render(value, record, index) {
      return (
        <EditInline
          inputProps={{
            type: "number",
          }}
          value={value}
          onSave={(value, setState, setIsloading) => {
            setIsloading?.(true)
            updateSortRoleService?.(record?.data?.id, { sort: value })
              ?.then?.((fb: any) => {
                if (fb?.result) {
                  api?.message?.success(
                    fb?.message || _const?.string?.message?.success,
                  )
                  setState?.()
                } else {
                  api?.message?.error(
                    fb?.message || _const?.string?.message?.error,
                  )
                }
              })
              .catch?.((error) => {
                api?.message?.error(_const?.string?.message?.error)
              })
              .finally(() => {
                setIsloading?.(false)
              })
          }}
        />
      )
    },
  },

  {
    title: "Mô tả",
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
          <RoleModal
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
          <RoleModal
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
          <RegisterPermissionModal
            onSccess={() => {
              // record?.updateAction?.()
            }}
            getDefaultValPromise={() =>
              getRolePermissionService(record?.data?.id)
            }
            title={`Gán quyền cho vai trò ${record?.data?.name}`}
            onFinish={(values = [], preVal = [], action, setIsLoading) => {
              if (values) {
                const addList = values?.filter?.(
                  (val) => !preVal?.includes?.(val),
                )
                const removeList = preVal?.filter?.(
                  (val) => !values?.includes?.(val),
                )

                let addPromise = addList?.length
                  ? getRoleAddPermissionService({
                      id: record?.data?.id,
                      permissions: JSON.stringify(addList || []),
                    })
                  : Promise.resolve(true)

                let removePromise = removeList?.length
                  ? getRoleRemovePermissionService({
                      id: record?.data?.id,
                      permissions: JSON.stringify(removeList || []),
                    })
                  : Promise.resolve(true)

                setIsLoading?.(true)
                Promise.all([addPromise, removePromise])
                  .then((fb: any) => {
                    api?.message?.success(
                      fb?.message || _const?.string?.message?.success,
                    )
                    action?.closeModal?.()
                  })
                  .catch((error) => {
                    api?.message?.error(_const?.string?.message?.error)
                  })
                  .finally(() => {
                    setIsLoading?.(false)
                  })
              } else {
                api?.message?.info(_const?.string?.message?.unknow)
              }
            }}
            button={
              <Button size="small" type="link">
                Gán quyền
              </Button>
            }
          />
        </div>
      )
    },
  },
]

export const RoleList = () => {
  const { data, isLoading, reload } = useContext(ServerPageContext)

  const dataSource: IColumns[] =
    data?.oderStatus?.map?.((lv, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        name: lv?.name,
        des: lv?.des,
        publish: lv?.publish ? "publish" : "hidden",
        data: lv,
        sort: lv?.sort,
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
            <RoleModal
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
