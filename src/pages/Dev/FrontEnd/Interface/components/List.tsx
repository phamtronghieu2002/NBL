import { Fragment, useContext } from "react"
import { PageContext } from "../InterfaceManager"
import { ComponentTitle } from "../../../../../conponents/TitleC/ComponentTitle"
import { IInterface } from "../../../../../_types/interfaceType"
import { Button, Divider } from "antd"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { UIAddModal } from "../../../../../conponents/modals/UIAddModal"
import { MaskLoader } from "../../../../../conponents/Loader"

interface IListItem {
  isActived: boolean
  ui: IInterface
}

export const ListItem: React.FC<IListItem> = ({ isActived, ui }) => {
  const { setPickedId } = useContext(PageContext)

  return (
    <div
      onClick={() => {
        setPickedId?.(ui?.id)
      }}
      className={`transition-all py-2 px-4 cursor-pointer hover:bg-root_hover_bg_dark ${
        isActived ? "bg-root_theme_hover font-semibold" : ""
      }`}
    >
      {ui?.keyword}
    </div>
  )
}

export const List: React.FC = () => {
  const { list, pickedId, reload, setPickedId, isLoading } =
    useContext(PageContext)

  return (
    <div className="flex flex-col h-full relative">
      <div>
        <ComponentTitle
          title="Danh sách UI"
          right={
            <div>
              <Button
                onClick={reload}
                size="small"
                type="link"
                icon={<ReloadOutlined />}
              ></Button>
            </div>
          }
        />
      </div>
      <div className="flex-1 overflow-auto px-2 py-4">
        <div className="mb-2">
          <UIAddModal
            button={
              <Button className="w-full" type="primary" icon={<PlusOutlined />}>
                Thêm UI
              </Button>
            }
            onSccess={(id) => {
              reload?.()
              setTimeout(() => {
                setPickedId?.(id)
              }, 100)
            }}
            title={"Thêm UI"}
          />
        </div>
        {isLoading ? (
          <div className="absolute top-0 left-0 right-0 z-50 bottom-0">
            <MaskLoader />
          </div>
        ) : list?.length ? (
          list?.map?.((inf, index) => {
            const isActived = inf?.id == pickedId
            return (
              <Fragment key={index}>
                {index ? <Divider className="my-0" /> : null}
                <ListItem isActived={isActived} ui={inf} />
              </Fragment>
            )
          })
        ) : null}
      </div>
    </div>
  )
}
