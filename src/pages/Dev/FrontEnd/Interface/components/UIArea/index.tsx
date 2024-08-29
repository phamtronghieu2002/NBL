import { Alert, Button, Divider, Spin } from "antd"
import {
  IInterface,
  IInterfaceDetail,
} from "../../../../../../_types/interfaceType"
import {
  BTitle,
  LTitle,
} from "../../../../../../conponents/TitleC/ComponentTitle"
import { LogoUpdate } from "./components/LogoUpdate"
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react"
import {
  deleteUIService,
  getInterfaceDetailService,
  getInterfacePageDetailService,
} from "../../../../../../services/interfaceServices"
import { MaskLoader } from "../../../../../../conponents/Loader"
import { ErrorCom } from "../../../../../../conponents/ErrorCom"
import { FaviconUpdate } from "./components/FaviconUpdate"
import { BannerUpdate } from "./components/BannerUpdate"
import { Question } from "../../../../../../conponents/Question"
import { InfoUpdate } from "./components/InfoUpdate"
import { api } from "../../../../../../_helper"
import { getString } from "../../../../../../utils/getString"
import { ReloadOutlined } from "@ant-design/icons"

interface IProps {
  ui: IInterface
}

interface IUIAreaContext {
  ui?: IInterfaceDetail
  reload?: () => void
  setIsReloading?: Dispatch<SetStateAction<boolean>>
}

export const UIAreaContext = createContext<IUIAreaContext>({})

export const UIArea: React.FC<IProps> = ({ ui }) => {
  const [UI, setUI] = useState<IInterfaceDetail>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isReloading, setIsReloading] = useState<boolean>(true)
  const [reloadKey, setReloadKey] = useState<number>(0)
  const [uiKey, setUiKey] = useState<number>(Math.random())
  const [isDelete, setIsDelete] = useState<boolean>(false)

  const reload = () => {
    setReloadKey(Math.random())
  }

  const deleteUI = () => {
    const deleteFnc = () => {
      const uiId = ui.id

      setIsReloading(true)
      deleteUIService(uiId)
        .then((fb: any) => {
          api.message?.success(fb?.message)
          reload?.()
          setIsDelete(true)
        })
        .catch((error) => {
          api.message?.error(getString.errorAxiosParams(error))
        })
        .finally(() => {
          setIsReloading(false)
        })
    }

    api.modal?.confirm({
      title: "Xác nhận xoá",
      content: (
        <div>
          Bạn có chắc chắn muốn xoá UI <b>{ui.keyword}</b>
        </div>
      ),
      okText: "Xác nhận xoá",
      onOk: deleteFnc,
    })
  }

  useEffect(() => {
    reloadKey ? setIsReloading(true) : setIsLoading(true)
    getInterfacePageDetailService(ui?.id)
      ?.then((fb: any) => {
        if (fb?.result) {
          setUI(fb?.data?.[0])
        } else {
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false)
          setIsReloading(false)
        }, 300)
        setUiKey(Math.random())
      })
  }, [ui?.id, reloadKey])

  const contextValue = {
    ui: UI,
    reload,
    setIsReloading,
  }

  if (isDelete) {
    return (
      <div className="h-full flex items-center justify-center relative">
        <ErrorCom text="UI đã bị xoá" />
      </div>
    )
  }

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center relative">
        <MaskLoader content="Đang tải..." />
      </div>
    )

  if (!isLoading && !isReloading && !UI?.id) {
    return (
      <div className="h-full flex items-center justify-center relative">
        <ErrorCom />
      </div>
    )
  }

  return (
    <UIAreaContext.Provider value={contextValue}>
      <div
        key={uiKey}
        className="px-2 py-2 pt-[60px] relative h-full overflow-auto"
      >
        {isReloading ? <MaskLoader /> : null}
        <div className="px-4 py-4 pb-0 text-xl h-[60px] bg-white font-extralight absolute top-0 left-0 right-0 z-[99]">
          <div className="flex items-center justify-between">
            <div>{ui?.keyword}</div>
            <div className="flex items-center gap-2">
              <Button
                onClick={reload}
                size="small"
                type="link"
                icon={<ReloadOutlined />}
              ></Button>
              <Button onClick={deleteUI} size="small" type="link">
                Xoá
              </Button>
            </div>
          </div>
          <Divider className="my-4 mb-0" />
        </div>
        <div className="px-2 py-4 relative h-full overflow-auto">
          <div className="flex flex-col gap-2">
            <div className="flex gap-6">
              <div className="flex flex-col gap-4 flex-1">
                <BTitle
                  title={
                    <div className="flex items-center gap-2">
                      Logo & favicon{" "}
                      <Question content="Logo và icon hiển thị của trang web" />
                    </div>
                  }
                />
                <div className="flex flex-col">
                  <div className="flex gap-4">
                    <LogoUpdate />
                    <FaviconUpdate />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 flex-[2]">
                <BTitle
                  title={
                    <div className="flex items-center gap-2">
                      Banner{" "}
                      <Question content="Banner được hiển thị ở trang đăng nhập" />
                    </div>
                  }
                />
                <div className="flex flex-col">
                  <div className="flex gap-4">
                    <BannerUpdate />
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            <div className="flex flex-col gap-2">
              <BTitle title="Thông tin trang" />
              <div>
                <InfoUpdate />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UIAreaContext.Provider>
  )
}
