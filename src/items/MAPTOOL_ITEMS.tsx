import { Map } from "leaflet"
import { ReactNode } from "react"
import { IconType } from "react-icons"
import { FcSettings } from "react-icons/fc"
import { IoMdSettings } from "react-icons/io"
import { IoSettingsOutline } from "react-icons/io5"
import { TbMapCog } from "react-icons/tb"
import { TfiLayers, TfiMinus, TfiPlus } from "react-icons/tfi"
import { CirButtonC } from "../conponents/ButtonC"
import { MapSettingModal } from "../conponents/modals/SettingModal/MapSettingModal"
import { Checkbox, Popover } from "antd"
import {
  MAP_LINE_TYPE_ITEMS,
  MAP_TYPE_ITEMS,
  VEHICLE_FONT_OPTIONS,
  VEHICLE_SCALE_OPTIONS,
} from "./MAP_TYPE_ITEMS"
import { _app } from "../utils/_app"
import { useAppSelector } from "../app/hooks"
import {
  PiCornersOut,
  PiEyeglassesDuotone,
  PiEyeglassesFill,
  PiMapTrifoldDuotone,
  PiTextAaFill,
} from "react-icons/pi"
import { store } from "../app/store"
import { BsFileFont } from "react-icons/bs"
import { divIconSVG } from "../_assets/markerIcon"
import { BiFontSize } from "react-icons/bi"
import {
  FaArrowAltCircleRight,
  FaHandSparkles,
  FaMapMarkerAlt,
  FaRoute,
} from "react-icons/fa"
import { MdGroupWork, MdPlayArrow } from "react-icons/md"
import { _array } from "../utils/_array"

interface IFuncProps {
  map: Map | null | undefined
}

interface IMAPTOOL_ITEMS {
  type?: "divider"
  title?: string
  icon?: IconType
  iconSize?: number
  iconColor?: string
  iconHoverColor?: string
  component?: ReactNode
  onClick?: () => void
  key: string
  isActived?: boolean
  useResize?: boolean
}

export const MAPTOOL_ITEMS = ({ map }: IFuncProps): IMAPTOOL_ITEMS[] => {
  const currMapType = store?.getState()?.interface?.setting?.map_mapType
  const currMapLineType = store?.getState()?.interface?.setting?.map_mapLineType
  const mapType = MAP_TYPE_ITEMS?.find?.((type) => type?.value == currMapType)
  const mapLineType = MAP_LINE_TYPE_ITEMS?.find?.(
    (type) => type?.value == currMapLineType,
  )
  return [
    {
      title: "Cài đặt",
      key: "setting",
      component: (
        <MapSettingModal
          button={
            <CirButtonC
              tooltip="Cài đặt"
              icon={<IoMdSettings size={19} />}
            ></CirButtonC>
          }
        ></MapSettingModal>
      ),
    },
    {
      title: "Loại bản đồ",
      key: "map_type",
      component: (
        <Popover
          content={<MapTypePickerComponnet />}
          title="Loại bản đồ"
          trigger="click"
          placement="topLeft"
          style={{
            width: 300,
          }}
        >
          <CirButtonC
            tooltip="Loại bản đồ"
            icon={<img className="h-[32px] w-[32px]" src={mapType?.image} />}
          ></CirButtonC>
        </Popover>
      ),
    },

    {
      title: "Thu nhỏ",
      key: "minus",
      icon: TfiMinus,
      iconSize: 16,
      onClick() {
        map && map.zoomOut()
      },
    },
    {
      title: "Phóng to",
      key: "zoom",
      icon: TfiPlus,
      iconSize: 16,
      onClick() {
        map && map.zoomIn()
      },
    },
    {
      title: "Mở rộng vùng xe",
      key: "corner",
      icon: PiCornersOut,
      iconSize: 16,
      onClick() {
        const vList_ = store?.getState?.()?.device?.data?.online?.mArray

        const vList = _array?.select?.switchListToGps(vList_)

        if (vList?.length) {
          map?.fitBounds?.(
            vList
              ?.filter?.((v) => v?.latitude && v?.longitude)
              ?.map?.((v) => [Number(v?.latitude), Number(v?.longitude)]),
          )
        }
      },
    },
    {
      type: "divider",
      key: "divider_1",
    },
    {
      title: "Hiển thị nhãn",
      key: "setting_label",
      icon: PiTextAaFill,
      isActived: store.getState?.()?.interface?.setting?.map_showLabel,
      iconSize: 18,
      onClick() {
        const state = store.getState?.()?.interface?.setting?.map_showLabel
        _app.setting("map_showLabel", !state)
      },
    },
    {
      title: "Kích thước nhãn",
      key: "map_type",
      useResize: true,
      component: (
        <Popover
          content={<MapLabelSizePickerComponnet />}
          title="Kích thước nhãn"
          trigger="click"
          placement="top"
          style={{
            width: 300,
          }}
        >
          <CirButtonC
            tooltip="Kích thước nhãn"
            icon={<BiFontSize size={17} />}
          ></CirButtonC>
        </Popover>
      ),
    },
    // {
    //   type: "divider",
    //   key: "divider_1",
    // },
    {
      title: "Kích thước Icon",
      key: "map_iconSize",
      useResize: true,
      component: (
        <Popover
          content={<MapIconSizePickerComponnet />}
          title="Kích thước Icon"
          trigger="click"
          placement="top"
          style={{
            width: 300,
          }}
        >
          <CirButtonC
            tooltip="Kích thước Icon"
            icon={
              <div
                className="h-6 w-3"
                dangerouslySetInnerHTML={{
                  __html:
                    divIconSVG("", "vehicle", {
                      fillColor: "var(--root-white-text-color)",
                      rotate: 0,
                      vehicleName: null,
                      vehicleMapFont: 9,
                      vehicleMapScalse: 1,
                    }) || "",
                }}
              ></div>
            }
          ></CirButtonC>
        </Popover>
      ),
    },
    {
      type: "divider",
      key: "divider_1",
    },
    {
      title: "Gom phương tiện trên bản đồ",
      key: "map_markerClusterGroup",
      icon: MdGroupWork,
      isActived: store.getState?.()?.interface?.setting?.map_markerClusterGroup,
      iconSize: 18,
      onClick() {
        const state =
          store.getState?.()?.interface?.setting?.map_markerClusterGroup
        _app.setting("map_markerClusterGroup", !state)
      },
    },
    {
      title: "Theo dõi xe di chuyển",
      key: "map_followVehicle",
      icon: PiEyeglassesFill,
      isActived: store.getState?.()?.interface?.setting?.map_followVehicle,
      iconSize: 18,
      onClick() {
        const state = store.getState?.()?.interface?.setting?.map_followVehicle
        _app.setting("map_followVehicle", !state)
      },
    },
    {
      type: "divider",
      key: "divider_1",
    },
    {
      title: "Theo dõi xe di chuyển - Xem lại lộ trình",
      key: "map_followVehiclePlayback",
      icon: PiEyeglassesDuotone,
      isActived:
        store.getState?.()?.interface?.setting?.map_followVehiclePlayback,
      iconSize: 18,
      onClick() {
        const state =
          store.getState?.()?.interface?.setting?.map_followVehiclePlayback
        _app.setting("map_followVehiclePlayback", !state)
      },
    },
    {
      title: "Xem nhanh lộ trình trên đường vẽ lộ trình khi click chuột",
      key: "map_cursorHoverPlayback",
      icon: FaHandSparkles,
      isActived:
        store.getState?.()?.interface?.setting?.map_cursorHoverPlayback,
      iconSize: 18,
      onClick() {
        const state =
          store.getState?.()?.interface?.setting?.map_cursorHoverPlayback
        _app.setting("map_cursorHoverPlayback", !state)
      },
    },

    {
      title: "Hiển thị điểm dừng đỗ",
      key: "map_showParkingMarker",
      icon: FaMapMarkerAlt,
      isActived: store.getState?.()?.interface?.setting?.map_showParkingMarker,
      iconSize: 18,
      onClick() {
        const state =
          store.getState?.()?.interface?.setting?.map_showParkingMarker
        _app.setting("map_showParkingMarker", !state)
      },
    },
    {
      title: "Hiển thị mũi tên chỉ hướng",
      key: "map_showArrowMarker",
      icon: FaArrowAltCircleRight,
      isActived: store.getState?.()?.interface?.setting?.map_showArrowMarker,
      iconSize: 18,
      onClick() {
        const state =
          store.getState?.()?.interface?.setting?.map_showArrowMarker
        _app.setting("map_showArrowMarker", !state)
      },
    },

    {
      title: "Cài đặt màu sắc đường lộ trình",
      key: "map_line_type",
      component: (
        <Popover
          content={<MapLineTypePickerComponnet />}
          title="Cài đặt màu sắc đường lộ trình"
          trigger="click"
          placement="top"
          style={{
            width: 300,
          }}
        >
          <CirButtonC
            tooltip="Cài đặt màu sắc đường lộ trình"
            icon={mapLineType?.ui}
          ></CirButtonC>
        </Popover>
      ),
    },

    {
      title: "Hiển thị lộ trình trên bản đồ khi trỏ vào phương tiện",
      key: "map_showRouteOnline",
      icon: FaRoute,
      isActived: store.getState?.()?.interface?.setting?.map_showRouteOnline,
      iconSize: 18,
      onClick() {
        const state =
          store.getState?.()?.interface?.setting?.map_showRouteOnline
        _app.setting("map_showRouteOnline", !state)
      },
    },
  ]
}

interface IPickerItem {
  label: ReactNode
  onClick?: () => void
  isActived?: boolean
}
export const PickerItem: React.FC<IPickerItem> = ({
  label,
  onClick,
  isActived,
}) => {
  return (
    <div
      style={{
        backgroundColor: isActived ? "var(--theme-hover)" : "var(--white)",
        // color: isActived ? "var(--white)" : "inherit",
      }}
      onClick={onClick}
    >
      <div className="h-[35px] hover:bg-root_hover_bg_dark cursor-pointer flex items-center px-2">
        {label}
      </div>
    </div>
  )
}

const MapTypePickerComponnet: React.FC = () => {
  const mapTypeId = useAppSelector(
    (state) => state?.interface?.setting?.map_mapType,
  )
  return MAP_TYPE_ITEMS?.map?.((mapType, index) => {
    const isActived = mapType?.value == mapTypeId
    return (
      <PickerItem
        key={index}
        label={mapType?.name}
        isActived={isActived}
        onClick={() => {
          _app.setting?.("map_mapType", mapType?.value)
        }}
      />
    )
  })
}

const MapLineTypePickerComponnet: React.FC = () => {
  const mapTypeId = useAppSelector(
    (state) => state?.interface?.setting?.map_mapLineType,
  )
  return MAP_LINE_TYPE_ITEMS?.map?.((mapType, index) => {
    const isActived = mapType?.value == mapTypeId
    return (
      <PickerItem
        key={index}
        label={mapType?.name}
        isActived={isActived}
        onClick={() => {
          _app.setting?.("map_mapLineType", mapType?.value)
        }}
      />
    )
  })
}

const MapIconSizePickerComponnet: React.FC = () => {
  const map_iconSize = useAppSelector(
    (state) => state?.interface?.setting?.map_iconSize,
  )
  return VEHICLE_SCALE_OPTIONS?.map?.((mapType, index) => {
    const isActived = mapType?.value == map_iconSize
    return (
      <PickerItem
        key={index}
        label={mapType?.display}
        isActived={isActived}
        onClick={() => {
          _app.setting?.("map_iconSize", mapType?.value)
        }}
      />
    )
  })
}
const MapLabelSizePickerComponnet: React.FC = () => {
  const map_iconSize = useAppSelector(
    (state) => state?.interface?.setting?.map_labelSize,
  )
  return VEHICLE_FONT_OPTIONS?.map?.((mapType, index) => {
    const isActived = mapType?.value == map_iconSize
    return (
      <PickerItem
        key={index}
        label={mapType?.display}
        isActived={isActived}
        onClick={() => {
          _app.setting?.("map_labelSize", mapType?.value)
        }}
      />
    )
  })
}
