import { useEffect, useState } from "react"
import { CustomerTree } from "../../../conponents/tree/CustomerTree"
import { ComponentTitle } from "../../../conponents/TitleC/ComponentTitle"
import { Key } from "antd/es/table/interface"
import { store } from "../../../app/store"
import { UserBox } from "../../../conponents/ManageBox/UserBox"
import { Button, Tabs, Tooltip } from "antd"
import { TabsProps } from "antd/lib"
import { AiOutlineMenuFold } from "react-icons/ai"
import { CustomerPicker } from "./components/CustomerPicker"
import { ChildrenBox } from "../../../conponents/ManageBox/ChildrenBox"
import { EditUserInfoBox } from "../../../conponents/ManageBox/EditCustomerInfoBox"
import { useSearchParams } from "react-router-dom"
import { UsersBox } from "../../../conponents/ManageBox/UsersBox"
import { TeamBox } from "../../../conponents/ManageBox/TeamBox"
import { DeviceBox } from "../../../conponents/ManageBox/DeviceBox"

interface IProps {}

export const BusinessPage: React.FC<IProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams?.get?.("tab") || "device"
  const userIdDefault = Number(searchParams?.get?.("user_id") || 0)

  const [userId, setUserId] = useState<number>(
    userIdDefault || store?.getState?.()?.user?.access?.userInfo?.id || 999,
  )

  const [tab, setTab] = useState<string>(tabParam)

  const setSearchParamsVal = (key: string, val: string) => {
    setSearchParams((preParam) => {
      preParam?.set(key, `${val}`)
      return preParam
    })
  }

  const onChangeUserKey = (userId: Key[]) => {
    // setUserId?.(Number(userId?.[0]))
    setSearchParamsVal("user_id", `${userId}`)
  }
  const onChangeTabKey = (tab: string) => {
    // setUserId?.(Number(userId?.[0]))
    setSearchParamsVal("tab", `${tab}`)
  }

  const user = store?.getState?.()?.user?.child?.object?.[userId]
  const userInfo = store?.getState?.()?.user?.access?.userInfo

  const items_: any = [
    {
      key: "device",
      label: "Phương tiện",
      children: <DeviceBox userId={userId} />,
    },
    user?.is_team
      ? undefined
      : {
          key: "users",
          label: "Khách hàng",
          children: <UsersBox userId={userId} />,
        },

    (user?.is_team || !user?.is_main) && userId != userInfo?.id
      ? undefined
      : {
          key: "teams",
          label: "Đội phương tiện",
          children: <TeamBox userId={userId} />,
        },
    user?.is_team
      ? undefined
      : {
          key: "children",
          label: "Tài khoản con",
          children: <ChildrenBox userId={userId} />,
        },

    {
      key: "info",
      label: "Thông tin",
      children: <EditUserInfoBox userId={userId} />,
    },
  ]

  const items: TabsProps["items"] = items_?.filter?.((i: any) => i)

  useEffect(() => {
    setTab(tabParam)
  }, [tabParam])

  useEffect(() => {
    if (userIdDefault) {
      setUserId(userIdDefault)
    }
  }, [userIdDefault])

  useEffect(() => {
    const tabStringKey = items?.map?.((i) => i?.key)

    if (!tabStringKey?.includes?.(tab)) {
      const tabString = tabStringKey?.[0]
      onChangeTabKey(`${tabString}`)
    }
  }, [userId])

  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col">
        <CustomerPicker onChange={onChangeUserKey} userId={userId} />
      </div>
      <div className="flex-1 w-[400px] overflow-auto flex flex-col gap-4 pb-4">
        <div className="">
          <UserBox userId={userId} />
        </div>
        <div className="bg-white tab-user___box">
          <Tabs
            key={userId}
            size="small"
            defaultActiveKey={tab}
            activeKey={tab}
            items={items}
            onChange={(tab) => {
              onChangeTabKey(`${tab}`)
            }}
          />
        </div>
      </div>
    </div>
  )
}
