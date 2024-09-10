import type { TabsProps } from "antd"
import ViahicleGPS from "../RemindMobile/ViahicleGPS/ViahicleGPS"
import ViahicleNoGPS from "../RemindMobile/ViahicleNoGps/ViahicleNoGPS"
import { ViahicleType } from "../../../interface/interface"

export default function getTabItem(
  viahicles: ViahicleType[],
): TabsProps["items"] {
  return [
    {
      key: "1",
      label: "Phương tiện sử dụng GPS",
      children: <ViahicleGPS viahicles={viahicles} />,
    },
    {
      key: "0",
      label: "Phương tiện không sử dụng GPS",
      children: <ViahicleNoGPS viahicles={viahicles} />,
    },
  ]
}
