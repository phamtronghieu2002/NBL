import { memo } from "react"
import { useBreadcrumb } from "../../../hooks/useBreadcrumb"
import { Breadcrumb } from "antd"
import { IHEADER } from "../../../items/HEADER_ITEMS"

export const BreadcrumbHead: React.FC = memo(() => {
  const [keyActive, route, his, hisArr] = useBreadcrumb()
  console.log('====================================');
  console.log('BreadcrumbHead', hisArr);
  console.log('====================================');
  const items = hisArr?.map?.((menu, index) => {
    return { title: menu?.title }
  })

  return <Breadcrumb items={items} />
})
