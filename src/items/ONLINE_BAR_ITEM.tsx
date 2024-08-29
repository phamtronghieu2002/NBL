import { Fa6Icon } from "../_assets/icon"
import icons from "../_assets/markerIcon/icons"

export const VEHICLE_TYPE_FILTER_ONLINE = [
  {
    value: 0,
    title: "Tất cả",
    key: "op_ss_all",
  },
  // {
  //   value: 10,
  //   key: "op_ss_errCam",
  //   title: "Lỗi Cam",
  //   reactIcon: <Fa6Icon.FaVideoSlash size={23} color={"var(--red-color)"} />,
  // },
  // {
  //   value: 11,
  //   key: "op_ss_errHardDisk",
  //   title: "Lỗi bộ nhớ",
  //   reactIcon: (
  //     <RiIcon.RiFolderWarningFill size={23} color={"var(--red-color)"} />
  //   ),
  // },
  {
    value: 9,
    key: "op_ss_overSpeed",
    title: "Quá tốc độ",
  },
  {
    value: 10,
    key: "op_ss_over4H",
    title: "Lái xe>4H",
  },
  {
    value: 1,
    key: "op_ss_running",
    title: "Đang chạy",
  },
  {
    value: 2,
    key: "op_ss_stopping",
    title: "Đang dừng",
  },
  {
    value: 3,
    key: "op_ss_stoppingR",
    title: "Đang dừng, bật máy",
  },

  {
    value: 4,
    key: "op_ss_lostGps",
    title: "Mất GPS",
  },
  {
    value: 5,
    key: "op_ss_offline",
    title: "Offline",
  },
  {
    value: 6,
    key: "op_ss_toExpired",
    title: "Sắp hết hạn",
  },
  {
    value: 7,
    title: "Khoá",
    key: "op_ss_blocking",
  },
  {
    value: 11,
    key: "op_ss_haveCam",
    title: "Có camera",
  },
  // {
  //   value: 9,
  //   key: "op_ss_haveFuel",
  //   title: "Có CB dầu",
  //   reactIcon: <MdIcon.MdThermostat size={23} />,
  // },

  {
    value: 8,
    key: "op_ss_other",
    title: "Khác",
  },
]
