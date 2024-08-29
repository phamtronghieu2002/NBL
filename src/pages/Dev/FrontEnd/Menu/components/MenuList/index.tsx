import { useEffect, useState } from "react"
import { useAppSelector } from "../../../../../../app/hooks"
import { TableC } from "../../../../../../conponents/TableC"
import { ColumnsType } from "antd/es/table"
import { getMenuRowService } from "../../../../../../services/interfaceServices"
import { IResponse } from "../../../../../../_types/response"
import { IServerMenu } from "../../../../../../_types/interfaceType"
import { Button, Modal } from "antd"
import { EditMenuModal } from "../../../../../../conponents/modals/EditMenuModal"
import {
  ExclamationCircleFilled,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import { ComponentTitle } from "../../../../../../conponents/TitleC/ComponentTitle"
import { IconC } from "../../../../../../conponents/IconC"
const { confirm } = Modal

interface IColumns {
  key: number
  stt: number
  route: string
  component: string
  type: string
  parent: string
  iconName: string
  actions: string
  data: IServerMenu
  alldata: IServerMenu[]
  name: string
  publish: string
  updateAction: () => void
}

const columns: ColumnsType<IColumns> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    width: 60,
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    width: 250,
  },
  {
    title: "Đường dẫn",
    dataIndex: "route",
    key: "route",
    sorter: (a, b) => (a.route < b.route ? -1 : 1),
    width: 200,
  },
  // {
  //   title: "Trang",
  //   dataIndex: "component",
  //   key: "component",
  // },
  {
    title: "Icon",
    dataIndex: "iconName",
    key: "iconName",
    render(value, record, index) {
      return (
        <div className="flex items-center gap-2">
          <div>{value}</div>
          <IconC name={value} size={20}></IconC>
        </div>
      )
    },
    width: 200,
  },
  {
    title: "Nằm trong",
    dataIndex: "parent",
    key: "parent",
    width: 200,
  },
  {
    title: "Kiểu",
    dataIndex: "type",
    key: "type",
    width: 100,
  },
  {
    title: "Trạng thái",
    dataIndex: "publish",
    key: "publish",
    width: 100,
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
          <EditMenuModal
            onSccess={() => {
              record?.updateAction?.()
            }}
            button={
              <Button size="small" type="link">
                Sửa
              </Button>
            }
            menu={record?.data}
            menuRow={record?.alldata}
          />
          <EditMenuModal
            onSccess={() => {
              record?.updateAction?.()
            }}
            type="delete"
            button={
              <Button size="small" type="link">
                Xoá
              </Button>
            }
            menu={record?.data}
            menuRow={record?.alldata}
          />
        </div>
      )
    },
  },
]

interface IProps {
  rerenderKey: number
}

export const MenuList: React.FC<IProps> = ({ rerenderKey }) => {
  const [dataSource, setDataSource] = useState<IColumns[]>()
  const [menuRow, setMenuRow] = useState<IServerMenu[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getMenuData = async () => {
    setIsLoading(true)
    try {
      const fb: any = await getMenuRowService()
      if (fb?.result) {
        const data: IServerMenu[] = fb?.data
        const dataObj: { [key: string]: IServerMenu } = {}
        data?.forEach?.((menu) => {
          dataObj[menu?.id] = menu
        })

        const tableData: IColumns[] = data
          ?.sort?.((a, b) => (a?.link < b?.link ? -1 : 1))
          ?.map?.((menu, index) => {
            return {
              key: index + 1,
              stt: index + 1,
              data: menu,
              alldata: data,
              name: menu?.name,
              route: menu?.link,
              component: menu?.component,
              type: menu?.type,
              parent: dataObj?.[menu?.parent_id]?.name,
              iconName: menu?.icon,
              publish: menu?.publish ? "publish" : "hidden",
              actions: "-",
              updateAction: getMenuData,
            }
          })

        setDataSource(tableData)
        setMenuRow(data)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getMenuData()
  }, [rerenderKey])

  return (
    <>
      <div className="h-full">
        <TableC
          search={{
            width: 300,
            key: ["name", "route", "iconName", "parent", "type"],
          }}
          onReload={() => {
            getMenuData?.()
          }}
          title="Danh sách menu"
          right={
            <div className="flex items-center gap-2">
              <EditMenuModal
                onSccess={() => {
                  getMenuData()
                }}
                menuRow={menuRow}
                type="add"
                button={
                  <Button size="small" type="default" icon={<PlusOutlined />}>
                    Thêm menu
                  </Button>
                }
              />
            </div>
          }
          scroll={{
            useScroll: true,
          }}
          props={{
            loading: isLoading,
            columns: columns,
            dataSource: dataSource,
            size: "middle",
          }}
        />
      </div>
    </>
  )
}
