import { ReactNode } from "react"
import { _const } from "../_constant"

export interface IMAP_TYPE {
  name: string
  url: string
  copyRight: string
  icon: string
  image: string
  value: number
  type?: string
}

export interface IMAP_LINE_TYPE {
  name: string
  ui: ReactNode
  value: number
}

export const MAP_TYPE_ITEMS: IMAP_TYPE[] = [
  {
    name: "Bản đồ đường bộ",
    url: "https://mt0.google.com/vt/lyrs=m&hl=vi-vn&x={x}&y={y}&z={z}",
    copyRight: "Google Map",
    icon: "fa-road",
    value: 1,
    image: "/assets/images/maptype-1.png",
    type: "roadmap",
  },
  {
    name: "Bản đồ vệ tinh",
    url: "https://mt1.google.com/vt/lyrs=s,h&hl=vi-vn&x={x}&y={y}&z={z}",
    copyRight: "Google Map",
    icon: "fa-globe-asia",
    value: 2,
    image: "/assets/images/maptype-2.png",
    type: "hybrid",
  },
  {
    name: "Base Map",
    url: "https://khms0.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png",
    copyRight: "basemaps.cartocdn.com",
    icon: "fa-globe",
    value: 3,
    image: "/assets/images/maptype-3.png",
  },
]

export const MAP_LINE_TYPE_ITEMS: IMAP_LINE_TYPE[] = [
  {
    name: "Màu đường vẽ cơ bản",
    value: 1,
    ui: (
      <div
        className="h-6 rotate-45 w-1 rounded-full"
        style={{
          backgroundColor: _const?.color?.polilineDefault,
        }}
      ></div>
    ),
  },
  {
    name: "Màu đường vẽ biểu thị theo tốc độ",
    ui: (
      <div
        className="h-6 rotate-45 w-1 rounded-full"
        style={{
          // background: "rgb(14,189,0)",
          background:
            "linear-gradient(0deg, rgba(14,189,0,1) 0%, rgba(241,138,55,1) 48%, rgba(255,0,0,1) 100%)",
        }}
      ></div>
    ),
    value: 2,
  },
]

export const VEHICLE_FONT_OPTIONS = [
  {
    value: 7,
    display: "Nhỏ",
  },
  {
    value: 10,
    display: "Vừa",
  },
  {
    value: 12,
    display: "Lớn",
  },
  {
    value: 15,
    display: "Rất Lớn",
  },
]

export const VEHICLE_SCALE_OPTIONS = [
  {
    value: 0.8,
    display: "Nhỏ",
  },
  {
    value: 0.9,
    display: "Vừa",
  },
  {
    value: 1,
    display: "Lớn",
  },
  {
    value: 1.15,
    display: "Rất Lớn",
  },
]

export const ROUTE_SPEED_OPTIONS = [
  {
    value: 1,
    label: "x1",
  },
  {
    value: 2,
    label: "x2",
  },
  {
    value: 4,
    label: "x4",
  },
  {
    value: 8,
    label: "x8",
  },
  {
    value: 12,
    label: "x12",
  },
  {
    value: 16,
    label: "x16",
  },
]
